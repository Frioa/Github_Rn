import React, {Component} from 'react';
import {WebView, StyleSheet, TouchableOpacity, View, DeviceInfo} from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from "../util/ViewUtil";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";

const TRENDING_URL = 'https://github.com/';
type Props = {};
const THEME_COLOR = '#678';
export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {projectModels} = this.params;

        this.url = projectModels.html_url || TRENDING_URL + projectModels.fullName;
        const title = projectModels.full_name || projectModels.fullName;
        this.state = {
            title: title,
            url: this.url,
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
    renderRightButton() {
        return (<View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={()=>{

                    }}
                >
                    <FontAwesome
                        name={'star-o'}
                        size={20}
                        style={{color: 'white', marginRight: 10}}
                    />
                </TouchableOpacity>

                {ViewUtil.getShareButton(() => {

                })}
            </View>
            )
    }
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }
    render() {
        // 防止标题过长
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
        let navigationBar = <NavigationBar
           leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            title={this.state.title}
            titleLayoutStyle={titleLayoutStyle}
            style={{backgroundColor: THEME_COLOR}}
            rightButton={this.renderRightButton()}
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
