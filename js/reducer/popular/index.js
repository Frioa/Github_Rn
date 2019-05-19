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
        case Types.LOAD_POPULAR_SUCCESS:
            // 创建对应的state树
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],// ...state 解决刷新空白的问题
                    items: action.items,
                    isLoading: false,
                }
            };
        case Types.POPULAR_REFRESH:
            return {
                ...state, // 复制一份
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                }
            };
        case Types.LOAD_POPULAR_FAIL:
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