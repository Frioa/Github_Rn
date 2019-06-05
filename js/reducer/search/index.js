import Types from '../../action/types'

const defaultState = {
    showText: '搜索',
    items: [],
    isLoading: false,
    projectModels: [],
    hideLoadingMore: true,
    showBottomButton: false,
};

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.SEARCH_REFRESH:// 搜索数据
            return {
                ...state, // 复制一份
                isLoading: true,
                hideLoadingMore: true,
                showBottomButton: false,
            };
        case Types.SEARCH_REFRESH_SUCCESS:// 获取数据成功
            return {
                ...state, // 复制一份
                isLoading: false,
                hideLoadingMore: false,
                showBottomButton: action.showBottomButton,
                items: action.items,
                projectModels: action.projectModels,
                pageIndex: action.pageIndex,
                showText: '搜索',
                inputKey: action.inputKey
            };
        case Types.SEARCH_FAIL:// 下拉刷新失败
            return {
                ...state, // 复制一份
                isLoading: false,
                showText: '搜索',
            };
        case Types.SEARCH_CANCEL: // 取消搜索
            return {
                ...state,
                isLoading: false,
                showText: '搜索'
            };
        case Types.SEARCH_LOAD_MORE_SUCCESS:// 上拉加载更多成功
            return {
                ...state,
                projectModels: action.projectModels,
                hideLoadingMore: false,
                pageIndex: action.pageIndex,
            };
        case Types.SEARCH_LOAD_MORE_FAIL:// 上拉加载更多失败
            return {
                ...state,
                hideLoadingMore: true,
                pageIndex: action.pageIndex,
            };
        default:
            return state
    }
}