import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { defaultOptions, createSelector, createActionCreators } from './creators'

function pick(object, keys) {
  let result = {}
  keys.forEach((key) => {
    result[key] = object[key]
  })
  return result
}

export default function withKV(options = {}) {
  options = {
    ...defaultOptions,
    ...options
  }
  const { keys } = options
  if(!keys || !keys.length) {
    throw new TypeError('[redux-kv] options.keys is not an array in withKV method')
  }
  const selector = createSelector(options)
  const actionCreators = createActionCreators(options)
  const mapStateToProps = (state) => {
    const kvData = pick(selector(state), keys)
    return { kvData, keys }
  }
  const mapDispatchToProps = (dispatch) => {
    return { dispatch }
  }
  function mergeProps({ kvData, keys }, { dispatch }, ownProps) {
    const kv = { values: kvData }
    keys.forEach((key) => {
      kv[key] = {
        value: kvData[key],
        setValue(value) {
          return dispatch(actionCreators.setValue(key, value))
        },
      }
    })
    return {...ownProps, dispatch, kv}
  }

  return connect(mapStateToProps, mapDispatchToProps, mergeProps)
}
