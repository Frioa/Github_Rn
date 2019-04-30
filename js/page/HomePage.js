import React, {Component} from 'react';
import {
    createAppContainer,
    createBottomTabNavigator,
} from "react-navigation"
import {Platform, StyleSheet, Text, View} from 'react-native';


type Props = {};
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import NavigationUtil from "../navigator/NavigationUtil";


export default class HomePage extends Component<Props> {
     static _tabNavigator() {
        return createAppContainer(createBottomTabNavigator({
            PopularPage: {
                screen: PopularPage,
                navigationOptions: {
                    tabBarLabel: "最热",
                    tabBarIcon: ({tintColor, focused}) => (
                        <MaterialIcons
                            name = {'whatshot'}
                            size = {26}
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
                            name = {'md-trending-up'}
                            size = {26}
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
                            name = {'favorite'}
                            size = {26}
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
                            name = {'user'}
                            size = {26}
                            style={{color: tintColor}}
                        />
                    ),
                }
            }
        }));
    }


    render() {
         // 保存外部 navigation , 可以使用外部的跳转
        NavigationUtil.navigation = this.props.navigation;
        const Tab = HomePage._tabNavigator();
        return <Tab/>
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
