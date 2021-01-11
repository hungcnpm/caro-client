import { combineReducers } from 'redux';
import gameReducers from './gameReducers';
import loginReducers from './loginReducers';
import registerReducers from './registerReducers';
import infoReducers from './infoReducers';
import activeReducers from './activeReducers'
import roomReducers from './roomReducers';
import forgetPasswordReducers from './forgetPasswordReducers';
import resetPasswordReducers from './resetPasswordReducers'

const rootReducers = combineReducers({
    gameReducers,
    loginReducers,
    registerReducers,
    activeReducers,
    infoReducers,
    forgetPasswordReducers,
    resetPasswordReducers,
    roomReducers
});

export default rootReducers;