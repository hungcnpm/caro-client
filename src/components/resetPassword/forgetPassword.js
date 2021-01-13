import React, { useState } from 'react';
import authSvg from '../../assests/forget.svg';
import { Link } from 'react-router-dom';
import '../login/css/login.css';
import { ToastContainer } from 'react-toastify';


const ForgetPassword = (props) => {
  
  const [email, setEmail] = useState('');
  const { actions } = props;

 
  function validateForm() {
    const { isFetching } = props;
    return !isFetching
        && email.length > 0;
}
function handleSubmit(event) {
  event.preventDefault();
  if (email) {
    actions.fetchForgetPassword(email);
    setEmail('');
  }
};
  
  return (
    <div className='min-h-screen bg-gray-100 text-gray-900 flex justify-center'>
      <ToastContainer/>
      <div className='max-w-screen-xl m-20 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
        <div className='lg:w-1/2 xl:w-5/12 p-6 sm:p-12'>
          <div className='mt-12 flex flex-col items-center'>
            <h1 className='text-2xl xl:text-3xl font-extrabold'>
              Quên mật khẩu
            </h1>
            <div className='w-full flex-1 mt-8 text-indigo-500'>
              
              <form
                className='mx-auto max-w-xs relative '
                onSubmit={handleSubmit}
              >
                <input
                  className='w-full px-8 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white'
                  type='email'
                  placeholder='Email'
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                />
                <button
                  type='submit'
                  disabled={!validateForm()}
                  className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg h ${ validateForm() ? 'hover:bg-indigo-700 transition-all duration-300' : ''} ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                >
                  <i className='fas fa-user-edit  w-6  -ml-2' />
                  <span className='ml-3'>Reset lại mật khẩu</span>
                </button>
                <div className="my-12 border-b text-center">
                  <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                    Hoặc đăng nhập
                  </div>
                </div>
               
                <div className='flex flex-col items-center'>
                  <Link
                    className='w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-3'
                    to='/login'
                  >
                    <i className='fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500' />
                    <span className='ml-4'>Đăng nhập</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='flex-1 bg-indigo-100 text-center hidden lg:flex'>
          <div
            className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
      ;
    </div>
  );
};

export default ForgetPassword;
