"""Original procedural music/SFX study for a 20s motion-graphics prototype.

Uses only numpy and Python standard library. No source recordings or copied melody.
This is an optional draft soundtrack, not a substitute for visual motion design.
"""
from pathlib import Path
import json
import math
import wave
import argparse
import numpy as np

parser = argparse.ArgumentParser(description='Generate an optional original 20-second rhythm/SFX study.')
parser.add_argument('--out', default='out', help='Output directory; defaults to ./out')
ROOT = Path(parser.parse_args().out).resolve()
ROOT.mkdir(parents=True, exist_ok=True)
SR = 48000
SECONDS = 20
N = SR * SECONDS
RNG = np.random.default_rng(27102026)
music = np.zeros((N, 2), dtype=np.float64)
sfx = np.zeros_like(music)
events = []


def times(seconds):
    return np.arange(round(seconds * SR)) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def envelope(t, attack=.012, release=.12):
    a = np.sin(np.minimum(t / attack, 1) * np.pi / 2) ** 2
    r = np.sin(np.minimum((t[-1] - t) / release, 1) * np.pi / 2) ** 2
    return a * r


def add(buf, start, sound, gain=1.0, pan=0.0):
    pos = round(start * SR)
    a, b = max(0, pos), min(N, pos + len(sound))
    if a >= b:
        return
    x = sound[a-pos:b-pos] * gain
    if x.ndim == 1:
        angle = (pan + 1) * np.pi / 4
        x = np.column_stack((x * np.cos(angle), x * np.sin(angle)))
    buf[a:b] += x


def noise(seconds, low=300, high=2400):
    t = times(seconds)
    source = RNG.normal(size=len(t))
    f = np.fft.rfftfreq(len(t), 1 / SR)
    spectrum = np.fft.rfft(source)
    # Smooth frequency boundaries avoid harsh ringing in the short sweeps.
    taper = (1 - np.exp(-(f / max(1, low)) ** 4)) * np.exp(-(f / high) ** 4)
    out = np.fft.irfft(spectrum * taper, n=len(t))
    return out / max(1e-9, np.sqrt(np.mean(out*out)))


def pluck(midi, seconds=.85, softness=1.0):
    t = times(seconds)
    freq = hz(midi)
    # Rounded mallet-like timbre, with stronger partials decaying sooner.
    fundamental = np.sin(2*np.pi*freq*t) * np.exp(-t*4.3)
    second = .22*np.sin(2*np.pi*freq*2.002*t) * np.exp(-t*9)
    third = .07*np.sin(2*np.pi*freq*3.006*t) * np.exp(-t*15)
    return (fundamental + second + third) * envelope(t, .008*softness, .12)


def bass(midi, seconds=1.4):
    t = times(seconds)
    f = hz(midi)
    body = np.sin(2*np.pi*f*t) + .13*np.sin(2*np.pi*f*2*t)
    return body * np.exp(-t*2.1) * envelope(t, .045, .25)


def soft_kick():
    t = times(.22)
    phase = 2*np.pi*(47*t + (22/.035)*.035**2*(1-np.exp(-t/.035)))
    return np.sin(phase) * np.exp(-t*23) * envelope(t, .006, .08)


def wood():
    t = times(.10)
    return (np.sin(2*np.pi*430*t)+.25*np.sin(2*np.pi*703*t)) * np.exp(-t*55) * envelope(t,.003,.035)


def pad(notes, seconds=2.8):
    t = times(seconds)
    output = np.zeros((len(t), 2))
    for i, midi in enumerate(notes):
        f=hz(midi)
        left=np.sin(2*np.pi*f*.9992*t+i*.7) + .07*np.sin(2*np.pi*f*2*t)
        right=np.sin(2*np.pi*f*1.0008*t+i*.7) + .07*np.sin(2*np.pi*f*2*t)
        output += np.column_stack((left,right)) / len(notes)
    return output * envelope(t,.48,.75)[:,None]


# 100 BPM; gentle, sparse pulses. Chord voices are intentionally low and warm.
beat=.6
bars=[(38,[62,65,69,72]), (34,[58,62,65,69]),
      (41,[60,64,65,69]), (36,[60,62,67,72]),
      (38,[62,65,69,72]), (34,[58,62,65,69]),
      (41,[60,64,65,69]), (38,[62,65,69,72])]
for bar,(root,notes) in enumerate(bars):
    start=bar*2.4
    add(music,start,pad(notes),.095)
    add(music,start,bass(root),.105)
    # A simple original gesture; rests keep the visual events dominant.
    gestures=[(0.30,notes[0]),(0.90,notes[2]),(1.65,notes[1]),(2.10,notes[3])]
    for j,(offset,note) in enumerate(gestures):
        add(music,start+offset,pluck(note,1.05),.056 if j<2 else .042,(-.24,.23,-.12,.30)[j])
