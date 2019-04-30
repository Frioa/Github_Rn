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
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";

export default class HomePage extends Component<Props> {

    render() {
         // 保存外部 navigation , 可以使用外部的跳转
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator/>
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
