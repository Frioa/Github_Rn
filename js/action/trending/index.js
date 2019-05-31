import Types from '../types'
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore'
import {handleData} from '../ActionUtil'
/**
 * 获取最热数据的异步action
 * @param storeName：最热列表的哪一个action（JAVA, Android，IOS...）
 * @param url
 * @param pageSize 每一页显示多少Item
 * @returns {{theme: *, type: string}}
 */
export function onLoadTrendingData(storeName, url, pageSize) {
    // 异步action
    return dispatch => {

        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let dataStore = new DataStore();// 通过离线缓存框架获取数据流
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending) // 异步action与数据流
            .then(data => {
                handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error,
                })
            })
    }
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页1
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向页面通信：比如异常信息展示，没有更多等待
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], callBack) {
    return dispatch => {
        setTimeout(() => { // 模拟网络请求
            if ((pageIndex - 1) * pageSize >= dataArray.length) { // 已加载完全部数据
                if (typeof callBack == 'function') {
                    callBack('no more')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex, // pageIndex 是请求第几页的数据，没有数据- 1
                    projectModes: dataArray,
                })
            } else {
                // 本次载入最大数量
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;// 计算请求后的页面数量
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max) // 返回一个子数组 [0,max]
                })
            }
        }, 100)
    }
}

