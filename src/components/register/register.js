import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import '../login/css/login.css';
import authSvg from '../../assests/auth.svg';
import {isAuth} from '../../helpers/auth';
import { ToastContainer, toast } from 'react-toastify';

function Register(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');

    const { actions } = props;
  
    function validateForm() {
        const { isFetching } = props;
        return !isFetching
            && username.length > 0
            && password.length > 0
            && repassword.length > 0
            && email.length > 0
            && fullname.length > 0;
    }
  
    function handleSubmit(event) {
        event.preventDefault();
        if (password !== repassword) {
            toast.error('Mật khẩu không trùng với nhau');
        }
        else {
          setEmail('');
          setFullname('');
          setPassword('');
          setRepassword('');
          setUsername('');
          actions.fetchRegister(username, password, email, fullname);
        }
    }

    return (
      <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
        {isAuth() ? <Redirect to='/' /> : null}
        <ToastContainer />
        <div className="max-w-screen-xl m-10 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="mt-8 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Đăng ký tài khoản</h1>

              <form
                className="w-full flex-1 mt-8 text-indigo-500"
                onSubmit={handleSubmit}
              >
                <div className="mx-auto max-w-xs relative ">
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    type="text"
                    placeholder="Tên đăng nhập"
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                  />
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    type="password"
                    placeholder="Mật khẩu"
                    onChange={e => setPassword(e.target.value)}
                    autoComplete = "on"
                    value={password}
                  />
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    onChange={e => setRepassword(e.target.value)}
                    autoComplete = "on"
                    value={repassword}
                  />
                  <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    type="email"
                    placeholder="Email cá nhân"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                  />
                   <input
                    className="w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-4"
                    type="text"
                    placeholder="Họ tên"
                    onChange={e => setFullname(e.target.value)}
                    value={fullname}
                  />
                  <button
                    disabled={!validateForm()}
                    type="submit"
                    className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${ validateForm() ? 'hover:bg-indigo-700 transition-all duration-300' : ''}`}
                  >
                    <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                    <span className="ml-3">Đăng ký</span>
                  </button>
                </div>
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Hoặc đăng nhập
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Link
                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-3"
                    to="/login"
                  >
                    <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                    <span className="ml-4">Đăng nhập</span>
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
}

export default Register;