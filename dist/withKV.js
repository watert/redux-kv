'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = withKV;

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _creators = require('./creators');

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
  var selector = (0, _creators.createSelector)(options);
  var actionCreators = (0, _creators.createActionCreators)(options);
  var mapStateToProps = function mapStateToProps(state) {
    var kvData = pick(selector(state), keys);
    return { kvData: kvData, keys: keys };
  };
  var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return { dispatch: dispatch };
  };
  function mergeProps(_ref, _ref2, ownProps) {
    var kvData = _ref.kvData,
        keys = _ref.keys;
    var dispatch = _ref2.dispatch;

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