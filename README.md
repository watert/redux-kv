# redux-kv
kv util component for redux and redux-react usage

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
