import { createEnhancedConnect } from '../src/index.js'
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import './config';
import { mount } from 'enzyme';



function setup(Component) {
  function reducer(state = 5, action) {
    switch (action.type) {
      case 'INC':
        return state + 1;
      case 'INC_BY':
        return state + action.payload;
      default:
        return state;
    }
  }

  var store = createStore(reducer);

  var enzymeWrapper = mount(
    <Provider store={store}>
      <Component />
    </Provider>
  )

  return {
    enzymeWrapper,
    store
  }
}

describe('#enhancedConnect', () => {
  function Dummy(props) {
    return <div></div>;
  }

  it('connects a single selector correctly', () => {
    var selectors = {
      counter(state) {
        return state;
      }
    }
    var enhancedConnect = createEnhancedConnect(selectors);
    var connected = enhancedConnect(['counter'])(Dummy)

    var { enzymeWrapper } = setup(connected);

    var dum = enzymeWrapper.find(Dummy);

    expect(dum.prop('counter')).toEqual(5);
  });

  it('connects multiple selectors correctly', () => {
    var selectors = {
      counter(state) {
        return state;
      },
      counterPlusTwo(state) {
        return state + 2;
      },
      counterPlusFive(state) {
        return state + 5;
      }
    }
    var enhancedConnect = createEnhancedConnect(selectors);
    var connected = enhancedConnect([
      'counterPlusFive',
      'counterPlusTwo',
      'counter']
    )(Dummy)

    var { enzymeWrapper } = setup(connected);

    var dum = enzymeWrapper.find(Dummy);

    expect(dum.prop('counter')).toEqual(5);
    expect(dum.prop('counterPlusTwo')).toEqual(7);
    expect(dum.prop('counterPlusFive')).toEqual(10);
  });

  it('only connects the selectors listed', () => {
    var selectors = {
      counter(state) {
        return state;
      },
      counterPlusTwo(state) {
        return state + 2;
      },
      counterPlusFive(state) {
        return state + 5;
      }
    }
    var enhancedConnect = createEnhancedConnect(selectors);
    var connected = enhancedConnect([
      'counterPlusTwo',
      'counter'
    ])(Dummy);

    var { enzymeWrapper } = setup(connected);

    var dum = enzymeWrapper.find(Dummy);

    expect(dum.prop('counter')).toEqual(5);
    expect(dum.prop('counterPlusTwo')).toEqual(7);
    expect(dum.prop('counterPlusFive')).toBe(undefined);
  });

  it('throws an error when listing a selector that doesnt exist', () => {
    var selectors = {
      counter(state) {
        return state;
      }
    }
    var enhancedConnect = createEnhancedConnect(selectors);

    expect(enhancedConnect([
      'counterPlusTwo',
      'counter']
    )).toThrowError("Key does not exist: counterPlusTwo");
  });

  it('connects a single action correctly', () => {
    var actions = {
      inc() {
        return {
          type: "INC"
        };
      }
    }

    var enhancedConnect = createEnhancedConnect({}, actions);
    var connected = enhancedConnect([], ['inc'])(Dummy);

    var { enzymeWrapper } = setup(connected);

    var dum = enzymeWrapper.find(Dummy);

    expect(dum.prop('inc')).toBeDefined();
  });

  it('connects a multiple actions correctly', () => {
    var actions = {
      inc() {
        return {
          type: "INC"
        };
      },
      incBy(val) {
        return {
          type: "INC_BY",
          payload: val
        };
      }
    }

    var enhancedConnect = createEnhancedConnect({}, actions);
    var connected = enhancedConnect([], ['inc', 'incBy'])(Dummy);

    var { enzymeWrapper } = setup(connected);

    var dum = enzymeWrapper.find(Dummy);

    expect(dum.prop('inc')).toBeDefined();
    expect(dum.prop('incBy')).toBeDefined();
  });

  it('throws an error when trying to connected a nonexistant action', () => {
    var actions = {
      inc() {
        return {
          type: "INC"
        };
      }
    }

    var enhancedConnect = createEnhancedConnect({}, actions);
    expect(
      enhancedConnect([], ['inc', 'incBy'])
    ).toThrowError('Key does not exist: incBy');
  });

  it('connects actions and selectors', () => {
    var actions = {
      inc() {
        return {
          type: "INC"
        };
      }
    }

    var selectors = {
      counter(state) {
        return state;
      }
    }

    var enhancedConnect = createEnhancedConnect(selectors, actions);
    var connected = enhancedConnect(['counter'], ['inc'])(Dummy);

    var { enzymeWrapper } = setup(connected);

    var dum = enzymeWrapper.find(Dummy);

    expect(dum.prop('inc')).toBeDefined();
    expect(dum.prop('counter')).toBeDefined();
  });
});
