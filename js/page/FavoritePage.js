import React, {Component} from 'react';
import {FlatList, StyleSheet, ActivityIndicator, View, RefreshControl, Text} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation"
import NavigationUtil from "../navigator/NavigationUtil";
import PopularItem from '../common/PopularItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import {DeviceInfo} from 'react-native'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import TrendingItem from "../common/TrendingItem";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";

type Props = {};

class FavoritePage extends Component<Props> {
    constructor(props) {
        super(props);
        console.log(NavigationUtil.navigation);
    }
    render() {
        const {theme} = this.props;
        let statusBar={
            backgroundColor: theme.themeColor,
            barStyle: 'light-content',
        };
        let navigationBar = <NavigationBar
            title={'收藏'}
            statusBar={statusBar}
            style={theme.styles.navBar}
        />;
        const TabNavigator = createAppContainer(createMaterialTopTabNavigator(
            {
                'popular' : {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} theme = {theme}/>,
                    navigationOptions: {
                        title: '最热'
                    },
                },
                'trending': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} theme = {theme}/>,
                    navigationOptions: {
                        title: '趋势'
                    },
                }
            },
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false, // 是否标签大写，默认 true
                    style: {
                        backgroundColor: theme.themeColor, // TabBar 的背景色
                        height: 30, // fix 开启scrollEnabled 后再Android上初次加载闪烁问题
                    },
                    indicatorStyle: styles.indicatorStyle, // 指示器属性
                    labelStyle: styles.labelStyle, // 文字属性
                }
            }
        ));
        return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated? 30  : 0}}>
            {navigationBar}
            <TabNavigator/>
        </View>

    }
}
const mapFavoriteStateToProps = state => ({
    theme: state.theme.theme,
});
//注意：connect只是个function，并不应定非要放在export后面
export default connect(mapFavoriteStateToProps)(FavoritePage);

class FavoriteTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {flag} = this.props;
        this.storeName = flag;
        this.favoriteDao = new FavoriteDao(flag)
    }

    componentDidMount(): void {
        this.loadData(false);
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
            if (data.to === 2) { // 切换到index=2
                this.loadData(false);
            }
        })
    }
    componentWillUnmount() { // 移除监听
        EventBus.getInstance().removeListener(this.listener);
    }

    loadData(isShowLoading) {
        const {onLoadFavoriteData} = this.props;
        onLoadFavoriteData(this.storeName, isShowLoading)
    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store() {
        const {favorite} = this.props;
        let store = favorite[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false, //
                projectModels: [], // 要显示的数据
            }
        }
        return store
    }

    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
        if (this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
        } else {
            EventBus.getInstance().fireEvent(EventTypes.favoriteChanged_trending);
        }
    }

    renderItem(data) {
        const item = data.item;
        const {theme} = this.props;
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
        return <Item
            projectModel={item}
            theme={theme}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    theme,
                    projectModels: item,
                    flag : this.storeName,
                    callback
                },'DetailPage')
            }}
            onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
        />
    }

    render() {
        const {theme} = this.props;
        let store = this._store();
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + (item.item.id || item.item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(true)}
                            tintColor={theme.themeColor}
                        />
                    }
                />
                <Toast ref={'toast'}
                       position={'center'}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    favorite: state.favorite // props1. 订阅的state树要少，否则影响性能，因为多次调用render方法
});
// dispatch 创建函数
const mapDispatchToProps = dispatch => ({
    // 将 dispatch（onRefreshPopular（storeName，url) 绑定到props
    onLoadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onLoadFavoriteData(storeName, isShowLoading)),

});
// 注意：connect只是一个function，并不一定要放在export后面
const FavoriteTabPage = connect(mapStateToProps, mapDispatchToProps)(FavoriteTab);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        //  minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        /*    marginTop: 6,
            marginBottom: 6,*/
        margin: 0,
    },
    indicatorContainer: {
        alignItems: "center"
    },
    indicator: {
        color: 'red',
        margin: 10
    },

});
