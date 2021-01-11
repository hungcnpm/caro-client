import fetch from 'cross-fetch';
import ActionType from '../constants/actionTypes';
import config from '../config';

export function actionForgetPassword(status, message) {
    return {
        type: ActionType.FORGET_PASSWORD,
        status,
        message
    };
}

export default function fetchForgetPassword(email) {

    return dispatch => {
  
        dispatch(actionForgetPassword('REQUEST', 'Xin vui lòng đợi...'));

        return fetch(config['server-domain'] + 'users/password/forget', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email:email
            })
        })
        .then(
            response => response.json(),
            error => {
                console.log('An error occurred.', error);
                dispatch(actionForgetPassword('FAILED', 'Đã có lỗi xảy ra, vui lòng thử lại'));
            }
        )
        .then(json => {
                // Redirect immediately, no need to dispatch SUCCESS action
                dispatch(actionForgetPassword('SUCCESS', json.message));
        })
        .catch(err => {
            console.log('An error occurred 1.', err);
            dispatch(actionForgetPassword('FAILED', 'Đã có lỗi xảy ra, vui lòng thử lại'));
        })
    }
  }