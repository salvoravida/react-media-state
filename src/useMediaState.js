import { useContext, useEffect, useState, useRef } from 'react';
import { isSameState, filterState, getCurrentComponent } from './core';
import { MediaStateContext } from './context';

// TODO mediakeys a options

export function useMediaState(mediaKeys) {
  const { mediaState, debug, subscribe } = useContext(MediaStateContext);
  const forceUpdate = useState()[1];
  const mounted = useRef(false);
  const stateRef = useRef(filterState(mediaState, mediaKeys));

  const Component = debug ? getCurrentComponent() : null;

  const onMediaChange = (newMediaState) => {
    if (mounted.current) {
      const prevState = { ...stateRef.current };
      const newState = filterState(newMediaState, mediaKeys);
      if (!isSameState(prevState, newState)) {
        if (debug) {
          console.log(`useMediaState - Debug : ${Component.displayName || Component.name}`, prevState, '=>', newState);
        }
        stateRef.current = newState;
        forceUpdate();
      }
    }
  };

  useEffect(() => {
    mounted.current = true;
    const unsubscribe = subscribe(onMediaChange);
    return () => {
      mounted.current = false;
      unsubscribe();
    };
  }, []);

  return stateRef.current;
}
