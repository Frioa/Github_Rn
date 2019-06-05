import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';

import NavigationUtil from "../navigator/NavigationUtil";
import actions from "../action";
import {connect} from "react-redux";
type Props = {};
class WelcomePage extends Component<Props> {
    componentDidMount(): void { // 定时器, 可能造成页面泄漏
        this.props.onThemeInit();
        this.timer = setTimeout(() => {
            NavigationUtil.resetToHomPage({
                navigation: this.props.navigation
            })
          /* const {navigation} = this.props;
            navigation.navigate("Main")*/
        }, 1000)
    }

    componentWillUnmount(): void {// 解决定时器造成的页面泄漏, 将 timer 销毁
        this.timer && clearTimeout(this.timer)
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>WelcomePage1</Text>
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    onThemeInit: () => dispatch(actions.onThemeInit()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);
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
