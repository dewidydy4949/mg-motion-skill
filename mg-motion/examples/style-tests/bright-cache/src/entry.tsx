import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Scene} from './Cache';

// 独立缓存机制示意；动作和图形在 Cache.tsx。
const Root = () => <Composition id="Supplement" component={Scene} width={1920} height={1080} fps={30} durationInFrames={360} />;
registerRoot(Root);
