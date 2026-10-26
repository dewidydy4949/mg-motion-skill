import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {TableFocus, validateTableFocus} from './model';
import {referenceProps, usageProps} from './demo';

const P02Root: React.FC = () => <>
  <Composition id="P02-Reference" component={TableFocus} defaultProps={referenceProps} width={1920} height={1080} fps={30} durationInFrames={300} calculateMetadata={({props})=>{validateTableFocus(props);return {durationInFrames:Math.round(props.durationSeconds*30)};}}/>
  <Composition id="P02-Usage" component={TableFocus} defaultProps={usageProps} width={1920} height={1080} fps={30} durationInFrames={300} calculateMetadata={({props})=>{validateTableFocus(props);return {durationInFrames:Math.round(props.durationSeconds*30)};}}/>
</>;

registerRoot(P02Root);
