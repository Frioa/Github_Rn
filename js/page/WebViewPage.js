import React, {Component} from 'react';
import {WebView, StyleSheet, TouchableOpacity, View, DeviceInfo} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";

const TRENDING_URL = 'https://github.com/';
type Props = {};
const THEME_COLOR = '#678';

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
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()})
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
        let navigationBar = <NavigationBar
            title={this.state.title}
            style={{backgroundColor: THEME_COLOR}}
            leftButton={ViewUtil.getLeftBackButton(()=> this.onBackPress())}
        />;
        return (
            <View style={styles.container}>
               {navigationBar}
                <WebView
                    ref = {webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e=>this.onNavigationStateChange(e)}
                    source = {{uri: this.state.url}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPoneX_deprecated ? 30: 0
    },
});
