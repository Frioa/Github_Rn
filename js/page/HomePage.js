import React, {Component} from 'react';
import {Platform, StyleSheet, BackHandler, View} from 'react-native';
type Props = {};
import NavigationUtil from "../navigator/NavigationUtil";
import DynamicTabNavigator from "../navigator/DynamicTabNavigator";
import {NavigationActions} from "react-navigation"
import {connect} from "react-redux";

class HomePage extends Component<Props> {
    componentDidMount(): void {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
    }
    componentWillUnmount(): void {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
    }
    /**
     *  处理Android中物理返回
     * @returns {*}
     */
    onBackPress = () => {
        const {dispatch, nav} = this.props;
        if (nav.routes[1].index === 0) {// 如果RootNavigator中MainNavigator的路由index为1，则不处理返回事件
                                // ====0 路由导航器没有页面
            return false;
        }
        dispatch(NavigationActions.back()); // 返回上一层
        return true;
    };
    render() {
         // 保存外部 navigation , 可以使用外部的跳转
        // NavigationUtil.navigation = this.props.navigation;
        NavigationUtil.navigation = this.props.navigation;
        return <DynamicTabNavigator/>
    }
}

const mapStateToProps = state =>({
    nav:state.nav,
    theme:state.theme
});

export default connect(mapStateToProps)(HomePage);
