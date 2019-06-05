import React, {Component} from 'react';
import {StyleSheet, TouchableHighlight, View, Alert, Text} from 'react-native';
import {connect} from 'react-redux';
import actions from '../action/index'
import NavigationUtil from "../navigator/NavigationUtil";
import NavigationBar from '../common/NavigationBar'
import LanguageDao, {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import ViewUtil from "../util/ViewUtil";
import Ionicons from "react-native-vector-icons/Ionicons";
import CheckBox from 'react-native-check-box'
import ArrayUtil from "../util/ArrayUtil";
import SortableListView from 'react-native-sortable-listview';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type Props = {};

class SortKeyPage extends Component<Props> {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)});
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            checkedArray: SortKeyPage._keys(this.props)
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, null, prevState);
        if (prevState.keys !== checkedArray) {
            return {
                keys: checkedArray,
            }
        }
        return null;
    }
    componentDidMount(): void {
        this.backPress.componentDidMount();
        // 如果props中标签为空则从本地中获取
        if (SortKeyPage._keys(this.props).length === 0) {
            let {onLoadLanguage} = this.props;
            onLoadLanguage(this.params.flag);
        }
    }

    componentWillUnmount(): void {
        this.backPress.componentWillUnmount();
    }

    /**
     * 获取标签
     * @param props
     * @param state
     * @returns {*}
     * @private
     */
    static _keys(props, state) {
        // 如果 state 中有checkedArray则使用state中的checkedArray
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray;
        }
        // 从原始数据中获得
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if (data.checked) keys.push(data);
        }
        return keys;
    }

    static _flag(props) {
        const {flag} = props.navigation.state.params;
        return flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
    }

    onBackPress(e) {
        this.onBack();
        return true;
    }

    onBack() {
        if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) { // 比较是否是同一个array
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否', onPress: () => {
                            NavigationUtil.goBack(this.props.naivgation)
                        }
                    },{
                        text: '是', onPress: () => {
                            this.onSave(true);
                    }
                }
                ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }

    onSave(hasChecked) {
        if (!hasChecked) { // 如果没有排序直接返回
            // 如果没有排序
            if(ArrayUtil.isEqual(SortKeyPage._keys(this.props,),  this.state.checkedArray)) {
                NavigationUtil.goBack(this.props.navigation);
                return;
            }
        }
        // 保存排序后的数据
        // 获取排序后的数据
        // 更新本地数据
        this.languageDao.save(this.getSortResult());
        const {onLoadLanguage} = this.props;
        //更新store, 其他模块render方法
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props.navigation);
    }

    /**
     * 获取排序后的标签结果
     * @return {Array}
     */
    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        // 从原始数据中复制一份，以便排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        // 获取排序之前的数据
        const originalCheckedArray = SortKeyPage._keys(this.props);
        // 遍历排序之前的数据，用排序后的数据checkedArray进行替换
        for (let i = 0 , j = originalCheckedArray.length; i < j ; i++) {
            let item = originalCheckedArray[i];
            // 找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            // 进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }

    render() {
        let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
        const {theme} = this.params;
        let navigationBar = <NavigationBar
            title={title}
            style={theme.styles.navBar}
            leftButton={ViewUtil.getLeftBackButton(()=>this.onBack())}
            rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
        />;

        return <View style={styles.container}>
            {navigationBar}
            <SortableListView
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                    this.forceUpdate()
                }}
                renderRow={row => <SortCell data={row} {...this.params} theme = {theme}/>}
            />
        </View>

    }
}
class SortCell extends Component {
    render() {
        const {theme} = this.props;
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}>
            <View style={{marginLeft: 10, flexDirection: 'row'}}>
                <MaterialCommunityIcons
                    name={'sort'}
                    size={16}
                    style={{marginRight: 10, color: theme.themeColor}}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
    }
}
const mapPopularStateToProps = state => ({
    language: state.language,
});
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
});
export default connect(mapPopularStateToProps, mapPopularDispatchToProps)(SortKeyPage)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    line: {
        flex: 1,
        height: 0.3,
        backgroundColor: 'darkgray',
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
});
