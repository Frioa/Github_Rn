import {applyMiddleware, createStore} from 'redux'
import reducers from '../reducer'
import thunk from 'redux-thunk'
import {middleware} from '../navigator/AppNavigator'

// 自定义中间键，日志打印
const logger = store =>next=>action=>{
    if (typeof action === 'function'){
        console.log('dispatching a function');
    }else {
        console.log('dispatching', action);
    }
    const result = next(action);
    console.log('nextState', store.getState());
    return result
};

const middlewares  = [
    middleware,
    logger,
    thunk,// 配置异步action
];

/**
 * 创建store
 */

export default createStore(reducers, applyMiddleware(...middlewares));