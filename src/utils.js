import React from 'react';

// Enclosing scope for local state variables.
export var styleComponentSubstring = (() => {

  let _start,
      _end,
      _styles,
      _index;

  // Will deep clone the component tree, wrapping any text within
  // the start/end with a styled span.
  function alterComponent(component) {

    let {children, stamp, style} = component.props,
        cloneProps;

    if (stamp) {

      if (_index >= _start && (!_end || _index < _end)) {
        cloneProps = {
          style: React.addons.update(style || {}, {$merge: _styles})
        };
      }
      _index++;
    } else {
      cloneProps = {children: React.Children.map(children, alterChild)};
    }

    if (cloneProps) {
      return React.cloneElement(component, cloneProps);
    } else {
      return component;
    }

  }

  // Alters any text in the child, checking if the text falls within
  // the start/end range.
  function alterChild(child) {

    if (typeof child !== 'string') {

      return alterComponent(child);

    } else {

      let strEnd = child.length + _index;

      if (strEnd > _start && (!_end || _index < _end)) {

        // compute relative string start and end indexes
        let relStartIndex = _start - _index,
            relEndIndex = _end ? (_end - _index) : strEnd;

        // generate the substrings
        let unstyledTextLeft = child.substring(0, relStartIndex),
            styledText = child.substring(relStartIndex, relEndIndex),
            unstyledTextRight = child.substring(relEndIndex, strEnd);

        let styledSpan = <span style={_styles}>{styledText}</span>;

        child = [unstyledTextLeft, styledSpan, unstyledTextRight];

      }

      _index = strEnd;

      return child;

    }

  }

  /**
   * Styles the in any text nodes that are decendants of the component
   * if they fall within the specified range. Ranges are relative to
   * all the text within the component including text in decendant nodes.
   * A specific characters index is calculated as the number of all characters
   * indexed before it in an pre-order traversal of the tree minus one.
   *
   * Example:
   * styleComponentSubstring(<p>Hello <a>World</a></p>, {color: 'blue'}, 3, 8);
   * >>> <p>Hel<span style="color: blue">lo </span><a><span style="color: blue">Wo</span>rld</a></p>
   *
   * @param  {React Component} component The component to be cloned.
   * @param  {Object} styles    The styles to be applied to the text.
   * @param  {Number} start     The start index.
   * @param  {Number} end       The end index.
   * @return {React Component}
   */
  return function(component, styles, start, end) {

    // reset local state variables
    _styles = styles || {};

    if (start > end) {
      _end = start;
      _start = end;
    } else {
      _start = start || 0;
      _end = end;
    }

    _index = 0;

    return alterComponent(component);

  };

})();

// returns the character at the components text index position.
export var componentTokenAt = (() => {

  let _index;

  function findComponentTokenAt(component) {

    let {children} = component.props,
        childCount = React.Children.count(children),
        token;

    if (childCount <= 1) {
      children = [children];
    }

    let childIndex = 0;

    while (!token && childIndex < childCount) {

      let child = children[childIndex++];

      if (typeof child !== 'string') {

        // treat Stamp components as a single token.
        if (child.props.stamp) {
          if (!_index) {
            token = child;
          } else {
            _index--;
          }

        } else {
          token = findComponentTokenAt(child);
        }

      } else if (_index - child.length < 0) {
        token = child.charAt(_index);
      } else {
        _index -= child.length;
      }

    }

    return token;

  }

  /**
   * Returns the token/character at the components text index position.
   * The index position is the index of a string of all text nodes
   * concatinated depth first.
   *
   * @param  {React Component} component Component to search.
   * @param  {Number} index     The index position.
   * @return {Char}           The token at the index position.
   */
  return function(component, index) {

    if (index < 0) {
      return undefined;
    }

    _index = index;
    return findComponentTokenAt(component);

  };

})();
