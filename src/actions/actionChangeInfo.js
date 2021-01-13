import fetch from 'cross-fetch';
import ActionType from '../constants/actionTypes';
import config from '../config';
import { getCookie } from '../helpers/auth'
import {toast} from 'react-toastify'

export function actionChangeInfo(status, message) {
    return {
        type: ActionType.CHANGE_INFO,
        status,
        message, 
        
    };
}

export default function fetchChangeInfo(username, oldPassword, password, email, fullname) {

    return dispatch => {

        const token = getCookie('token');
        const bearerToken = 'Bearer ' + token;

        dispatch(actionChangeInfo('REQUEST', 'Xin vui lòng đợi...'));

        return fetch(config['server-domain'] + 'users/changeinfo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': bearerToken
            },
            body: JSON.stringify({
                username: username,
                oldPassword: oldPassword,
                password: password,
                fullname: fullname,
                email: email
            })
        })
        .then(
            response => response.json(),
            error => {
                console.log('An error occurred.', error);
                dispatch(actionChangeInfo('FAILED', 'Đã có lỗi xảy ra, vui lòng thử lại'));
                toast.error('Đã có lỗi xảy ra, vui lòng thử lại');
            }
        )
        .then(json => {
            console.log(JSON.stringify(json))
            dispatch(actionChangeInfo('SUCCESS', json.message));
            if(json.success === true){
                toast.success(json.message);
            }
            else{
                toast.error(json.message);
            }
        })
        .catch(err => {
            dispatch(actionChangeInfo('FAILED', err));
            toast.error('Đã có lỗi xảy ra, vui lòng thử lại');
        })
    }
  }