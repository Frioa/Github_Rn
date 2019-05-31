import Types from '../../action/types'

const defaultState = {};
/**
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 * state 数，横向扩展
 * 1. 如何动态的设置store，和动态获取store（难点：storekey 不固定）；
 * @param state
 * @param action
 * @returns {{}&{theme: (*|theme|{tintColor, updateTime}|string|{comment: string, content: string, prop: string, tag: string, value: string}|onAction)}}
 */
export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.TRENDING_REFRESH_SUCCESS:// 下拉刷新成功
            // 创建对应的state树
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],// ...state 解决刷新空白的问题
                    items: action.items, // 原始数据
                    projectModes: action.projectModes,// 此次要展示的数据
                    isLoading: false,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex
                }
            };
        case Types.TRENDING_REFRESH:// 下拉刷新
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadingMore: true, // 隐藏
                }
            };
        case Types.TRENDING_REFRESH_FAIL:// 下拉刷新失败
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }
            };
        case Types.TRENDING_LOAD_MORE_SUCCESS:// 上拉加载更多成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModes: action.projectModes,
                    hideLoadingMore: false,
                    pageIndex: action.pageIndex,
                }
            };
        case Types.TRENDING_LOAD_MORE_FAIL:// 上拉加载更多失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    hideLoadingMore: true,
                    pageIndex: action.pageIndex,
                }
            };
        default:
            return state
    }
}