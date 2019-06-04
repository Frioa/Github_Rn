import {combineReducers} from 'redux'
import theme from './theme'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import language from './language'
import {rootCom, RootNavigator} from '../navigator/AppNavigator'

//1. 指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

/**
 * 2. 创建自己的 navigation reducer
 * @param state
 * @param action
 * @returns {any}
 */
    const navReducer = (state = navState, action) => {
    const nextState = RootNavigator.router.getStateForAction(action, state);
    // 如果 nextState  为 null 或未定义，只需返回原始的 state
    return nextState || state
};

/**
 * 3. 合并reducer
 * @type {Reducer<any>}
 */
const index = combineReducers({
    nav: navReducer,
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
    language: language,
});

export default index;