import ActionType from '../constants/actionTypes';
import Config from '../constants/configs';

export default function handleActive(state = Config.initialState, action) {
    switch (action.type) {
        case ActionType.ACTIVE:
            if (action.status === 'REQUEST') {
                return {
                    ...state,
                    message: action.message
                }
            }
            else if (action.status === 'FAILED') {
                return {
                    ...state,
                    message: action.message
                }
            }
            else if (action.status === 'SUCCESS') {
                return {
                    ...state,
                    message: action.message
                }
            }
            else {
                return state;
            }
        
        default:
            return state;
    }
}