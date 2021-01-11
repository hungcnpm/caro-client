import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ForgetPassword from '../components/resetPassword/forgetPassword';
import fetchForgetPassword from '../actions/actionForgetPassword';

// Connect variables
function mapStateToProps(state) {
    return {
        isFetching: state.forgetPasswordReducers.isFetching,
        message: state.forgetPasswordReducers.message
    };
}

// Connect functions
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            fetchForgetPassword
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword);