import ActionType from '../constants/actionTypes';


export default function actionTimeOut(isTimeOut) {
    return {
        type: ActionType.TIME_OUT,
        isTimeOut
    };
}