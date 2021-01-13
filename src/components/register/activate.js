import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authSvg from '../../assests/welcome.svg';
import { ToastContainer } from 'react-toastify';
var jwt = require('jsonwebtoken');

const Activate = props => {
  const [fullname, setFullname] = useState('');
  const [token, setToken] = useState('');
  const { actions } = props;
  useEffect(() => {
    let tokenParam = props.match.params.token;
    let {  fullname } = jwt.decode(tokenParam);

    if (tokenParam) {
      setFullname(fullname);
      setToken(tokenParam);
    }
  }, [props.match.params]);
  
  
  const handleSubmit = e => {
    e.preventDefault();
    actions.fetchActive(token);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <ToastContainer/>
      <div className="max-w-screen-xl m-20 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Xin chào {fullname}
            </h1>

            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative ">
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span className="ml-3">Kích hoạt tài khoản</span>
                </button>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Đăng nhập và đăng ký
                </div>
              </div>
              <div className="flex flex-col items-center">
                <Link
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-4"
                  to="/login"
                >
                  <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                  <span className="ml-4">Đăng nhập</span>
                </Link>
                <Link
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-4"
                  to="/register"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2 text-indigo-500" />
                  <span className="ml-4">Đăng ký</span>
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
};

export default Activate;
