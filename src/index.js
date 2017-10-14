import { connect } from 'react-redux';

function makeProps(selectors) {
  return function (state, ownProps) {
    return Object.keys(selectors).reduce(function (acc, key) {
      acc[key] = selectors[key](state, ownProps);
      return acc;
    }, {});
  };
}

function pick(obj, list) {
  return list.reduce(function (acc, curr) {
    var val = obj[curr];

    if (val === undefined) {
      throw Error('Key does not exist: ' + curr);
    } else {
      acc[curr] = val;
      return acc;
    }
  }, {});
}

function compose(...fns) {
  if (fns.length === 0) {
    return arg => arg;
  }

  if (fns.length === 1) {
    return function (...args) {
      return fns[0](...args);
    };
  }

  return fns.reduce(function (acc, curr) {
    return function (...args) {
      return acc(curr(...args));
    }
  });
}

var makePropsFromSelectors = compose(makeProps, pick);

export function createEnhancedConnect(
  allSelectors = {},
  allActions = {}
) {
  return function enhancedConnect(selectorList, actionList = []) {
    return function (component) {
      var mapStateToProps = selectorList.length ?
        makePropsFromSelectors(allSelectors, selectorList) :
        () => ({});
      var mapDispatchToProps = actionList.length ?
        pick(allActions, actionList) :
        undefined;

      return connect(mapStateToProps, mapDispatchToProps)(component);
    }
  }
}
