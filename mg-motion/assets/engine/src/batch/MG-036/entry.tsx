import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {Template,validateProps} from './model';
import {referenceProps,usageProps} from './demo';
const Root=()=> <>{[['Reference',referenceProps],['Usage',usageProps]].map(([name,props])=><Composition key={name as string} id={'MG-036-'+name} component={Template} width={1920} height={1080} fps={30} durationInFrames={Math.round((props as typeof referenceProps).durationSeconds*30)} defaultProps={props as typeof referenceProps} calculateMetadata={({props})=>({durationInFrames:Math.round(validateProps(props).durationSeconds*30)})}/>)}</>;
registerRoot(Root);

