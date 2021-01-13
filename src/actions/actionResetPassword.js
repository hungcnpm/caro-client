import ActionType from '../constants/actionTypes';
import config from '../config';
import {toast} from 'react-toastify'

export function actionResetPassword(status, message) {
  return {
    type: ActionType.RESET_PASSWORD,
    status,
    message
  };
}
export default function fetchResetPassword(token, password) {
  return dispatch => {
    dispatch(actionResetPassword('REQUEST', 'Xin vui lòng đợi...'));

    return fetch(config['server-domain'] + 'users/password/reset', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        newPassword: password
      })
    })
      .then(
        response => response.json(),
        error => {
          console.log('An error occurred.', error);
          dispatch(
            actionResetPassword('FAILED', 'Đã có lỗi xảy ra, vui lòng thử lại')
          );
          toast.error('Đã có lỗi xảy ra, vui lòng thử lại');
        }
      )
      .then(json => {
        dispatch(actionResetPassword('SUCCESS', json.message));
        if (json.success === true) {
          toast.success(json.message);
        } else {
          toast.error(json.message);
        }
      })
      .catch(err => {
        dispatch(
          actionResetPassword('FAILED', 'Đã xảy ra lỗi, xin vui lòng thử lại')
        );
        toast.error('Đã có lỗi xảy ra, vui lòng thử lại');
      });
  };
}
