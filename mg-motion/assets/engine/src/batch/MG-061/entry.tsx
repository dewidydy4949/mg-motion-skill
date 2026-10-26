import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Props,Template,validateProps} from './model';
import {referenceProps,usageProps} from './demo';
const metadata=({props}:{props:Props})=>({durationInFrames:Math.round(validateProps(props).durationSeconds*30)});
const Root=()=> <>
<Composition id="MG-061-Reference" component={Template} width={1920} height={1080} fps={30} durationInFrames={261} defaultProps={referenceProps} calculateMetadata={metadata}/>
<Composition id="MG-061-Usage" component={Template} width={1920} height={1080} fps={30} durationInFrames={330} defaultProps={usageProps} calculateMetadata={metadata}/>
</>;
registerRoot(Root);
