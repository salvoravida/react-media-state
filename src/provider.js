import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { MediaStateContext } from './context';
import { isSameState } from './core';

class MediaStateProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.windowSizeListeners = [];
    this.value = {
      debug: props.debug,
      mediaState: props.getMediaState(),
      getMediaState: props.getMediaState,
      subscribe: this.subscribe
    };
  }

  componentDidMount = () => {
    this.mounted = true;
    window.addEventListener('resize', this.onWindowResize);
  };

  componentWillUnmount = () => {
    this.mounted = false;
    window.removeEventListener('resize', this.onWindowResize);
  };

  onWindowResize = () => {
    if (!this.mounted) return;
    const mediaState = this.props.getMediaState();
    if (!isSameState(mediaState, this.value.mediaState)) {
      this.value.mediaState = mediaState;
      const freezedListeners = this.windowSizeListeners.slice(0);
      ReactDOM.unstable_batchedUpdates(() => {
        freezedListeners.forEach(c => c(mediaState));
      });
    }
  };

  subscribe = (callback) => {
    this.windowSizeListeners.push(callback);
    return () => this.windowSizeListeners.splice(this.windowSizeListeners.indexOf(callback), 1);
  };

  render() {
    return (
      <MediaStateContext.Provider value={this.value}>
        {this.props.children}
      </MediaStateContext.Provider>
    );
  }
}

MediaStateProvider.propTypes = {
  getMediaState: PropTypes.func.isRequired,
  children: PropTypes.any.isRequired,
  debug: PropTypes.bool
};

export { MediaStateProvider };
