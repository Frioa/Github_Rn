// 1. createStackNavigator 可以跳回欢迎页， createSwitchNavigator 不跳回欢迎页
import {createStackNavigator,
    createMaterialTopTabNavigator,
    createBottomTabNavigator,
    createSwitchNavigator,
    createAppContainer
} from "react-navigation"
import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'

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
    }
});

export default createAppContainer(createSwitchNavigator({
    Init:InitNavigator,
    Main:MainNavigator,
}, {
    navigationOptions: {
        header: null // 可以通过将 header 设置为 null 来禁用StackNavigator 的 Navigation Bar
    }
}))