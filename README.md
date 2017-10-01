# React Redux Props Helper

This package provides a simpler way to connect actions and selectors to a
React component.

## Sample Usage
Use `createEnhancedConnect` by passing it all of your selectors and all of your
actions. It will return a function that you can use similarly to connect. Just
pass an array of the selector names you want to use as its first argument,
and an other array of action names as its second argument. If you only want to
connect actions, just pass an empty array as the first argument.

```javascript
  // './enhancedConnect.js'
  import { createEnhancedConnect } from 'react-redux-props-helper';

  import * as selectors from './selectors';
  import * as actions from './actions';

  export default createEnhancedConnect(selectors, actions);

  // './SomeConnectedComponent.js'
  import React from 'react';
  import enhancedConnect from './enhancedConnect';

  function SomeConnectedComponent({
    selector1,
    selector3,
    action2,
    action3
  }) {
    //...body of component
  }

  var mapStateToProps = ['selector1', 'selector3'];
  var mapDispatchToProps = ['action2', 'action3'];

  export default enhancedConnect(mapStateToProps, mapDispatchToProps)(SomeConnectedComponent);
```
