import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import rootReducer from './reducers';
import reducer from './reducer';
// import rootSaga from './sagas';
import rootSaga from './saga';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create the Redux store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// Run the saga middleware
sagaMiddleware.run(rootSaga);

export default store;
