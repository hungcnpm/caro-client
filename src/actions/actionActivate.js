import ActionType from '../constants/actionTypes';
import config from '../config';

export function actionActive(status, message) {
  return {
    type: ActionType.ACTIVE,
    status,
    message
  };
}
export default function fetchActive(token) {
  return dispatch => {
    dispatch(actionActive('REQUEST', 'Xin vui lòng đợi...'));

    return fetch(config['server-domain'] + 'users/activate', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    })
      .then(
        response => response.json(),
        error => {
          console.log('An error occurred.', error);
          dispatch(
            actionActive('FAILED', 'Đã có lỗi xảy ra, vui lòng thử lại')
          );
        }
      )
      .then(json => {
        dispatch(actionActive('SUCCESS', json.message));
      })
      .catch(err => {
        dispatch(actionActive('FAILED', 'Đã xảy ra lỗi, xin vui lòng thử lại'));
      });
  };
}
