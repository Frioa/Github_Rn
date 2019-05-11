import Types from '../../action/types'

const defaultState = {
    theme: 'blue'
};
export default function onAction(state=defaultState, action) {
    switch (action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.theme
            };
    /*    case Types.THEME_INIT:
            return state;*/
        default:
            return state
    }
}