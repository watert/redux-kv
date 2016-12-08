import { setValue, setValues, resetValues } from '../redux-kv'
import { createActionCreators } from '../creators'
import { assert } from 'chai'

describe('actionCreators', () => {
  const setAction = {type: 'REDUX_KV_SET_VALUES', payload:{'name': 'value'}}
  it('setValue basic', () => {
    assert.deepEqual( setValue('name', 'value'), setAction, 'setValue action' )
  })
  it('setValues basic', () => {
    const setValuesAction = {type: 'REDUX_KV_SET_VALUES', payload:{
      name1: 'value1', name2: 'value2'
    }}
    assert.deepEqual( setValues({name1: 'value1', name2: 'value2'}), setValuesAction, 'setValue action' )
  })
  it('setValue with prefix', () => {
    const { setValue, resetValues } = createActionCreators({ prefix: 'HELLO' })
    const action = {...setAction, type:'HELLO_SET_VALUES'}
    assert.deepEqual( setValue('name', 'value'), action, 'setValue action' )
  })
})
