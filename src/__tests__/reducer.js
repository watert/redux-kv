import { reducer } from '../redux-kv'
import { createSelector, createActionCreators, createReducer } from '../creators'
import { assert } from 'chai'

describe('reducer', () => {

  it('SET_VALUES', () => {
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
    const reducer2 = createReducer({ initialValues: { k: 'v'} })
    const action = { type: 'REDUX_KV_RESET' }
    assert.deepEqual(reducer({k: 'hello'}, action), {})
    assert.deepEqual(reducer2({k: 'hello'}, action), { k :'v' })
  })
})
