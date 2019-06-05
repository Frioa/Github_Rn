import React, {Component} from 'react';
import {TouchableOpacity,
        View,
        Text,
    Image,
    StyleSheet
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {PropTypes} from 'prop-types'

export default class BaseItem extends Component {
    static propTypes = {
        projectModel: PropTypes.object,
        onSelect: PropTypes.func,
        onFavorite: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
        }
    }
    /**
     * 牢记：https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md
     * componentWillReceiveProps在新版React中不能再用了
     * @param nextProps
     * @param prevState
     * @returns {*}
     */
    static getDerivedStateFromProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if (prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite, // 更新 state
            };
        }
        return null;
    }
    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite
        })
    }

    /**
     * 回调更新收藏按钮
     */
    onItemClick() {
        this.props.onSelect(isFavorite => {
           this.setFavoriteState(isFavorite)
        });
    }
    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite); // 更新State
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite) // 更改收藏状态
    }
    _favoriteIcon() {
        const {theme} = this.props;
        return <TouchableOpacity
            style={{padding: 6}}
            underlayColor = 'transparent'
            onPress={()=> this.onPressFavorite()}>
            <FontAwesome
                name = {this.state.isFavorite ? 'star': 'star-o'}
                size = {26}
                style = {{color: theme.themeColor}}
            />
        </TouchableOpacity>

    }
}



