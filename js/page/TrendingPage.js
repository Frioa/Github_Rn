import React, {Component} from 'react';
import {FlatList, DeviceEventEmitter,DeviceInfo, StyleSheet, ActivityIndicator, View, RefreshControl, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation"
import NavigationUtil from "../navigator/NavigationUtil";
import TrendingItem from '../common/TrendingItem'
import Toast from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'

const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const URL = 'https://github.com/trending/';
import TrendingDialog, {TimeSpans} from '../common/TrendingDialog'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import PopularItem from "../common/PopularItem";
import FavoriteDao from "../expand/dao/FavoriteDao";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";
const QUERY_STR = '&sort=stars';
const THEME_COLOR = '#678';
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);

type Props = {};
export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props);
        console.log(NavigationUtil.navigation);
        this.tabNames = ['All', 'C', 'C#', 'PHP', 'Kotlin', 'JavaScript'];
        this.state = {
            timeSpan: TimeSpans[0]
        }
    }

    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs['tab' + index] = {
                screen: props => <TrendingTabPage {...props}  timeSpan = {this.state.timeSpan} tabLabel={item}/>, // 点击Tab，传递属性（路由传递参数）
                navigationOptions: {
                    title: item
                }
            }
        });
        return tabs
    }
    renderTitleView() {
        return <View>
            <TouchableOpacity
                ref = 'button'
                underlayColor = 'transparent'
                onPress={()=>this.dialog.show()}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style = {{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <MaterialIcons
                        name = {'arrow-drop-down'}
                        size = {22}
                        style = {{color : 'white'}}
                    />
                </View>
            </TouchableOpacity>
        </View>
    }
    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab
        });
        // 发送一个事件DeviceEventEmitter，类型，参数
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
    }
    renderTrendingDialog() {
        return <TrendingDialog
            ref = {dialog=>this.dialog = dialog}
            onSelect = {tab => this.onSelectTimeSpan(tab)}
        />
    }
    _tabNav() {
        if (!this.tabNav)  { // 优化：如果TopNavigator创建好了不用创建了
            this.tabNav = createAppContainer(createMaterialTopTabNavigator(
                this._genTabs(), {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false, // 是否标签大写，默认 true
                        scrollEnabled: true, // 是否支持滚动， 默认false
                        style: {
                            backgroundColor: '#678', // TabBar 的背景色
                            height: 30, // fix 开启scrollEnabled 后再Android上初次加载闪烁问题
                        },
                        indicatorStyle: styles.indicatorStyle, // 指示器属性
                        labelStyle: styles.labelStyle, // 文字属性
                    }
                }
            ));
        }
        return this.tabNav;
    }
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light=content',
        };
        let navigationBar = <NavigationBar
            titleView={this.renderTitleView()}
            statusBar={statusBar}
            style={{backgroundColor: THEME_COLOR}}
        />;
        const TabNavigator = this._tabNav();
        return <View style={{flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0}}>
            {navigationBar}
            <TabNavigator/>
            {this.renderTrendingDialog()}
        </View>
    }
}

const pageSize = 10; // 设置常量防止修改
class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {tabLabel, timeSpan} = this.props;
        this.storeName = tabLabel;
        this.timeSpan = timeSpan;
        this.isFavoriteChanged = false
    }

    componentDidMount(): void {
        this.loadData(false);
        EventBus.getInstance().addListener(EventTypes.favoriteChanged_trending, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true;
        });
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = (data) => {
            if (data.to === 1 && this.isFavoriteChanged) { // 收藏状态发送变化，且第一个Tab
                this.loadData(null, true);
            }
        })
}
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.favoriteChangeListener);
        EventBus.getInstance().removeListener(this.bottomTabSelectListener);
    }

    loadData(loadMore, refreshFavorite) {
        const {onLoadTrendingData, onLoadMoreTrending, onFlushTrendingFavorite} = this.props;
        const store = this._store();

        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items,favoriteDao, callback => { // callback 回调说明失败
                this.refs.toast.show('没有更多了')
            })
        } if(refreshFavorite){
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
        }  else {
            onLoadTrendingData(this.storeName, url, pageSize,favoriteDao)
        }
        // onLoadPopularData(this.storeName, url);

    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store() {
        const {trending} = this.props;
        let store = trending[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false, //
                projectModels: [], // 要显示的数据
                hideLoadingMore: true,// 默认隐藏加载更多
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + '?' +this.timeSpan.searchText
    }

    renderItem(data) {
        const item = data.item;
        return <TrendingItem
            projectModel={item}
            onSelect={(callback) => {
                NavigationUtil.goPage({
                    projectModels: item,
                    flag: FLAG_STORAGE.flag_trending,
                    callback
                }, 'DetailPage')
            }}
            onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
        />
    }

    genIndicator() {
        return this._store().hideLoadingMore ? null :
            <View style={styles.indicatorContainer}>
                <ActivityIndicator
                    style={styles.indicator}
                />
                <Text>正在加载更多</Text>
            </View>
    }

    render() {
        const {popular} = this.props;
        let store = this._store();
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + (item.id || item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={'red'}
                            colors={['red']}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData(false)}
                            tintColor={'red'}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        console.log('---onEndReached---');
                        setTimeout(() => { // 优化：抱着这个方法在onEndReachedThreshold之后执行
                            if (this.canLoadMore) { // 优化：解决多次调用问题
                                this.loadData(true);
                                this.canLoadMore = false
                            }
                        }, 100);

                    }}
                    onEndReachedThreshold={0.5} // 一个比值
                    onMomentumScrollBegin={() => { // 滚动过程中可能这个方法执行慢，导致标志位没有为true，导致底部一直有圈
                        this.canLoadMore = true; // fix 初始化滚动页面调用onEndReached问题
                        console.log('---onMomentumScrollBegin---');
                    }}
                />
                <Toast ref={'toast'}
                       position={'center'}
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    trending: state.trending // props1. 订阅的state树要少，否则影响性能，因为多次调用render方法
});
// dispatch 创建函数
const mapDispatchToProps = dispatch => ({
    onLoadTrendingData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onLoadTrendingData(storeName, url, pageSize,favoriteDao)),
    onLoadMoreTrending: (storeName, url, pageSize, items, favoriteDao, callBack) => dispatch(actions.onLoadMoreTrending(storeName, url, pageSize, items, favoriteDao,callBack)),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
// 注意：connect只是一个function，并不一定要放在export后面
const TrendingTabPage = connect(mapStateToProps, mapDispatchToProps)(TrendingTab);

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