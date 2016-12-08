'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createSelector = createSelector;
exports.createActionCreators = createActionCreators;
exports.createReducer = createReducer;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOptions = exports.defaultOptions = {
  getState: function getState(state) {
    return state.kv;
  }, // 默认从 kv 字段中读取
  initialValues: {},
  prefix: 'REDUX_KV'
};
function createSelector() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, defaultOptions, options);
  var _options = options,
      getState = _options.getState;

  function selector(storeState, key) {
    var state = options.getState(storeState);
    if (key) return state[key];
    return state;
  }
  return selector;
}
function createActionCreators() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, defaultOptions, options);
  var _options2 = options,
      prefix = _options2.prefix;

  function setValues() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return { type: prefix + '_SET_VALUES', payload: object };
  }
  function setValue(key, value) {
    return setValues(_defineProperty({}, key, value));
  }
  function resetValues() {
    return { type: prefix + '_RESET' };
  }
  return { setValue: setValue, setValues: setValues, resetValues: resetValues };
}
function createReducer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, defaultOptions, options);
  var _options3 = options,
      initialValues = _options3.initialValues,
      prefix = _options3.prefix;

  function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialValues;
    var action = arguments[1];

    if (action.type === prefix + '_RESET') {
      return initialValues;
    }
    if (action.type === prefix + '_SET_VALUES') {
      var payload = action.payload;

      return _extends({}, state, payload);
    }
    return state;
  }
  return reducer;
}