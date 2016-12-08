/*
*/
import React, { Component } from 'react'
import withKV from './withKV'

import { defaultOptions, createSelector, createActionCreators,
  createReducer} from './creators'

export function createKV(options = {}) {
  options = { ...defaultOptions, ...options }
  const { getState, initialValues, prefix } = options
  return {
    selector: createSelector({ getState }),
    reducer: createReducer({ prefix, initialValues }),
    withKV: (moreOptions = {}) => {
      return withKV({ ...options, ...moreOptions })
    },
    ...createActionCreators({ prefix }),
  }
}
export { withKV }
export const {
  selector, reducer,
  setValue, setValues, resetValues
} = createKV()
