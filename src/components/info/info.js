import React, { useState } from 'react';
import { Link , useHistory} from 'react-router-dom';
import '../login/css/login.css';
import axios from 'axios';
import defaultAvatar from '../../images/boy.png'
import authSvg from '../../assests/update.svg';

function Info(props) {
  const history = useHistory();
    const { message } = props;
    const { actions } = props;

    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
    const [file, setFile] = useState('');
    const [buttonLabel, setButtonLabel] = useState('Đăng ảnh');
    const [imgSrc, setImgSrc] = useState(localStorage.getItem('avatar_' + (userInfo ? userInfo.username : '')) || defaultAvatar);
    
    localStorage.setItem('userInfo', null);
    if (!userInfo) {
        history.push('/login');
        return;
    }
    
    // If local storage has no avatar link
    if (imgSrc === defaultAvatar) {
        getAvatar();
    }
  
    function validateForm() {
        const { isFetching } = props;
        const flag_1 = !isFetching && userInfo.username.length > 0 && userInfo.email.length > 0 && userInfo.fullname.length > 0;
        const flag_2 = (oldPassword.length === 0 && password.length === 0 && repassword.length === 0);
        const flag_3 = (oldPassword.length > 0 && password.length > 0 && repassword.length > 0);
        return flag_1 && (flag_2 || flag_3);
    }
  
    function handleSubmit(event) {
        event.preventDefault();
        if (password !== repassword) {
            alert('Mật khẩu mới không trùng với nhau');
        }
        else {
            actions.fetchChangeInfo(userInfo.username, oldPassword, password, userInfo.email, userInfo.fullname);
        }
    }

    function uploadImage(e) {

        if (file === '') {
            alert('Xin vui lòng chọn ảnh trước');
            return;
        }

        e.target.disabled = true;
        e.target.value = '... Đang tải lên ...';

        // Start to upload image to firebase
        const fd = new FormData();
        fd.append('image', file, userInfo.username + '.png');
        axios.post('https://us-central1-webnc-1612422.cloudfunctions.net/uploadFile', fd, {
            onUploadProgress: progressEvent => {
                if (progressEvent.loaded < progressEvent.total) {
                    setButtonLabel('... ' + Math.floor(100 * progressEvent.loaded / progressEvent.total) + '% ...');
                }
                else {
                    setButtonLabel('... Đợi tí nhé ...');
                    setTimeout(setButtonLabel, 3000, 'Hoàn thành');
                }
            }
        })
        .then(res => {
            console.log(res);
            getAvatar();
        }).catch(err => {
            console.log(err);
            alert('Không thể đăng ảnh, vui lòng thử lại');
        });
    }
  
    return (

      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        <div className="max-w-screen-xl m-10 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">
                Cập nhật thông tin
              </h1>

              <form
                className="w-full flex-1 mt-8 text-indigo-500"
                onSubmit={handleSubmit}
              >
                <div className="mx-auto max-w-xs relative ">
                  <input
                    disabled
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="username"
                    readOnly
                    value={userInfo.username}
                  />
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    placeholder="Email"
                    value={userInfo.email}
                    readOnly
                    disabled
                  />
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    autoComplete="on"
                    placeholder="Mật khẩu cũ (bỏ trống nếu không đổi)"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    type="password"
                  />
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    autoComplete="on"
                    type="password"
                    placeholder="Mật khẩu mới (bỏ trống nếu không đổi)"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    readOnly={oldPassword.length === 0}
                  />

                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    autoComplete="on"
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    onChange={e => setRepassword(e.target.value)}
                    value={repassword}
                    readOnly={oldPassword.length === 0}
                  />
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    autoComplete="on"
                    placeholder="Họ tên (bắt buộc)"
                    onChange={e =>
                      setUserInfo({
                        ...userInfo,
                        fullname: e.target.value
                      })
                    }
                    value={userInfo.fullname}
                  />
                  <img
                    src={imgSrc}
                    className="avatar-big mt-4 ml-20"
                    alt="logo"
                  ></img>
                  <input
                    type="file"
                    className="input-file text-gray-600 tracking-wide font-medium"
                    onChange={e => setFile(e.target.files[0])}
                  ></input>
                  <button
                    type="button"
                    as="input"
                    variant="warning"
                    onClick={e => uploadImage(e)}
                    
                    onChange={() => setButtonLabel()}
                    className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                  >
                    <i className="fas fa-upload fa 1x w-6  -ml-2" />
                    <span className="ml-3">{buttonLabel}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={!validateForm()}
                    className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg ${
                      validateForm()
                        ? `hover:bg-indigo-700 transition-all duration-300`
                        : ''
                    } ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                  >
                    <i className="fas fa-user-edit fa 1x w-6  -ml-2" />
                    <span className="ml-3">Cập nhật</span>
                  </button>
                </div>
                <div className="my-12 border-b text-center">
                  <p className="status-login-small">{message}</p>
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Hoặc về trang chủ
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Link
                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-4"
                    to="/"
                  >
                    <i className="fas fa-home fa 1x w-6  -ml-2 text-indigo-500" />
                    <span className="ml-4">Trang chủ</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${authSvg})` }}
            ></div>
          </div>
        </div>
        ;
      </div>
    );

    function getAvatar() {
        var imgUrl = 'https://firebasestorage.googleapis.com/v0/b/webnc-1612422.appspot.com/o/' + userInfo.username + '.png';
        axios.get(imgUrl).then(res => {
            if (res && res.data) {
                var fullUrl = imgUrl + '?alt=media&token=' + res.data.downloadTokens;
                setImgSrc(fullUrl);
                localStorage.setItem('avatar_' + userInfo.username, fullUrl);
            }
            else {
                console.log(res);
            }
        }).catch(err => {
            console.log(err);
        });
    }
}

export default Info;