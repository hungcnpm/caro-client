import React from 'react';
import Config from '../../constants/configs';
import { connect } from 'react-redux';
import fetchRecord from '../../actions/actionRecordResult'
import { bindActionCreators } from 'redux';

function Status(props) {
    const {actions} = props;
    const { winCells } = props;
    const { rivalname } = props;
    const { isPlayerX } = props;
    const { messages } = props;
    const {playWithAI} = props;
    const {username} = props;
    const {isTimeOut} = props;
    const {isOut} = props;
    //const {handleEnd} = props;
    let message;

    if (rivalname === 'DISCONNECTED') {
      
        message = 'Đối thủ đã thoát khỏi phòng chơi !';
    } else if (messages) {
      message = messages;
    } else if (isTimeOut && !winCells) {
      if (isOut) {
        if(username !== isOut && !playWithAI){
          actions.fetchRecord(username, 'win');
          console.log("Win is out");
        }
      } else {
        const winner =
          props.nextMove === Config.xPlayer ? Config.xPlayer : Config.oPlayer;

        if (
          (isPlayerX && winner === Config.oPlayer) ||
          (!isPlayerX && winner === Config.xPlayer)
        ) {
          if (!playWithAI) {
            actions.fetchRecord(username, 'win');
          }
          message = `Chúc mừng bạn đã giành chiến thắng !`;
        } else {
          if (!playWithAI) {
            actions.fetchRecord(username, 'lose');
          }
          message = `Rất tiếc bạn đã thua cuộc !`;
        }
      }
      
    } else if (winCells) {
      //handleEnd();
      const winner =
        props.nextMove === Config.xPlayer ? Config.oPlayer : Config.xPlayer;
      if (
        (isPlayerX && winner === Config.oPlayer) ||
        (!isPlayerX && winner === Config.xPlayer)
      ) {
        if (!playWithAI) {
          actions.fetchRecord(username, 'lose');
        }
        message = `Rất tiếc bạn đã thua cuộc !`;
      } else {
        if (!playWithAI) {
          actions.fetchRecord(username, 'win');
        }
        message = `Chúc mừng bạn đã giành chiến thắng !`;
      }
      
    } else {
      message = `Lượt đi kế tiếp: ${props.nextMove}`;
    }
    return (
      <div className="status">
        <b>{message}</b>
      </div>
    );
}
function mapStateToProps(state) {
    return {userInfo: state.infoReducers.userInfo}
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            fetchRecord,
        }, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Status);