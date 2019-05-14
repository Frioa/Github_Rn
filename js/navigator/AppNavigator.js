// 1. createStackNavigator 可以跳回欢迎页， createSwitchNavigator 不跳回欢迎页
import {createStackNavigator,
    createSwitchNavigator,
    createAppContainer
} from "react-navigation"
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import FetchDemoPage from '../page/FetchDemoPage'
import {connect} from 'react-redux'
import {createReactNavigationReduxMiddleware, createReduxContainer}from 'react-navigation-redux-helpers'

export const rootCom = 'Init'; // 设置根路由

const InitNavigator = createStackNavigator({
   WelcomePage: {
       screen: WelcomePage,
       navigationOptions: {
            header: null // 可以通过将 header 设置为 null 来禁用StackNavigator 的 Navigation Bar
       }
   }
});

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null // 可以通过将 header 设置为 null 来禁用StackNavigator 的 Navigation Bar
        }
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
          //  header: null // 可以通过将 header 设置为 null 来禁用StackNavigator 的 Navigation Bar
        }
    },
    FetchDemoPage: {
        screen: FetchDemoPage,
        navigationOptions: {
            //  header: null // 可以通过将 header 设置为 null 来禁用StackNavigator 的 Navigation Bar
        }
    },
});

export const RootNavigator = createAppContainer(createSwitchNavigator({
    Init:InitNavigator,
    Main:MainNavigator,
}, {
    defaultNavigationOptions: {
        header: null // 可以通过将 header 设置为 null 来禁用StackNavigator 的 Navigation Bar
    }
}));

/**
 * 1. 初始化 react-navigation 与 redux 的中间件，
 * 该方法的一个很大的作用为 reduxifyNavigator 的key 设置 actionSubscribers （行为订阅者），
 * 设置订阅者
 * 检测订阅者是否存在
 * @type {Middleware}
 */
export const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    'root'
);

/**
 * 2. 将导航器组件传递给 createReduxContainer 函数，
 * 并返回一个将 navigation state 和 dispatch 函数作为 props 的新组件
 * 注意：要在 createReactNavigationReduxMiddleware 之后执行
 *
 */
const AppWithNavigationState = createReduxContainer(RootNavigator, 'root');

/**
 * State 到 Props 的映射关系
 * @param state
 * @returns {{state: NavigationState}}
 */
const mapStateToProps = state => ({
    state: state.nav // v2
});

/**
 * 3. 连接 React 与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState);