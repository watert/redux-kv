'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetValues = exports.setValues = exports.setValue = exports.reducer = exports.selector = exports.withKV = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*
                                                                                                                                                                                                                                                                  */


exports.createKV = createKV;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _withKV2 = require('./withKV');

var _withKV3 = _interopRequireDefault(_withKV2);

var _creators = require('./creators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createKV() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  options = _extends({}, _creators.defaultOptions, options);
  var _options = options,
      getState = _options.getState,
      initialValues = _options.initialValues,
      prefix = _options.prefix;

  return _extends({
    selector: (0, _creators.createKVSelector)({ getState: getState }),
    reducer: (0, _creators.createReducer)({ prefix: prefix, initialValues: initialValues }),
    withKV: function withKV() {
      var moreOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return (0, _withKV3.default)(_extends({}, options, moreOptions));
    }
  }, (0, _creators.createActionCreators)({ prefix: prefix }));
}
exports.withKV = _withKV3.default;

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