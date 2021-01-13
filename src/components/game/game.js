import React, { useState, useEffect } from 'react';
import { Button, Card, FormControl } from 'react-bootstrap';
import Dialog from 'react-bootstrap-dialog'
import Board from './board';
import Config from '../../constants/configs';
import Status from './status';
import logo from '../../logo.svg';
import './css/game.css';
import socket from '../../socket.io/socket.io';
import ScrollToBottom from 'react-scroll-to-bottom';
import defaultAvatar from '../../images/boy.png'
import axios from 'axios';
import {useHistory, Redirect } from 'react-router-dom';

function Game(props) {

    const { actions } = props;
    const { history } = props;
    const { stepNumber } = props;
    const { nextMove } = props;
    const { winCells } = props;
    const { accendingMode } = props;
    const { userInfo } = props;
    const { roomInfo } = props;
    const { isFetching } = props;
    const { message } = props;
    const {isTimeOut} = props;
    // Temporary states
    const [avatarSrc, setAvatarSrc] = useState(localStorage.getItem('avatar_' + userInfo.username) || defaultAvatar);
    const [rivalAvatarSrc, setRivalAvatarSrc] = useState(defaultAvatar);
    const [dialog, setDialog] = useState('');
    const initialMinute = 1,initialSeconds = 30 ;
    const [ minutes, setMinutes ] = useState(initialMinute);
    const [seconds, setSeconds ] =  useState(initialSeconds);
    const [isOut, setIsOut] = useState(null);
    var myInterval;
    
    useEffect(()=>{
            // eslint-disable-next-line
            myInterval = setInterval(() => {
                
                if (seconds > 0) {
                    setSeconds(seconds - 1);
                }
                if (seconds === 1) {
                    if (minutes === 0) {
                        if(!winCells)
                        {
                            actions.actionTimeOut(true);
                            console.log(isTimeOut);
                        }
                        clearInterval(myInterval)
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } 
            }, 1000)
            return ()=> {
                clearInterval(myInterval);
              };
        });
    function ResetCountDownt(){
        setMinutes(1);
        setSeconds(30);
    }
    
    // Setup socket
    setupSocket();
    // Setup chat engine
    const { chatHistory } = props;
    const [chatMessage, setChatMessage] = useState('');
    const chatHistoryUI = [];
    for (var i = 0; i < chatHistory.length; i++) {
        const color = chatHistory[i].sender === 'Mình' ? 'blue' : 'red';
        const style = { color: color };
        chatHistoryUI.push(<b style={style} key={i}>{chatHistory[i].sender}</b>);
        chatHistoryUI.push(': ' + chatHistory[i].message);
        chatHistoryUI.push(<br key={i + chatHistory.length}></br>);
    }

    // Setup avatar
    if (roomInfo.justReconnect || chatHistory.length === 0) {
        if (roomInfo.justReconnect) {
            getUserAvatar();
            roomInfo.justReconnect = null;
            socket.emit('chat', '@@@AVATAR_SIGNAL@@@' + avatarSrc);
        }
        else {
            if (avatarSrc === defaultAvatar) {
                getUserAvatar();
            }
            else {
                socket.emit('chat', '@@@AVATAR_SIGNAL@@@' + avatarSrc);
            }
        }
    }

    // Setup disable state for components
    const oneIsDisconnect = roomInfo.playerO === 'DISCONNECTED' || roomInfo.playerX === 'DISCONNECTED';
    const needToDisable = winCells || oneIsDisconnect || isFetching || isTimeOut || isOut;
    var playWithAI = false;

    // Setup board game
    const current = history[stepNumber];
    const sortMode = accendingMode ? `Nước đi tăng dần` : `Nước đi giảm dần`;
    const moves = [];

    history.map((step, move) => {
        const content = move ? `Xin về lượt #${
            Config.makeTwoDigits(move)}:
            (${Config.makeTwoDigits(history[move].x)},${Config.makeTwoDigits(history[move].y)})`
        : `Chơi lại !`;
        const variant = (move === stepNumber) ? `danger` : `success`;
        
        // Get current move
        const isDisabled = oneIsDisconnect || (needToDisable && message && message.startsWith(".."));
        const currentMove = (
            // eslint-disable-next-line react/no-array-index-key
            <li key={move}>
                <Button onClick={() => requestUndo(move)} variant={variant} disabled={isDisabled}
                    className='board-button'>{content}</Button>
            </li>
        )
        
        
        // Push head or tail depends on sort mode
        if (winCells && move > 0) {
            // Invisible moves when match is finish
        }
        else if (needToDisable && message && !message.startsWith("...") && move > 0) {
            // Invisible moves when match is finish
        }
        else if((isTimeOut || isOut) && move >0){
            // Invisible moves when match is finish
        }
        
        
        else {
            if (accendingMode) {
                moves.push(currentMove);
            }
            else {
                moves.splice(0, 0, currentMove);
            }
        }
        return moves;
    })

    // Setup players info (too complicated, do not try to understand)
    const ourname = userInfo.fullname;
    var isPlayerX = ourname === roomInfo.playerX;
    if (ourname !== roomInfo.playerX) {
        isPlayerX = ourname !== roomInfo.playerO;
    }
    var rivalname, rivalWin, rivalDraw, rivalLose;
    rivalname = isPlayerX ? roomInfo.playerO : roomInfo.playerX;
    //check if play wit bot
    if(rivalname === 'Bot'){
        playWithAI = true;
    }
    //set the rival information
    else{
        if(rivalname === roomInfo.playerX){
            rivalWin = roomInfo.playerXWin;
            rivalDraw = roomInfo.playerXDraw;
            rivalLose = roomInfo.playerXLose;
        }
        else{
            rivalWin = roomInfo.playerOWin;
            rivalDraw = roomInfo.playerODraw;
            rivalLose = roomInfo.playerOLose;
        }
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Status
            nextMove={nextMove}
            winCells={winCells}
            rivalname={rivalname}
            messages={message}
            isPlayerX={isPlayerX}
            playWithAI={playWithAI}
            username={userInfo.username}
            actions={actions}
            isTimeOut = {isTimeOut}
            isOut = {isOut}
            //handleEnd = {deleteCountDown}
          />
          <Dialog ref={el => setDialog(el)} />
          <div className="board-game">
            <div>
              {/* Our infomation */}
              <Card className="card">
                <Card.Body className="card-body">
                  <Card.Title className="card-title">
                    [{isPlayerX ? `X` : `O`}] Mình [{isPlayerX ? `X` : `O`}]
                  </Card.Title>
                  <Card.Text className="card-text-bold">
                    <b>{ourname}</b>
                  </Card.Text>
                  <img src={avatarSrc} className="avatar-small" alt="avatar" />
                  <br></br>
                  <p className="card-text">
                    Thắng:{userInfo.WinCount} Hòa:{userInfo.DrawCount} Bại:
                    {userInfo.LoseCount}
                  </p>
                  <Button
                    className="logout-button"
                    variant="info"
                    onClick={() => goHome()}
                  >
                    Trang chủ
                  </Button>
                </Card.Body>
              </Card>
              {/* Time out */}
              <div hidden = {isTimeOut || winCells}>
                {minutes === 0 && seconds === 0 ? null : (
                  <h1 className = {`count-down ${(seconds < 10 && minutes === 0) ? `count-down-danger` : `count-down-safe` }`}>
                    {' '}
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </h1>
                )}
              </div>
              <br></br>
              {/* Rival infomation */}
              <Card className="card">
                <Card.Body className="card-body">
                  <Card.Title className="card-title">
                    [{!isPlayerX ? `X` : `O`}] Đối thủ [{!isPlayerX ? `X` : `O`}
                    ]
                  </Card.Title>
                  <Card.Text className="card-text-bold">
                    <b>{rivalname}</b>
                  </Card.Text>
                  <img
                    src={rivalAvatarSrc}
                    className="avatar-small"
                    alt="rivalAvatar"
                  />
                  <br></br>
                  <p hidden={playWithAI} className="card-text">
                    Thắng:{rivalWin} Hòa:{rivalDraw} Bại:{rivalLose}
                  </p>
                  <Button
                    hidden = {playWithAI}
                    className="logout-button"
                    variant="info"
                    onClick={() => requestSurrender()}
                    disabled={needToDisable }
                  >
                    Đầu hàng
                  </Button>
                  &nbsp;&nbsp;
                  <Button
                    hidden = {playWithAI}
                    className="logout-button"
                    variant="info"
                    onClick={() => requestCeasefire()}
                    disabled={needToDisable }
                  >
                    Xin hoà
                  </Button>
                </Card.Body>
              </Card>
            </div>
            
            <div>
              <Board
                winCells={winCells}
                squares={current.squares}
                currentCell={[current.x, current.y]}
                handleClick={(i, j) => userClick(i, j)}
              />
            </div>
            
            <div className={playWithAI ? 'right' : ''}>
              {/* Change sort mode */}
              <Button
                className="change-sort-button"
                onClick={actions.actionChangeSort}
              >
                {sortMode}
              </Button>
              <br></br>
              {/* move history */}
              <ScrollToBottom
                className="scroll-view"
                mode={accendingMode ? `bottom` : `top`}
              >
                <ol>{moves}</ol>
              </ScrollToBottom>
              {/* Chat panel */}
              {!playWithAI ? (
                <Card className="card-chat">
                  <Card.Body className="card-body">
                    <Card.Title className="card-title">Nhắn tin</Card.Title>
                    <div className="scroll-view-chat">{chatHistoryUI}</div>
                    <form onSubmit={e => handleChat(e)}>
                      <FormControl
                        type="chatMessage"
                        className="input-message"
                        placeholder="Nhập và nhấn Enter"
                        value={chatMessage}
                        disabled={isOut}
                        onChange={e => setChatMessage(e.target.value)}
                      ></FormControl>
                    </form>
                  </Card.Body>
                </Card>
              ) : null}
            </div>
          </div>
        </header>
      </div>
    );

    function goHome() {
        socket.emit('out-room', userInfo.username);
        if(!isTimeOut && !playWithAI && !winCells)
        {
            actions.fetchRecord(userInfo.username, 'lose');
        }
        actions.actionRefresh();
        return <Redirect to='/'/>;
    }

    function checkWin(row, col, user, stepNumber) {

        if (stepNumber === 0) {
            return null;
        }

        const { history } = props;
        const current = history[stepNumber];
        const squares = current.squares.slice();

        // Get coordinates
        let coorX = row;
        let coorY = col;
 
        let countCol = 1;
        let countRow = 1;
        let countMainDiagonal = 1;
        let countSkewDiagonal = 1;
        let isBlock;
        const rival = (user === Config.xPlayer) ? Config.oPlayer : Config.xPlayer;
 
        // Check col
        isBlock = true;
        let winCells = [];
        coorX -= 1;
        while(coorX >= 0 && squares[coorX][coorY] === user) {
            countCol += 1;
            winCells.push([coorX, coorY]);
            coorX -= 1;
        }
        if (coorX >= 0 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        coorX = row;
        winCells.push([coorX, coorY]);
        coorX += 1;
        while(coorX <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
            countCol += 1;
            winCells.push([coorX, coorY]);
            coorX += 1;
        }
        if (coorX <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        coorX = row;
        if (isBlock === false && countCol >= 5) 
        {
            return winCells;
        }
 
        // Check row
        isBlock = true;
        winCells = [];
        coorY -= 1;
        while(coorY >= 0 && squares[coorX][coorY] === user) {
            countRow += 1;
            winCells.push([coorX, coorY]);
            coorY -= 1;
        }
        if (coorY >= 0 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        coorY = col;
        winCells.push([coorX, coorY]);
        coorY += 1;
        while(coorY <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
            countRow += 1;
            winCells.push([coorX, coorY]);
            coorY += 1;
        }
        if (coorY <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        coorY = col;
        if (isBlock === false && countRow >= 5) 
        {
            return winCells;
        }

        // Check main diagonal
        isBlock = true;
        winCells = [];
        coorX -= 1;
        coorY -= 1;
        while(coorX >= 0 && coorY >= 0 && squares[coorX][coorY] === user) {
            countMainDiagonal += 1;
            winCells.push([coorX, coorY]);
            coorX -= 1;
            coorY -= 1;
        }
        if (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        coorX = row;
        coorY = col;
        winCells.push([coorX, coorY]);
        coorX += 1;
        coorY += 1;
        while(coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
            countMainDiagonal += 1;
            winCells.push([coorX, coorY]);
            coorX += 1;
            coorY += 1;
        }
        if (coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        coorX = row;
        coorY = col;
        if (isBlock === false && countMainDiagonal >= 5) 
        {
            return winCells;
        }

        // Check skew diagonal
        isBlock = true;
        winCells = [];
        coorX -= 1;
        coorY += 1;
        while(coorX >= 0 && coorY >= 0 && squares[coorX][coorY] === user) {
            countSkewDiagonal += 1;
            winCells.push([coorX, coorY]);
            coorX -= 1;
            coorY += 1;
        }
        if (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        coorX = row;
        coorY = col;
        winCells.push([coorX, coorY]);
        coorX += 1;
        coorY -= 1;
        while(coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
            countSkewDiagonal += 1;
            winCells.push([coorX, coorY]);
            coorX += 1;
            coorY -= 1;
        }
        if (coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
            isBlock = false;
        }
        if (isBlock === false && countSkewDiagonal >= 5) {
            return winCells;
        }
        return null;
    }

    function userClick(row, col) {
        const { nextMove } = props;

        // Prevent user click if rival is disconnected
        if (needToDisable) {
            return;
        }

        // Prevent user click if not his turn
        if ((isPlayerX && nextMove === Config.oPlayer) || (!isPlayerX && nextMove === Config.xPlayer)) {
            return;
        }
        
        // Send move to server if it is valid
        if (handleClick(row, col)) {
            socket.emit('move', { row: row, col: col });
        }
        ResetCountDownt();
    }

    function handleClick(row, col) {
        const { actions } = props
        const { stepNumber } = props;
        const { history } = props;
        const { nextMove } = props;
        const { winCells } = props;

        // It should be named 'curMove'
        const curMove = nextMove;
        const newHistory = history.slice(0, stepNumber + 1);
        const current = newHistory[newHistory.length - 1];

        // Attention: Slice does not work properly with 2D array
        const squares = JSON.parse(JSON.stringify(current.squares));

        if (winCells == null && squares[row][col] == null) {

            // Assign value
            squares[row][col] = curMove;
            const _nextMove = curMove === Config.xPlayer ? Config.oPlayer : Config.xPlayer;
            const _winCells = checkWin(row, col, curMove, newHistory.length - 1);
            const _history  = newHistory.concat([{
                x: row,
                y: col,
                squares
            }]);

            // Call action
            actions.actionClick(_history, _nextMove, _winCells);
            ResetCountDownt();
            return true;
        }
        return false;
    }

    function jumpTo(step) {
        const { actions } = props
        const { history } = props;

        const { nextMove } = props;
        const oppositeNextMove = nextMove === Config.xPlayer ? Config.oPlayer : Config.xPlayer;
        const { stepNumber } = props;
        const target = history[step];

        var futureCurrMove;
        var futureNextMove;

        // If current step and wanted step is the same type
        if ((stepNumber % 2 === 0 && step % 2 === 0) || (stepNumber % 2 !== 0 && step % 2 !== 0)) {
            futureCurrMove = oppositeNextMove;
            futureNextMove = nextMove;
        }
        else {
            futureCurrMove = nextMove;
            futureNextMove = oppositeNextMove;
        }
        
        const winCells = checkWin(target.x, target.y, futureCurrMove, step);

        // Call action
        actions.actionJumpTo(step, futureNextMove, winCells);
    }

    function handleChat(e) {
        e.preventDefault();
        socket.emit('chat', chatMessage);
        setChatMessage('');
    }

    function setupSocket() {
        socket.removeAllListeners();
        socket.on('move', function (data) {
            handleClick(data.row, data.col);
        });
        socket.on('disconnect', function (data) {

            // Check if data is 'transport close'
            if (data.id) {
                actions.actionJoinRoom(data);
            }
        });
        socket.on('out-room', function(data){
            if(!playWithAI && userInfo.username !== data && !isTimeOut && !winCells )
            {
                setIsOut(data);
                actions.actionTimeOut(true);
            }
        })
        socket.on('chat', function (data) {
            if (data.message.startsWith('@@@AVATAR_SIGNAL@@@')) {
                if (data.sender === 'ĐThủ') {
                    const fullUrl = data.message.substr('@@@AVATAR_SIGNAL@@@'.length);
                    setRivalAvatarSrc(fullUrl);
                }
                if (chatHistory.length === 0) {
                    data.message = '[Gửi ảnh đại diện]';
                    actions.actionChat(data);
                }
            }
            else {
                actions.actionChat(data);
            }
        });

        // Surrender 
        socket.on('surrender-request', function (data) {
            doConfirm('Đối thủ muốn đầu hàng ván này !', () => {
                socket.emit('surrender-result', {
                    message: 'yes',
                });
                actions.actionRequest(true, `Chúc mừng bạn đã giành chiến thắng !`);
                actions.actionTimeOut(true);;
                actions.fetchRecord(userInfo.username, 'win');

            }, () => {
                socket.emit('surrender-result', {
                    message: 'no'
                });
                actions.actionRequest(false, null);
            })
        });
        socket.on('surrender-result', function (data) {
            if (data.message === `yes`) {
                actions.actionRequest(true, `Bạn đã chấp nhận thua cuộc !`);
                actions.actionTimeOut(true);
                actions.fetchRecord(userInfo.username, 'lose');
                if (!data.noAlert) {
                    dialog.showAlert(`Đối thủ đã chấp nhận lời đầu hàng!`);
                }
            }
            else {
                actions.actionRequest(false, null);
                dialog.showAlert(`Đối thủ đã từ chối lời đầu hàng!`);
            }
        });
        // Ceasefire
        socket.on('ceasefire-request', function (data) {
            doConfirm('Đối thủ muốn xin hoà ván này !', () => {
                socket.emit('ceasefire-result', {
                    message: 'yes',
                });
                actions.actionRequest(true, `Đã thống nhất hoà nhau !`);
                actions.actionTimeOut(true);
                actions.fetchRecord(userInfo.username, 'draw');
            }, () => {
                socket.emit('ceasefire-result', {
                    message: 'no'
                });
                actions.actionRequest(false, null);
            });
        });
        socket.on('ceasefire-result', function (data) {
            if (data.message === 'yes') {
                actions.actionRequest(true, `Đã thống nhất hoà nhau !`);
                actions.actionTimeOut(true);
                actions.fetchRecord(userInfo.username, 'draw');
                if (!data.noAlert) {
                    dialog.showAlert(`Đối thủ đã chấp nhận hoà!`);
                }
            }
            else {
                actions.actionRequest(false, null);
                dialog.showAlert(`Đối thủ đã từ chối hoà!`);
            }
        });

        // Undo / Redo
        socket.on('undo-request', function (data) {
            doConfirm(`Đối thủ muốn quay về lượt #${data.stepNumber}: (${data.x},${data.y}) !`, () => {
                socket.emit('undo-result', {
                    message: 'yes',
                    stepNumber: data.stepNumber
                });
                jumpTo(data.stepNumber);
                ResetCountDownt();
            }, () => {
                socket.emit('undo-result', {
                    message: 'no'
                });
            });
        });
        socket.on('undo-result', function (data) {
            if (data.message === `yes`) {
                jumpTo(data.stepNumber);
                ResetCountDownt();
                if (!data.noAlert) {
                    dialog.showAlert(`Đối thủ đã đồng ý!`);
                }
            }
            else {
                dialog.showAlert(`Đối thủ không đồng ý!`);
            }
            actions.actionRequest(false, null);
        });

        // Play again
        socket.on('play-again-request', function (data) {
            doConfirm('Đối thủ muốn chơi lại !', () => {
                actions.actionResetGame(isPlayerX ? Config.xPlayer : Config.oPlayer);
                ResetCountDownt();
                actions.actionTimeOut(false);
                socket.emit('play-again-result', {
                    message: 'yes'
                });
            }, () => {
                socket.emit('undo-result', {
                    message: 'no'
                });
            });
        });
        socket.on('play-again-result', function (data) {
            if (data.message === 'yes') {
                actions.actionResetGame(isPlayerX ? Config.oPlayer : Config.xPlayer);
                actions.actionTimeOut(false);
                ResetCountDownt();
                if (!data.noAlert) {
                    dialog.showAlert(`Đối thủ đã đồng ý!`);
                }
            }
            else {
                dialog.showAlert(`Đối thủ không đồng ý!`);
            }
        });
        
        // Reconnect if browser refresh
        if (!socket.joinroom) {
            socket.joinroom = true;
            socket.emit('on-reconnect', { roomInfo, userInfo });
        }
        socket.on('on-reconnect', function (data) {

            // If found the room, join it
            if (data) {
                data.justReconnect = true;
                actions.actionJoinRoom(data);
                ResetCountDownt();
            }

            // Else reset
            else {
                actions.actionRefresh();
            }
        });
    }

    function doConfirm(message, callbackYes, callbackNo) {
        dialog.show({
            title: 'Xác nhận',
            body: message,
            actions: [
                Dialog.CancelAction(() => callbackNo()),
                Dialog.OKAction(() => callbackYes())
            ],
            bsSize: 'sm',
            onHide: (dialog) => {}
        })
    }

    function requestSurrender() {
        doConfirm('Bạn muốn đầu hàng ván này ?', () => {
            socket.emit('surrender-request', userInfo.username);
            actions.actionRequest(true, `... Đang chờ đối thủ trả lời ...`);
        }, () => {});
    }

    function requestCeasefire() {
        doConfirm('Bạn muốn xin hoà ván này ?', () => {
            socket.emit('ceasefire-request', userInfo.username);
            actions.actionRequest(true, `... Đang chờ đối thủ trả lời ...`);
        }, () => {});
    }

    function requestUndo(stepNumber) {

        if (stepNumber === 0) {
            doConfirm('Bạn muốn chơi lại ?', () => {
                socket.emit('play-again-request', '');
                actions.actionRequest(true, `..! Đang chờ đối thủ đồng ý !..`);
            }, () => {});
            return;
        }

        const { history } = props;
        const target = history[stepNumber];
        var request = {
            stepNumber,
            x: target.x,
            y: target.y
        };

        // For bot
        if (history[stepNumber + 1]) {
            request.nextX = history[stepNumber + 1].x;
            request.nextY = history[stepNumber + 1].y;
        }

        doConfirm('Bạn muốn quay về lượt này ?', () => {
            socket.emit('undo-request', request);
            actions.actionRequest(true, `... Đang chờ đối thủ trả lời ...`);
        }, () => {});
    }

    function getUserAvatar() {
        var imgUrl = 'https://firebasestorage.googleapis.com/v0/b/webnc-1612422.appspot.com/o/' + userInfo.username + '.png';
        axios.get(imgUrl).then(res => {
            if (res && res.data) {
                var fullUrl = imgUrl + '?alt=media&token=' + res.data.downloadTokens;
                socket.emit('chat', '@@@AVATAR_SIGNAL@@@' + fullUrl);
                setAvatarSrc(fullUrl);
            }
        }).catch(err => {});
    }
}

export default Game;