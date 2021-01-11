import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ResetPassword from '../components/resetPassword/resetPassword';
import fetchResetPassword from '../actions/actionResetPassword';

// Connect variables
function mapStateToProps(state) {
    return {
        isFetching: state.resetPasswordReducers.isFetching,
        message: state.resetPasswordReducers.message
    };
}

// Connect functions
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            fetchResetPassword
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);