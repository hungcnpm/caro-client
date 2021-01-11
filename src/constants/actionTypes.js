import { Component } from 'react';

class ActionType extends Component {
    
    static CLICK = 'CLICK';

    static CHANG_SORT = 'CHANGE_SORT';

    static JUMP_TO = 'JUMP_TO';

    static LOGIN = 'LOGIN';

    static REGISTER = 'REGISTER';

    static ACTIVE = 'ACTIVE';
    
    static FORGET_PASSWORD = 'FORGET_PASSWORD';

    static RESET_PASSWORD = 'RESET_PASSWORD';

    static GET_INFO = 'GET_INFO';

    static JOIN_ROOM = 'JOIN_ROOM';

    static CHAT = 'CHAT';

    static REQUEST = 'REQUEST';

    static TIME_OUT = 'TIME_OUT';

    static RECORD_RESULT = 'RECORD_RESULT';

    static RESET_GAME = 'RESET_GAME';

    static REFRESH = 'REFRESH';

    static CHANGE_INFO = 'CHANGE_INFO';
}

export default ActionType;