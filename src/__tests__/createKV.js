import { createKV } from '../redux-kv'
import { assert } from 'chai'
import { createStore, combineReducers } from 'redux'


describe('createKV with redux', () => {
  const { reducer, selector, setValue, resetValues } = createKV()
  const reducers = combineReducers({ kv: reducer })
  const store = createStore(combineReducers({kv: reducer}))
  it('should have init store', () => {
    assert.deepEqual(store.getState().kv, {}, 'should init store')
  })
  it('set kv value', () => {
    store.dispatch(setValue('k', 'v'))
    assert.equal(selector(store.getState(), 'k'), 'v', 'should set value')
  })
  it('reset values', () => {
    store.dispatch(setValue('k2', 'v2'))
    store.dispatch(resetValues())
    assert.deepEqual(selector(store.getState()), {}, 'reset values')
  })
})

describe('createAll custom options', () => {
  const { reducer, selector, setValue, resetValues } = createKV({
    prefix:'CUSTOM_KEY', initialValues: {k: 'defaultValue'},
    getState: (state) => state.customOptions,
  })
  const store = createStore(combineReducers({customOptions: reducer}))
  function getValue(key) { return selector(store.getState(), key) }
  it('should have initialValues on `customOptions`', () => {
    assert.deepEqual(store.getState().customOptions, {k: 'defaultValue'});
  })
  it('selector work', () => {
    expect(getValue('k')).toBe('defaultValue')
  })
  it('action work', () => {
    store.dispatch(setValue('k', 'v'))
    expect(getValue('k')).toBe('v')
  })
})
