import React from 'react';
import {styleComponentSubstring, componentTokenAt} from '../utils';

/**
 * TypeWriter
 */
class TypeWriter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleChars: 0
    };

    this._handleTimeout = this._handleTimeout.bind(this);
  }

  componentDidMount() {
    this._timeoutId = setTimeout(this._handleTimeout, this.props.initDelay);
  }

  componentWillUnmount() {
    clearInterval(this._timeoutId);
  }

  componentWillReceiveProps(nextProps) {
    const next = nextProps.typing;
    const active = this.props.typing;

    if (active > 0 && next < 0) {
      this.setState({
        visibleChars: this.state.visibleChars - 1
      });
    } else if (active <= 0 && next > 0) {
      this.setState({
        visibleChars: this.state.visibleChars + 1
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { children } = this.props;
    const nextChildren = nextProps.children;
    const childrenAreStrings = typeof children === 'string' && typeof nextChildren === 'string';
    // TODO Implement childrenChanged for non-string children as well
    const childrenChanged = childrenAreStrings && children !== nextChildren;
    const visibleCharsChanged = this.state.visibleChars !== nextState.visibleChars;

    return (visibleCharsChanged || childrenChanged);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      maxDelay,
      minDelay,
      delayMap,
      onTypingEnd,
      onTyped
    } = this.props;
    const token = componentTokenAt(this, prevState.visibleChars);
    const nextToken = componentTokenAt(this, this.state.visibleChars);

    if (token && onTyped) {
      onTyped(token, prevState.visibleChars);
    }

    // check the delay map for additional delays at the index.
    if (nextToken) {
      const tokenIsString = (typeof token === 'string');
      let timeout = Math.round(Math.random() * (maxDelay - minDelay) + minDelay);

      if (delayMap) {
        for (let i = 0; i < delayMap.length; i++) {
          let mapping = delayMap[i];
          if ((mapping.at === prevState.visibleChars) ||
              (tokenIsString && token.match(mapping.at))) {
            timeout += mapping.delay;
            break;
          }
        }
      }

      this._timeoutId = setTimeout(this._handleTimeout, timeout);
    } else if (onTypingEnd) {
      onTypingEnd();
    }
  }

  reset() {
    this.setState({
      visibleChars: 0
    });
  }

  render() {
    const {
      children,
      fixed,
      ...props
    } = this.props;
    const {
      visibleChars
    } = this.state;
    const container = <span {...props}>{children}</span>;
    const hideStyle = fixed ? {visibility: 'hidden'} : {display: 'none'};

    return styleComponentSubstring(container, hideStyle, visibleChars);
  }

  _handleTimeout() {
    const {typing} = this.props;
    const {visibleChars} = this.state;

    this.setState({
      visibleChars: visibleChars + typing
    });
  }
}

TypeWriter.propTypes = {
  fixed: React.PropTypes.bool,
  delayMap: React.PropTypes.arrayOf(React.PropTypes.shape({
    at: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.instanceOf(RegExp)
    ]),
    delay: React.PropTypes.number
  })),
  typing(props, propName) {
    const prop = props[propName];

    if (!(Number(prop) === prop && prop % 1 === 0) || (prop < -1 || prop > 1)) {
      return new Error('typing property must be an integer between 1 and -1');
    }
  },
  maxDelay: React.PropTypes.number,
  minDelay: React.PropTypes.number,
  onTypingEnd: React.PropTypes.func,
  onTyped: React.PropTypes.func
};

TypeWriter.defaultProps = {
  typing: 0,
  initDelay: 1000,
  maxDelay: 100,
  minDelay: 20
};

export default TypeWriter;
