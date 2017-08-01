'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withKV;

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _creators = require('./creators');

// import shallowCompare from 'shallow-compare'
// import { createSelector } from 'reselect'
function pick(object, keys) {
  var result = {};
  keys.forEach(function (key) {
    result[key] = object[key];
  });
  return result;
}

function withKV() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, _creators.defaultOptions, options);
  var _options = options,
      keys = _options.keys;

  if (!keys || !keys.length) {
    throw new TypeError('[redux-kv] options.keys is not an array in withKV method');
  }
  var selectKV = (0, _creators.createKVSelector)(options);
  // const cacheSelectValues = createSelector(
  //   (state) => selectKV(state),
  //   (kvState) => pick(kvState, keys)
  // )
  var actionCreators = (0, _creators.createActionCreators)(options);
  var mapStateToProps = function mapStateToProps(state) {
    return pick(selectKV(state), keys);
  };
  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return { dispatch: dispatch };
  };
  function mergeProps(kvData, _ref, ownProps) {
    var dispatch = _ref.dispatch;

    var kv = { values: kvData };
    keys.forEach(function (key) {
      kv[key] = {
        value: kvData[key],
        setValue: function setValue(value) {
          return dispatch(actionCreators.setValue(key, value));
        }
      };
    });
    return _extends({}, ownProps, { dispatch: dispatch, kv: kv });
  }

  return (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps, mergeProps);
}