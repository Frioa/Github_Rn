import React, {Component} from 'react';
import {WebView, StyleSheet, TouchableOpacity, View, DeviceInfo} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";

type Props = {};

export default class WebViewPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {title, url} = this.params;
        this.state = {
            title: title,
            url: url,
            canGoBack: false, // 返回上一级
        };
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
    }

    componentDidMount(): void {
        this.backPress.componentDidMount()
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount()
    }

    onBackPress() {
        this.onBack();
        return true
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack() // WebView 返回上一层
        } else {
            NavigationUtil.goBack(this.props.navigation) // 程序上一层
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }

    render() {
        const {theme} = this.params;
        let navigationBar = <NavigationBar
            title={this.state.title}
            style={theme.styles.navBar}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBackPress())}
        />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true} // 加载进度条
                    onNavigationStateChange={e => this.onNavigationStateChange(e)} // 导航状态发生变化监听
                    source={{uri: this.state.url}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPoneX_deprecated ? 30 : 0
    },
});
