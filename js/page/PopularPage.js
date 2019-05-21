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

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

type Props = {};
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props);
        console.log(NavigationUtil.navigation);
        this.tabNames = ['Java', 'Android', 'iOS', 'React', 'React Native', 'Kotlin', 'C++'];
    }

    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item, index) => {
            tabs['tab' + index] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}/>, // 点击Tab，传递属性（路由传递参数）
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
                        backgroundColor: '#678', // TabBar 的背景色
                    },
                    indicatorStyle: styles.indicatorStyle, // 指示器属性
                    labelStyle: styles.labelStyle, // 文字属性
                }
            }
        ));
        return <TabNavigator/>
    }
}

const pageSize = 10; // 设置常量防止修改
class PopularTab extends Component<Props> {
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
    }

    componentDidMount(): void {
        this.loadData(false);
    }

    loadData(loadMore) {
        const {onLoadPopularData, onLoadMorePopular} = this.props;
        const store = this._store();

        const url = this.genFetchUrl(this.storeName);
        if (loadMore) {

            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => { // callback 回调说明失败
                this.refs.toast.show('没有更多了')
            })
        } else {
            onLoadPopularData(this.storeName, url, pageSize)
        }
        // onLoadPopularData(this.storeName, url);

    }

    /**
     * 获取与当前页面有关的数据
     * @private
     */
    _store() {
        const {popular} = this.props;
        let store = popular[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false, //
                projectModes: [], // 要显示的数据
                hideLoadingMore: true,// 默认隐藏加载更多
            }
        }
        return store
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }

    renderItem(data) {
        const item = data.item;
        return <PopularItem
            item={item}
            onSelect={() => {
            }}
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
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.id}
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
                        setTimeout(()=>{ // 优化：抱着这个方法在onEndReachedThreshold之后执行
                            if (this.canLoadMore) { // 优化：解决多次调用问题
                                this.loadData(true);
                                this.canLoadMore = false
                            }
                        },100);

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
    popular: state.popular // props1. 订阅的state树要少，否则影响性能，因为多次调用render方法
});
// dispatch 创建函数
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName, url, pageSize) => dispatch(actions.onLoadPopularData(storeName, url, pageSize,)),
    onLoadMorePopular: (storeName, url, pageSize, items, callBack) => dispatch(actions.onLoadMorePopular(storeName, url, pageSize, items, callBack)),

});
// 注意：connect只是一个function，并不一定要放在export后面
const PopularTabPage = connect(mapStateToProps, mapDispatchToProps)(PopularTab);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        minWidth: 50 //fix minWidth会导致tabStyle初次加载时闪烁
        //padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 6,
        marginBottom: 6,
    },
    indicatorContainer: {
        alignItems: "center"
    },
    indicator: {
        color: 'red',
        margin: 10
    },

});
