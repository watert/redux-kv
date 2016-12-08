'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetValues = exports.setValues = exports.setValue = exports.reducer = exports.selector = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                  */


exports.createSelector = createSelector;
exports.createActionCreators = createActionCreators;
exports.withKV = withKV;
exports.createReducer = createReducer;
exports.createKV = createKV;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultOptions = {
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
function pick(object, keys) {
  var result = {};
  keys.forEach(function (key) {
    result[key] = object[key];
  });
  return result;
}
function withKV() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, defaultOptions, options);
  var _options3 = options,
      keys = _options3.keys;

  if (!keys || !keys.length) {
    throw new TypeError('[redux-kv] options.keys is not an array in withKV method');
  }
  var selector = createSelector(options);
  var actionCreators = createActionCreators(options);
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
function createReducer() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, defaultOptions, options);
  var _options4 = options,
      initialValues = _options4.initialValues,
      prefix = _options4.prefix;

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
function createKV() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, defaultOptions, options);
  var _options5 = options,
      getState = _options5.getState,
      initialValues = _options5.initialValues,
      prefix = _options5.prefix;

  return _extends({
    selector: createSelector({ getState: getState }),
    reducer: createReducer({ prefix: prefix, initialValues: initialValues })
  }, createActionCreators({ prefix: prefix }));
}

var _createKV = createKV();

var selector = _createKV.selector,
    reducer = _createKV.reducer,
    setValue = _createKV.setValue,
    setValues = _createKV.setValues,
    resetValues = _createKV.resetValues;
exports.selector = selector;
exports.reducer = reducer;
exports.setValue = setValue;
exports.setValues = setValues;
exports.resetValues = resetValues;
