import fetch from 'cross-fetch';
import ActionType from '../constants/actionTypes';
import config from '../config';
import { getCookie } from '../helpers/auth'

export function actionRecordResult( status) {
    return {
        type: ActionType.RECORD_RESULT,
        status,
    };
}
export default function fetchRecord(username, result){
    return dispatch => {
        
        const token = getCookie('token');
        const bearerToken = 'Bearer ' + token;
        return fetch(config['server-domain'] + 'users/result', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': bearerToken
            },
            body: JSON.stringify({
                username: username,
                result: result,
            })
        })
        .then(
            response => response.json(),
            error => {
                console.log('An error occurred.', error);
                dispatch(actionRecordResult('FAILED'));
            }
        )
        .then(json => {
                dispatch(actionRecordResult('SUCCESS'));
        })
        .catch(err => {
            dispatch(actionRecordResult('FAILED'));
        })
    }
}