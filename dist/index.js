'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEnhancedConnect = createEnhancedConnect;

var _reactRedux = require('react-redux');

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

function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (fns.length === 1) {
    return function () {
      return fns[0].apply(fns, arguments);
    };
  }

  return fns.reduce(function (acc, curr) {
    return function () {
      return acc(curr.apply(undefined, arguments));
    };
  });
}

var makePropsFromSelectors = compose(makeProps, pick);

function createEnhancedConnect() {
  var allSelectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var allActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return function enhancedConnect(selectorList) {
    var actionList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return function (component) {
      var mapStateToProps = selectorList.length ? makePropsFromSelectors(allSelectors, selectorList) : function () {
        return {};
      };
      var mapDispatchToProps = actionList.length ? pick(allActions, actionList) : undefined;

      return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(component);
    };
  };
}
//# sourceMappingURL=index.js.map