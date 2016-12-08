import React, { Component } from 'react'
import { reducer, withKV, createKV } from '../redux-kv'
import { assert } from 'chai'
import { shallow, mount } from 'enzyme'
import { createStore, combineReducers } from 'redux'
import { connect, Provider } from 'react-redux'

describe('withKV with react', () => {
  const initialState = { kv: { key: 'a', key2: 'b' } }
  const {
    setValue: setOption,
    reducer: optionsReducer,
    selector: selectOptions,
    withKV: withOptions
  } = createKV({
    getState: (state) => state.options,
    prefix: 'OPTIONS',
    initialValues: { optKey: 'optVal', test:'test'}
  })
  const reducers = combineReducers({ kv: reducer, options: optionsReducer })
  const store = createStore(reducers, initialState)
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
  it('use custom createKV', () => {
    const ConnectOptionsContainer = withOptions({ keys: ['optKey'] })(KVContainer)
    const root = mount(<Root><ConnectOptionsContainer /></Root>)
    const optionsView = root.find('KVContainer')
    assert.equal(setOption('optKey2', 'v2').type, 'OPTIONS_SET_VALUES',
      'prefix correct')
    assert.deepEqual(optionsView.props().kv.values, {optKey: 'optVal'})
    store.dispatch(setOption('optKey2', 'v2'))
    assert.equal(selectOptions(store.getState(), 'optKey2'), 'v2')
  })
})
