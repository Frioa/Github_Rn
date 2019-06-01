import React, {Component} from 'react';
import {TouchableOpacity,
        View,
        Text,
    Image,
    StyleSheet
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import HTMLView from 'react-native-htmlview'
import BaseItem from "./BaseItem";
export default class TrendingItem extends BaseItem {
    render() {
        const {projectModel} = this.props;
        const {item} = projectModel;
        if (!item ) return null;

        // 定义 description
        let description = '<p>' + item.description + '</p>';
        return (
            <TouchableOpacity
                onPress={()=> this.onItemClick()}
            >
                    <View style={styles.cell_container}>
                        <Text style={styles.title}>
                            {item.fullName}
                        </Text>
                      {/*  <Text style={styles.description}>
                            {item.description}
                        </Text>*/}
                        {/*显示HTML标签内容*/}
                        <HTMLView
                            value={description}
                            onLinkLongPress={(url) => {}}
                            stylesheet ={{
                                p: styles.description,
                                a: styles.description,
                            }}
                        />
                        <Text style={styles.description}>
                            {item.meta}
                        </Text>
                        <View style={styles.row}>
                            <View style={styles.row}>
                                <Text>Built by: </Text>
                                {item.contributors.map((result, i, arr)=>{
                                        return <Image
                                            key = {i}
                                            style={{height: 22, width: 22, margin: 2}}
                                            source={{uri: arr[i]}}
                                        />
                                })}
                              {/*  <Image
                                        style={{height: 22, width: 22}}
                                       source={{uri: item.owner.archive_url}}
                                />*/}
                            </View>
                            {this._favoriteIcon()}
                        </View>
                    </View>
            </TouchableOpacity>
        )

    }
}

const styles = StyleSheet.create({
    cell_container:{
        backgroundColor: "#ffffff",
        padding: 10,
        marginLeft:5 ,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,   //Android 中的阴影
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title:{
        fontSize:16,
        marginBottom:2,
        color: '#212121',
    },
    description: {
        fontSize:12,
        marginBottom:2,
        color: '#757575',
    }
});
