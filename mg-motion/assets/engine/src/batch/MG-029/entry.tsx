import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Template,validateProps,Props} from './model';
import {referenceProps,usageProps} from './demo';
const metadata=({props}:{props:Props})=>{validateProps(props);return {durationInFrames:Math.round(props.durationSeconds*30)}};
const Root=()=> <>
<Composition id="MG-029-Reference" component={Template} width={1920} height={1080} fps={30} durationInFrames={240} defaultProps={referenceProps} calculateMetadata={metadata}/>
<Composition id="MG-029-Usage" component={Template} width={1920} height={1080} fps={30} durationInFrames={210} defaultProps={usageProps} calculateMetadata={metadata}/>
</>;
registerRoot(Root);
