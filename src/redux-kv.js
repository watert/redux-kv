/*
*/
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const defaultOptions = {
  getState: (state) => state.kv, // 默认从 kv 字段中读取
  initialValues: {},
  prefix: 'REDUX_KV',
}
export function createSelector(options = {}) {
  options = { ...defaultOptions, ...options }
  const { getState } = options
  function selector(storeState, key) {
    const state = options.getState(storeState)
    if(key) return state[key]
    return state
  }
  return selector
}
export function createActionCreators(options = {}) {
  options = { ...defaultOptions, ...options }
  const { prefix } = options
  function setValues(object = {}) {
    return {type: `${prefix}_SET_VALUES`, payload: object }
  }
  function setValue(key, value) {
    return setValues({ [key]: value })
  }
  function resetValues() {
    return { type: `${prefix}_RESET` }
  }
  return { setValue, setValues, resetValues }
}
function pick(object, keys) {
  let result = {}
  keys.forEach((key) => {
    result[key] = object[key]
  })
  return result
}
export function withKV(options = {}) {
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
export function createReducer(options = {}) {
  options = { ...defaultOptions, ...options }
  const { initialValues, prefix } = options
  function reducer(state = initialValues, action) {
    if(action.type === `${prefix}_RESET`) {
      return initialValues
    }
    if(action.type === `${prefix}_SET_VALUES`) {
      const { payload } = action
      return { ...state, ...payload }
    }
    return state
  }
  return reducer
}
export function createKV(options = {}) {
  options = { ...defaultOptions, ...options }
  const { getState, initialValues, prefix } = options
  return {
    selector: createSelector({ getState }),
    reducer: createReducer({ prefix, initialValues }),
    ...createActionCreators({ prefix }),
  }
}
export const {
  selector, reducer,
  setValue, setValues, resetValues
} = createKV()
