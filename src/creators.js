export const defaultOptions = {
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
