import Types from '../../action/types'

const defaultState = {};
/**
 * favorite:{
 *     popular:{
 *         projectModels:[],
 *         isLoading:false
 *     },
 *     trending:{
 *         projectModels:[],
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
        case Types.FAVORITE_LOAD_DATA:// 获取数据
            // 创建对应的state树
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],// ...state 解决刷新空白的问题
                    isLoading: true,
                }
            };
        case Types.FAVORITE_LOAD_SUCCESS:// 下拉获取数据成功
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,// 此次要展示的数据
                    isLoading: false,
                }
            };
        case Types.FAVORITE_LOAD_FAIL:// 下拉获得数据失败
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }
            };
        default:
            return state
    }
}