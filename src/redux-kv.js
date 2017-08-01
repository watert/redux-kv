/*
*/
// import React, { Component } from 'react';
import withKV from './withKV';

import { defaultOptions, createKVSelector, createActionCreators,
  createReducer,
} from './creators';

export function createKV(opts = {}) {
  const options = { ...defaultOptions, ...opts };
  const { getState, initialValues, prefix } = options;
  const { setValue, setValues, resetValues } = createActionCreators({ prefix });
  return {
    selector: createKVSelector({ getState }),
    reducer: createReducer({ prefix, initialValues }),
    withKV: (moreOptions = {}) => withKV({ ...options, ...moreOptions }),
    setValue, setValues, resetValues,
  };
}
export { withKV };
export const {
  selector, reducer,
  setValue, setValues, resetValues,
} = createKV();
