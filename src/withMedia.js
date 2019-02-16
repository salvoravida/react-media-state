import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { isSameState, filterState } from './core';
import { MediaStateContext } from './context';

// TODO options mediaPrefix, forwardKey

export function withMedia(WrappedComponent, options) {
  const WithMediaStateComponent = class extends React.Component {
    constructor(props, context) {
      super(props);
      this.mediaKeys = (options && options.mediaKeys) ||
          Object.keys(WrappedComponent.propTypes || {}).filter(p => p.indexOf('media') === 0);
      this.state = filterState(context.mediaState, this.mediaKeys);
    }

    componentDidMount =() => {
      this.mounted = true;
      this.unsubscribe = this.context.subscribe(this.onMediaChange);
    };

    componentWillUnmount = () => {
      this.mounted = false;
      if (this.unsubscribe) this.unsubscribe();
    };

    onMediaChange = (mediaState) => {
      if (this.mounted) {
        const newState = filterState(mediaState, this.mediaKeys);
        if (!isSameState(this.state, newState)) {
          if (this.context.debug) {
            console.log(`withMedia - Debug : ${WrappedComponent.displayName || WrappedComponent.name}`, this.state, '=>', newState);
          }
          this.setState(newState);
        }
      }
    };

    render() {
      return (
        <WrappedComponent {...this.props} {...this.state} />
      );
    }
  };

  WithMediaStateComponent.contextType = MediaStateContext;
  WithMediaStateComponent.displayName = `withMedia(${WrappedComponent.displayName || WrappedComponent.name})`;

  return hoistStatics(WithMediaStateComponent, WrappedComponent);
}
