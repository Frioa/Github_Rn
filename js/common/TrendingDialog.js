import React, {Component} from 'react'
import {Modal, Text, TouchableOpacity, StyleSheet, View, Platform, DeviceInfo} from 'react-native'
import {PropTypes} from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TimeSpans from '../model/TimeSpans'

export const TimeSpans = [new TimeSpans('今 天', 'since=daily')
    , new TimeSpans('本 周', 'since=weekly')
    , new TimeSpans('本 月', 'since=monthly')];
export default class TrendingDialog extends Component {
    state = {
        visible: false,
    };

    show() {
        this.setState({
            visible: true,
        })
    }

    dimiss() {
        this.setState({
            visible: false
        })
    }

    render() {
        const {onClose, onSelect} = this.props;
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => onClose}
            >
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => this.dismiss()}
                >
                    {/*设置向上箭头图标*/}
                    <MaterialIcons
                        name={'arrow-drop-up'}
                        size={36}
                        style={styles.arrow}
                    />
                    <View style={styles.content}>
                        {TimeSpans.map((result, i, arr) => {
                            return <TouchableOpacity
                                onPress={() => onSelect(arr[i])}
                                underlayColor='transparent'>
                                <View style={style.text_container}>
                                    <Text
                                        style={styles.text}
                                    >{arr[i].showText}</Text>
                                    {
                                        i !== TimeSpans.length - 1 ? <View
                                            style={styles.line}
                                        /> : null
                                    }
                                </View>
                            </TouchableOpacity>
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)', // 透明度
        flex: 1,
        alignItems: 'center',
    },
    arrow: {
        marginTop: 40,
        color: 'white',
        padding: 0,
        margin: -15
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 3,
    },
    text_container: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: '400',
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26,
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray'
    }
});