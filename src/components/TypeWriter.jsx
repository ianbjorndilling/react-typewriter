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
    this._timeoutId = setTimeout(this._handleTimeout, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._timeoutId);
  }

  componentWillReceiveProps(nextProps) {

    let next = nextProps.typing,
        active = this.props.typing;

    if (active > 0 && next < 0) {
      this.setState({
        visibleChars: this.state.visibleChars - 1
      });
    } else if (active < 0 && next > 0) {
      this.setState({
        visibleChars: this.state.visibleChars + 1
      });
    }

  }

  shouldComponentUpdate(nextProps, nextState) {

    return (this.state.visibleChars !== nextState.visibleChars);

  }

  componentDidUpdate(prevProps, prevState) {

    let {maxDelay, minDelay, delayMap, onTypingEnd, onTyped, typing} = this.props,
        token = componentTokenAt(this, prevState.visibleChars),
        nextToken = componentTokenAt(this, this.state.visibleChars);

    if (token && onTyped) {
      onTyped(token, prevState.visibleChars);
    }

    // check the delay map for additional delays at the index.
    if (nextToken) {

      let timeout = Math.round(Math.random() * (maxDelay - minDelay) + minDelay),
          tokenIsString = (typeof token === 'string');

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

  render() {

    let {children, fixed, delayMap, typing, maxDelay, minDelay, ...props} = this.props,
        {visibleChars} = this.state,
        container = <span {...props}>{children}</span>;

    let hideStyle = fixed ? {visibility: 'hidden'} : {display: 'none'};

    return styleComponentSubstring(container, hideStyle, visibleChars);

  }

  _handleTimeout() {

    let {typing} = this.props,
        {visibleChars} = this.state;

    this.setState({
      visibleChars: visibleChars + typing
    });

  }

}

TypeWriter.propTypes = {

  fixed: React.PropTypes.bool,

  delayMap: React.PropTypes.arrayOf(React.PropTypes.shape({
    at: React.PropTypes.oneOfType([React.PropTypes.string,
                                   React.PropTypes.number,
                                   React.PropTypes.instanceOf(RegExp)]),
    delay: React.PropTypes.number
  })),

  typing: function(props, propName) {

    let prop = props[propName];

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
  maxDelay: 100,
  minDelay: 20

};

export default TypeWriter;
