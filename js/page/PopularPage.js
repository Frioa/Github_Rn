import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation"
import NavigationUtil from "../navigator/NavigationUtil";

type Props = {};
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.tabNames = ['Java', 'Android', 'iOS', 'React', 'React Native', 'Kotlin', 'C++'];
    }

    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs['tab' + index] = {
                screen: props => <PopularTab {...props} tabLabel = {item}/>, // 点击Tab，传递属性（路由传递参数）
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs
    }

    render() {
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            this._genTabs(), {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否标签大写，默认 true
                    scrollEnabled: true, // 是否支持滚动， 默认false
                    style: {
                        backgroundColor: '#678' , // TabBar 的背景色
                    },
                    indicatorStyle: styles.indicatorStyle, // 指示器属性
                    labelStyle: styles.labelStyle, // 文字属性
                }
            }
        ));
        return <TabNavigator/>
    }
}

class PopularTab extends Component<Props> {
    render() {
        const {tabLabel} = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>{tabLabel}</Text>
                <Text onPress={() => {
                    NavigationUtil.goPage({
                        navigation: this.props.navigation
                    }, "DetailPage")
                }}>跳转到详情页</Text>
                <Button
                    title={"Fetch 使用"}
                    onPress={() => {
                    NavigationUtil.goPage({
                        navigation: this.props.navigation
                    }, "FetchDemoPage")
                }}/>
            </View>
        );
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
    tabStyle: {
        minWidth: 35
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white',
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6
    }
});
