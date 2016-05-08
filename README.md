react-typewriter
================

A react component for animated typing text.

Installation
------------

```
npm install --save react-typewriter
```

Usage
-------------

Pass in children to the TypeWriter component like any other component. Make sure to set the `typing` property to 1 when you want the component to begin animating.

```jsx
import React from 'react';
import TypeWriter from 'react-typewriter';

class YourReactClass extends React.Component {

  render() {
    return (
      // Passing in text.
      <TypeWriter typing={1}>Hello World!</TypeWriter>
    );
  }

}
```

You can also pass in other components such as anchor tags and spans.

```jsx
<TypeWriter typing={1}>
  Hello
  <span style={{color: 'blue'}}>World</span>
  !
</TypeWriter>
```

Child components can be nested as deep as necessary. Text is typed out as each character appears in a pre-order traversal of the nested structure.

Documentation
-------------

### TypeWriter

#### props.typing

type: `Integer`
default: `0`

A value of 1 will cause the component type text left to right until completion. A value of -1 will cause the component to *erase* text right to left.

#### props.maxDelay

type: `Integer`
default: `100`

The maximum delay between each typed token in milliseconds.

#### props.minDelay

type: `Integer`
default: `20`

The minimum delay between each typed token in milliseconds.

#### props.fixed

type: `Boolean`
default: `false`

This flag will ensure the enclosing container's size and shape is fixed. Prevents the text from shifting around as it grows into its container.

#### props.delayMap

type: `Array[Object]`
default: `none`

Allows for setting characters or indexes that will increase or decrease the delay period until the next character.

The array contains objects requiring two keys: `at:` can either be a character, integer, or regex. If there are characters that match the string or regex, the delay period following that character will be increased by the `delay:` amount.

```js
var delays = [{
  // At index 4, increase the delay period by 100ms.
  at: 4,
  delay: 100
},
{
  // Add a 400ms delay following every period character.
  at: '.',
  delay: 400
}];
```

#### props.onTyped

type: `Function`
default: `none`

This callback is called when each token is typed in the typing animation. If the animation is erasing, it is called after each token is erased. The token that was typed/erased is passed as the first parameter in the callback. The token may be either a character or a React component. Will also pass the previous number of visible characters.

#### props.onTypingEnd

type: `Function`
default: `none`

This callback is called once the typing animation has completed. This is when all text has been either revealed or erased.

### props.stamp

type: `Boolean`

This property should be set on any TypeWriter child components that should be treated as a single token or stamp. The text inside a component with the `stamp` property will not be typed out, but will be revealed all at once.

Here, `World!` will be stamped onto the page instead of typed out:

```jsx
<TypeWriter typing={1}>
  Hello
  <span stamp>World!</span>
</TypeWriter>
```

### refs.reset

type: `Function`

This function can be called in order to *erase* the text immediately.


License
-------

[MIT](https://github.com/ianbjorndilling/react-typewriter/blob/master/LICENSE.md)
