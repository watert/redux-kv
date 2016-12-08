# redux-kv
key-value util component for redux and redux-react usage

## API Reference

### install reducer

should placed in redux state.kv

example:
```javascript
import { reducer as kvReducer } from 'redux-kv'
const reducers = {
  // ... your other reducers here...
  kv: kvReducer
}
const store = createStore(combineReducers(reducers))
```

### setValue(keyName: String, value: Any)

creates an action to set a single value of a key

example: `dispatch(setValue('key', 'value'))`

### setValues(values: Object)

creates an action to set multiple values

example: `dispatch(setValues({ key1: 'v1', key2: 'v2' }))`

### resetValues

resets all values to `undefined`

### selector(state: ReduxState, [keyName: String])

select needed value or all values from redux state.
usually used in `mapStateToProps` method

example:
```javascript
function mapStateToProps(state) { // used in your own connect method
  const { key1 } = kvSelector(state);
  const key2 = kvSelector(state, 'key2')
  return { key1, key2 };
}
```

### createKV(config: Object)

creates custom reducer, selector, actionCreators, and withKV with options

configs:
* getState: (state) => state.kv // position of reducer
* initialValues: {}
* prefix: 'REDUX_KV'

custom example:
```javascript
const { reducer, selector, setValue, resetValues } = createKV({
  prefix:'CUSTOM_KEY', initialValues: {k: 'defaultValue'},
  getState: (state) => state.customOptions,
})
```

### withKV(config: Object)

#### config properties:
- `keys`: [...String]: used keys in component

#### component props:
- `kv` { keys, values, ...keyObjects }
  - `keys` [...String] : used keys in component
  - `values` (Object) values of keys
  - `[keyName]` (Object)
    - `value`: Any: value of key
    - `setValue`: function(value: Any): dispatch a set value method to redux store

## quick start:
### Step #1: setup reducer to redux store
```javascript
import { createStore, combineReducers } from 'redux'
import { reducer as kvReducer } from 'redux-kv'
const reducers = {
  // ... your other reducers here...
  kv: kvReducer
}
const store = createStore(combineReducers(reducers))
```

### Step #2
// using in component:
```javascript
import { withKV } from 'redux-kv'
class KVView extends Component {
  componentDidMount() {
    this.props.kv.kName.setValue('hello world')
  }
  render() {
    const { kv } = this.props
    return <p>{kv.values.kName}</p> // hello world
  }
}
const KVContainer = withKV({
  keys: ['kName']
})
```

```javascript
// using selector
import { selector as kvSelector } from 'redux-kv'
function mapStateToProps(state) { // used in your connect method
  const { key1 } = kvSelector(state);
  const key2 = kvSelector(state, 'key2')
  return { key1, key2 };
}
// using actionCreators outside
import { setValue, setValues } from 'redux-kv'
function mapDispatchToProps(dispatch) {
  return {
    setKey1(value) {
      return dispatch(setValue('key1', value))
    },
    setupMultiValues() {
      return dispatch(setValues({ key1: 'value1', key2: 'value2' }))
    }
  }
}
```


## TODOs:

- [x] createKV method document
