import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View, RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import {
    createMaterialTopTabNavigator,
    createAppContainer
} from "react-navigation"
import NavigationUtil from "../navigator/NavigationUtil";
import PopularItem from '../common/PopularItem'

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
                screen: props => <PopularTabPage {...props} tabLabel = {item}/>, // 点击Tab，传递属性（路由传递参数）
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
    constructor(props) {
        super(props);
        const {tabLabel} = this.props;
        this.storeName = tabLabel;
    }
    componentDidMount(): void {
        this.loadData();
    }
    loadData() {
        const {onLoadPopularData} = this.props;
        const url = this.genFetchUrl(this.storeName);

        onLoadPopularData(this.storeName, url);

    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }
    renderItem(data){
        const item = data.item;
        return <PopularItem
                item={item}
                onSelect={()=>{
                }}
        />
    }
    render() {
        const {popular} = this.props;
        let store = popular[this.storeName]; // 动态获取state
        if (!store) {
            store={
                items: [],
                isLoading: false,
            }
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={store.items}
                    renderItem={data=>this.renderItem(data)}
                    keyExtractor={item => ""+item.id}
                    refreshControl={
                        <RefreshControl
                            title = {'Loading'}
                            titleColor = {'red'}
                            colors = {['red']}
                            refreshing={store.isLoading}
                            onRefresh={()=>this.loadData()}
                            tintColor = {'red'}
                        />
                    }
                />
            </View>
        );
    }
}

const mapStateToProps = state => ({
    popular: state.popular
});
// dispatch 创建函数
const mapDispatchToProps = dispatch=> ({
    onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
});

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
    }
});
