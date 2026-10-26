import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Template,validateProps,Props} from './model';
import {referenceProps,usageProps} from './demo';
const Root=()=> <>{([['Reference',referenceProps],['Usage',usageProps]] as const).map(([variant,p])=><Composition key={variant} id={'MG-051-'+variant} component={Template} width={1920} height={1080} fps={30} durationInFrames={Math.round(p.duration*30)} defaultProps={p} calculateMetadata={({props})=>{validateProps(props as Props);return {durationInFrames:Math.round(props.duration*30)}}}/>)}</>;
registerRoot(Root);