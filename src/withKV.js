import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { defaultOptions, createKVSelector, createActionCreators } from './creators';
// import shallowCompare from 'shallow-compare'
// import { createSelector } from 'reselect'
function pick(object, keys) {
  const result = {};
  keys.forEach((key) => {
    result[key] = object[key];
  });
  return result;
}

export default function withKV(opts = {}) {
  const options = { ...defaultOptions, ...opts };
  const { keys } = options;
  if (!keys || !keys.length) {
    throw new TypeError('[redux-kv] options.keys is not an array in withKV method');
  }
  const selectKV = createKVSelector(options);
  // const cacheSelectValues = createSelector(
  //   (state) => selectKV(state),
  //   (kvState) => pick(kvState, keys)
  // )
  const actionCreators = createActionCreators(options);
  const mapStateToProps = state => pick(selectKV(state), keys);
  // const mapDispatchToProps = (dispatch) => ({ dispatch })
  function mergeProps(kvData, { dispatch }, ownProps) {
    const kv = { values: kvData };
    keys.forEach((key) => {
      kv[key] = {
        value: kvData[key],
        setValue(value) {
          return dispatch(actionCreators.setValue(key, value));
        },
      };
    });
    return { ...ownProps, dispatch, kv };
  }

  return connect(mapStateToProps, undefined, mergeProps);
}
