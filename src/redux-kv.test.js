import React, { Component } from 'react'
import { createReducer, createActionCreators, createSelector, createKV,
  reducer, withKV, } from './redux-kv.js'
import { createStore, combineReducers } from 'redux'
import { connect, Provider } from 'react-redux'
import { assert } from 'chai'
import { shallow, mount } from 'enzyme';

describe('redux-kv', () => {

  describe('reducer', () => {

    it('SET_VALUES', () => {
      const reducer = createReducer()
      const action = { type: 'REDUX_KV_SET_VALUES', payload:{ key: 'value' } }
      const action2 = { type: 'REDUX_KV_SET_VALUES', payload:{ k: 'v', k2: 'v2' } }
      assert.deepEqual(reducer({}, action), {key: 'value'},
        'simple set value')
      assert.deepEqual(reducer({k: 'v'}, action), {key: 'value', k:'v'},
        'original value should not change')
      assert.deepEqual(reducer({key: 'value2'}, action), {key: 'value'},
        'value changed')
      assert.deepEqual(reducer({key: 'value2'}, action), {key: 'value'},
        'value changed')
      // expect(reducer({k2: 'v2'}, action)['key']).toBe('value')
    })
    it('RESET', () => {
      const reducer = createReducer()
      const reducer2 = createReducer({ initialValues: { k: 'v'} })
      const action = { type: 'REDUX_KV_RESET' }
      assert.deepEqual(reducer({k: 'hello'}, action), {})
      assert.deepEqual(reducer2({k: 'hello'}, action), { k :'v' })
    })
  })
  describe('selectors', () => {
    const data = { k:'v', k2:'v2' }
    it('basic', () => {
      const selector = createSelector()
      const storeState = { kv: data }
      expect(selector(storeState, 'k')).toBe('v')
    })
    it('get all values', () => {
      const selector = createSelector()
      const storeState = { kv: data }
      assert.deepEqual(selector(storeState), data)
    })
    it('custom getState', () => {
      const getState = (state) => state.options
      const selector = createSelector({ getState })
      const storeState = { options: data }
      expect(selector(storeState, 'k')).toBe('v')
    })
  })

  describe('actionCreators', () => {
    const setAction = {type: 'REDUX_KV_SET_VALUES', payload:{'name': 'value'}}
    it('setValue basic', () => {
      const { setValue, resetValues } = createActionCreators()
      assert.deepEqual( setValue('name', 'value'), setAction, 'setValue action' )
    })
    it('setValue with prefix', () => {
      const { setValue, resetValues } = createActionCreators({ prefix: 'HELLO' })
      const action = {...setAction, type:'HELLO_SET_VALUES'}
      assert.deepEqual( setValue('name', 'value'), action, 'setValue action' )
    })
  })
  describe('createAll with redux', () => {
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
  describe('withKV with react', () => {
    const initialState = { kv: { key: 'a', key2: 'b' } }
    const store = createStore(combineReducers({ kv: reducer }), initialState)
    const Root = ({ children }) => {
      return <Provider store={store}>{children}</Provider>
    }
    const KVContainer = () => null
    const ConnectKVContainer = withKV({ keys: ['key2'] })(KVContainer)
    it('basic connect', () => {
      const root = mount(<Provider store={store}><ConnectKVContainer /></Provider>)
      const kvc = root.find('KVContainer')
      assert.deepEqual(kvc.props().kv.values, {key2: 'b'}, 'select key2 only' )
    })
    it('using actionCreators', () => {
      const root = mount(<Root><ConnectKVContainer /></Root>)
      const kvc = root.find('KVContainer')
      assert.equal(kvc.props().kv.key2.value, 'b', 'key2 old value' )
      kvc.props().kv.key2.setValue('newValue')
      assert.equal(kvc.props().kv.key2.value, 'newValue', 'key2 value changed' )
    })
  })
})
