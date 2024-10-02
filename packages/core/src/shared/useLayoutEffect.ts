import { useEffect, useLayoutEffect } from 'react';

import { CAN_USE_DOM } from './canUseDOM';

// This workaround is no longer necessary in React 19,
// but we currently support React >=17.x
// https://github.com/facebook/react/pull/26395
export const useLayoutEffectImpl: typeof useLayoutEffect = CAN_USE_DOM ? useLayoutEffect : useEffect;
