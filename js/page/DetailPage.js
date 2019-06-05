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

export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        const {projectModels, flag} = this.params;
        this.favoriteDao = new FavoriteDao(flag);
        this.url = projectModels.item.html_url || TRENDING_URL + projectModels.item.fullName;
        const title = projectModels.item.full_name || projectModels.item.fullName;
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false, // 返回上一级
            isFavorite: projectModels.isFavorite,
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
    onFavoriteButtonClick() {
        const {projectModels, callback} = this.params;
        const isFavorite = projectModels.isFavorite = !projectModels.isFavorite;
        callback(isFavorite);// 回调
        this.setState({
            isFavorite: isFavorite
        });
        let key = projectModels.item.fullName ? projectModels.item.fullName: projectModels.item.id.toString()
        if (projectModels.isFavorite) {// 收藏
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModels.item))
        } else { // 取消
            this.favoriteDao.removeFavoriteItem(key)
        }
    }
    renderRightButton() {
        return (<View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={()=>{this.onFavoriteButtonClick()}}
                >
                    <FontAwesome
                        name={this.state.isFavorite ? 'star': 'star-o'}
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
        const {theme} = this.params;
        const titleLayoutStyle = this.state.title.length > 20 ? {paddingRight: 30} : null;
        let navigationBar = <NavigationBar
           leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            title={this.state.title}
            titleLayoutStyle={titleLayoutStyle}
            style={theme.styles.navBar}
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
