import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Game from './game';
import fetchInfo from '../actions/actionGetInfo';
import actionJoinRoom from '../actions/actionJoinRoom';
import actionRefresh from '../actions/actionRefresh';
import actionResetGame from '../actions/actionResetGame';
import Config from '../constants/configs';
import logo from '../logo.svg';
import socket from '../socket.io/socket.io';
import authSvg from '../assests/welcome.svg';
import { Link , useHistory} from 'react-router-dom';
import actionTimeOut from '../actions/actionTimeOut';


function Homepage(props) {
    
    const history = useHistory();
    // Prevent playing game
    const { actions } = props;
    const { didInvalidate } = props;
    const { isFetching } = props;
    const { userInfo } = props;
    const { roomInfo } = props;
    const [buttonLabel, setButtonLabel] = useState('Tìm đối thủ');
    var iswating = false;
    // If it is already invalidate
    if (didInvalidate) {
      //wellcome page
        return (
          <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl m-20 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
              <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                <img src={logo} className="App-logo-login" alt="logo" />
                <div className="mt-12 flex flex-col items-center">
                  <h1 className="text-2xl xl:text-3xl font-extrabold">
                    Đăng nhập để tiếp tục
                  </h1>
                  <div className="w-full flex-1 mt-3 text-indigo-500">
                    <div className="flex flex-col items-center">
                      <Link
                        className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-1"
                        to="/login"
                      >
                        <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                        <span className="ml-4">Đăng nhập</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                <div
                  className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${authSvg})` }}
                ></div>
              </div>
            </div>
            
          </div>
         
        );
    }
    // If it is not invalidate (REQUESTING or SUCCESS or 'FIRST TIME ENTER')
    else {
        // If success, create a room
        if (userInfo) {

            socket.removeAllListeners();
            socket.on('joinroom-success', function (roomInfo) {
                socket.joinroom = true;
                actions.actionJoinRoom(roomInfo);
            });
            socket.on('joinroom-success-ai', function (roomInfo) {
                socket.joinroom = true;
                actions.actionJoinRoom(roomInfo);
                actions.actionResetGame(Config.oPlayer);
            });

            // If found a rival, start game
            if (roomInfo) {
                return <Game />
            }
            // Choose to play with AI or other user
            else {
                return (
                  //Home page
                  <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
                    <div className="max-w-screen-xl m-20 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                      <div className="lg:w-1/2 xl:w-8/12 p-6 sm:p-12">
                        <div className="mt-12 flex flex-col items-center">
                          <div className="w-full flex-1 mt-8 text-indigo-500">
                            <div className="my-12 border-b text-center">
                              <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                                .. {userInfo.fullname.toUpperCase()} ...
                              </div>
                            </div>
                            <div className="mx-auto max-w-xs relative ">
                              <button
                                type="button"
                                variant="danger"
                                onClick={(e) => findRival(e, userInfo)}
                                className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                                onChange={() => {}}
                                value="Tìm đối thủ"
                              >
                                 <i className="fas fa-people-arrows " />
                                <span className="ml-3">{buttonLabel}</span>
                              </button>
                              <button
                                type="button"
                                variant="primary"
                                onClick={(e) => playWithAI(e, userInfo)}
                                className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                                onChange={() => {}}
                              >
                                 <i className="fas fa-desktop " />
                                <span className="ml-3">Chơi với AI</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => changeInfo()}
                                className={`mt-4 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                                onChange={() => {}}
                              >
                                 <i className="fas fa-user-edit  w-6  -ml-2" />
                                <span className="ml-3">Cập nhật thông tin</span>
                              </button>
                              <button
                                onClick={() => logOut()}
                                className="mt-4 tracking-wide font-semibold bg-pink-500 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                              >
                                <i className="fas fa-sign-out-alt  w-6  -ml-2" />
                                <span className="ml-3">Đăng xuất</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    ;
                  </div>
                );
            }
        }

        // If first time enter, this make sure not call a loop request
        else if (!isFetching) {
            const token = localStorage.getItem('token');
            actions.fetchInfo(token);
        }
         
        //Waiting page
        return (
            <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
            <div className="max-w-screen-xl  m-40 sm:m-40 bg-white shadow sm:rounded-lg flex justify-center flex-1">
              <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 mt-12">
                <img src={logo} className="App-logo-login" alt="logo" />
                <div className="mt-20 flex flex-col items-center">
                  <p className="text-2xl xl:text-3xl font-extrabold">
                  ... ĐANG KẾT NỐI ...
                  </p>
                  <div className="w-full flex-1 mt-3 text-indigo-500">
                   
                  </div>
                </div>
              </div>
              
            </div>
          </div>
            
        );
    }
    
    function logOut() {
        localStorage.setItem('token', null);
        history.push('/login');
        actions.actionRefresh();
    }

    function findRival(e, userInfo) {
        setButtonLabel('..Đang chờ đối thủ..');
        actions.actionTimeOut(false);
        e.target.disabled = true;
        socket.emit('joinroom', userInfo);
      }

    function playWithAI(e, userInfo) {
        e.target.disabled = true;
        actions.actionTimeOut(false);
        socket.emit('joinroom-ai', userInfo);
    }

    function changeInfo() {
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        history.push('/changeinfo') ;
    }
}

// Connect variables
function mapStateToProps(state) {
    return {
        isFetching: state.infoReducers.isFetching,
        didInvalidate: state.infoReducers.didInvalidate,
        userInfo: state.infoReducers.userInfo,
        message: state.infoReducers.message,
        isTimeOut: state.gameReducers.data.isTimeOut,
        roomInfo: state.roomReducers.roomInfo
    };
}

// Connect functions
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            fetchInfo,
            actionJoinRoom,
            actionRefresh,
            actionResetGame,
            actionTimeOut,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);