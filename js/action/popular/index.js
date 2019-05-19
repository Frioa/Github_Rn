import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

/**
 * 获取最热数据的异步action
 * @param storeName：最热列表的哪一个action（JAVA, Android，IOS...）
 * @param url
 * @returns {{theme: *, type: string}}
 */
export function onLoadPopularData(storeName, url) {
    // 异步action
    return dispatch => {

        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();// 通过离线缓存框架获取数据流

        dataStore.fetchData(url) // 异步action与数据流
            .then(data=>{
                handleData(dispatch, storeName, data)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: Types.LOAD_POPULAR_FAIL,
                    storeName,
                    error,
                })
            })
    }
}

function handleData(dispatch, storeName, data) {
    dispatch({
        type: Types.LOAD_POPULAR_SUCCESS,
        items: data && data.data && data.data.items,
        storeName: storeName,
    })
}