for k in range(16):
    add(music,k*1.2,soft_kick(),.13)
    if k % 2 == 1:
        add(music,k*1.2+.6,wood(),.028,.15)
    # Soft brush rather than a bright hi-hat.
    for offset in [.6]:
        sh=noise(.075,1800,4300)
        sh*=envelope(times(.075),.008,.035)*np.exp(-times(.075)*35)
        add(music,k*1.2+offset,sh,.008,-.3 if k%2 else .3)


def sweep(start, seconds, gain=.055, reverse=False, pan=0):
    t=times(seconds)
    n=noise(seconds,250,1900)
    env=np.sin(np.pi*t/seconds)**1.6
    if reverse:
        env=(t/seconds)**2 * envelope(t,.02,.025)
    n=n*env
    add(sfx,start,n,gain,pan)


def chime(start, notes, gain=.11):
    for i,note in enumerate(notes):
        add(sfx,start+i*.042,pluck(note,1.10,1.4),gain/(1+i*.3),-.2+i*.2)


# Events are explicitly tied to the animation's semantic changes.
chime(.06,[62,69],.09)
events.append({'seconds':0,'meaning':'主题建立','sound':'soft two-tone'} )
sweep(2.22,.28,.032,False,-.1)
chime(2.4,[69,74],.105)
events.append({'seconds':2.4,'meaning':'积分主体出现','sound':'light sweep and mallet'} )
sweep(4.56,.44,.060,True)
hit_t=times(.32)
hit=np.sin(2*np.pi*(105*hit_t-55*hit_t**2)) * np.exp(-hit_t*16)*envelope(hit_t,.004,.12)
add(sfx,5.0,hit,.21)
sweep(5.01,.36,.026,False,.16)
events.append({'seconds':5.0,'meaning':'到期瞬间失效','sound':'inward sweep and muted low hit; no explosion'} )
for when,notes,meaning in [(7.2,[62,65],'聚合到用量'),(10.2,[65,69],'重排到单位成本'),(13.2,[67,72],'重排到产能')]:
    sweep(when-.19,.32,.03,False)
    chime(when,notes,.095)
    # Four very soft clicks evoke the same dot group arranging itself.
    for j in range(4):
        add(sfx,when+j*.075,wood(),.026,-.3+j*.2)
    events.append({'seconds':when,'meaning':meaning,'sound':'shared sweep/click/mallet motif'} )
sweep(16.36,.30,.04,True)
chime(16.6,[62,69,74],.105)
events.append({'seconds':16.6,'meaning':'结论收拢','sound':'resolved mallet cluster'} )
chime(19.0,[74],.065)
events.append({'seconds':19.0,'meaning':'结尾落点','sound':'single soft note, then fade'} )


def ambience(signal, wet=.10):
    # A small stereo echo field softens dry synthesis, kept below the direct sound.
    out=signal.copy()
    for delay,gain,swap in [(.071,.42,True),(.137,.31,False),(.223,.19,True),(.341,.13,False)]:
        n=round(delay*SR)
        source=signal[:-n,::-1] if swap else signal[:-n]
        out[n:]+=source*wet*gain
    return out


music=ambience(music,.18)
sfx=ambience(sfx,.14)
t=np.arange(N)/SR
fade=np.clip((SECONDS-t)/.7,0,1)**1.2
fade*=np.minimum(t/.025,1)
music*=fade[:,None]
sfx*=fade[:,None]
mixed=music+sfx
# Modest draft level, with ample transient headroom. Relative stems stay aligned.
master=min(.67/max(1e-9,np.max(np.abs(mixed))),10**(-23/20)/max(1e-9,np.sqrt(np.mean(mixed*mixed))))
mixed*=master
sfx*=master
music*=master


def write_wav(name, data):
    clipped=int(np.count_nonzero(np.abs(data)>=1))
    if clipped:
        raise ValueError(f'{name}: clipping before PCM encoding')
    pcm=np.round(data*32767).astype('<i2')
    file=ROOT/name
    with wave.open(str(file),'wb') as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes(pcm.tobytes())
    with wave.open(str(file),'rb') as wav:
        info={'file':name,'sampleRate':wav.getframerate(),'channels':wav.getnchannels(),'frames':wav.getnframes(),'durationSeconds':wav.getnframes()/wav.getframerate()}
    info.update({'peakDbFS':round(20*math.log10(max(1e-12,np.max(np.abs(data)))),3),'rmsDbFS':round(20*math.log10(max(1e-12,np.sqrt(np.mean(data*data)))),3),'clippedSamples':clipped,'bytes':file.stat().st_size})
    return info


report={
    'description':'Original procedural optional music/SFX draft. No voice or external recordings.',
    'bpm':100,
    'events':events,
    'masterGain':float(master),
    'files':[write_wav('credits-music-sfx-20s.wav',mixed),write_wav('credits-sfx-only-20s.wav',sfx),write_wav('credits-music-only-20s.wav',music)],
    'validation':'Checked PCM duration, stereo format, waveform RMS and peak, and absence of clipping. Audio has not been listened to in this run.'
}
(ROOT/'audio-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2))
