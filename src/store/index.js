// reducers/index.js
import { combineReducers } from 'redux';

// 示例 reducer
const initialState = {
  example: 'Hello, Redux!',
};

function exampleReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_EXAMPLE':
      return { ...state, example: action.payload };
    default:
      return state;
  }
}

// 组合所有的 reducers
const rootReducer = combineReducers({
  example: exampleReducer,
});

export default rootReducer;
