import { selector } from '../redux-kv'
import { createSelector } from '../creators'
import { assert } from 'chai'
describe('selectors', () => {
  const data = { k:'v', k2:'v2' }
  it('basic', () => {
    const storeState = { kv: data }
    expect(selector(storeState, 'k')).toBe('v')
  })
  it('get all values', () => {
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
