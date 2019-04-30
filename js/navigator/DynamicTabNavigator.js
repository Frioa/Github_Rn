import React, {Component} from 'react';
import {
    createAppContainer,
    createBottomTabNavigator,
} from "react-navigation"
import {Platform, StyleSheet, Text, View} from 'react-native';


type Props = {};
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import NavigationUtil from "../navigator/NavigationUtil";
import {BottomTabBar} from 'react-navigation-tabs';

const TABS = { // 这里配置页面路由
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: "趋势",
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={'md-trending-up'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),

        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: "收藏",
            tabBarIcon: ({tintColor, focused}) => (
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({tintColor, focused}) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{color: tintColor}}
                />
            ),
        }
    }
};

/**
 * 动态获取路由，可以通过网络获得需要显示的Tab
 */
export default class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true // 禁止Waring
    }

    static _tabNavigator() {
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage}; // 根据需要定制显示的tab
        PopularPage.navigationOptions.tabBarLabel = '最新'; // 动态配置Tab属性
        return createAppContainer(createBottomTabNavigator(tabs,{
            tabBarComponent: TabBarComponent // 自定义 react-native 组件
            }
        ));
    }


    render() {
        // 保存外部 navigation , 可以使用外部的跳转
        NavigationUtil.navigation = this.props.navigation;
        const Tab = DynamicTabNavigator._tabNavigator();
        return <Tab/>
    }
}
class TabBarComponent extends React.Component{
    constructor(props) {
        super(props);
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime()    // 取当前系统时间
        }
    }
    render() {
        const {routes, index} = this.props.navigation.state; // 获取主题属性
        if (routes[index].params){
            const {theme} = routes[index].params;
            // 以最新的更新时间为主，防止其他tab之前的修改被覆盖
            if (theme && theme.updateTime > this.theme.updateTime) { // 判断时间
                this.theme = theme  // 改变主题
            }
        }
        return <BottomTabBar
            {...this.props} // 上个页面的属性传递过来
            activeTintColor = {this.theme.tintColor || this.props.activeTintColor}
        />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },

});
