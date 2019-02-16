import React from 'react';
import invariant from 'tiny-invariant';

export function getCurrentComponent() {
  invariant(
    React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current,
    'You are using Hooks outside of "render" Function Component!',
  );
  return React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current.elementType;
}

export function filterState(mediaState, mediaKeys) {
  if (mediaKeys && mediaKeys.length > 0) {
    const filteredState = {};
    mediaKeys.forEach((k) => {
      filteredState[k] = mediaState[k];
    });
    return filteredState;
  }
  return mediaState;
}

export function isSameState(prevState, newState) {
  return Object.keys(prevState).reduce((acc, key) => acc && prevState[key] === newState[key], true);
}

