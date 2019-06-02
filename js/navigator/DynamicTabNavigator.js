import React, {Component} from 'react';
import {
    createAppContainer,
    createBottomTabNavigator,
} from "react-navigation"
import {DeviceInfo, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux'

type Props = {};
import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import EventTypes from "../util/EventTypes";
import {BottomTabBar} from 'react-navigation-tabs';
import EventBus from "react-native-event-bus";


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
class DynamicTabNavigator extends Component<Props> {
    constructor(props) {
        super(props);
        console.disableYellowBox = true // 禁止Waring
    }

     _tabNavigator() {
        if (this.Tabs) { // 更新主题不重新创建createBottomTabNavigator
            return this.Tabs;
        }
        const {PopularPage, TrendingPage, FavoritePage, MyPage} = TABS;
        const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage}; // 根据需要定制显示的tab
        PopularPage.navigationOptions.tabBarLabel = '最新'; // 动态配置Tab属性
        return this.Tabs = createAppContainer(createBottomTabNavigator(tabs,{
            tabBarComponent: props=>{
                return <TabBarComponent theme={this.props.theme} {...props}/>
            } // 自定义 react-native 组件
            }
        ));
    }
    render() {
        // 保存外部 navigation , 可以使用外部的跳转
        // NavigationUtil.navigation = this.props.navigation;
        const Tab = this._tabNavigator();
        return <Tab
            onNavigationStateChange = {(prevState, newState, action) => {
                // 底部Tab切换发送事件之前的状态，切换之后的状态
                EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select,{ // 发送底部tab切换的事件
                    from : prevState.index,
                    to: newState.index,
                })
            }}/>
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
        // BottomTabBar 用于显示底部自定义Tab
        return <BottomTabBar
            {...this.props} // 上个页面的属性传递过来
            activeTintColor = {this.props.theme}
        />
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme,
});

export default connect(mapStateToProps)(DynamicTabNavigator)
