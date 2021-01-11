import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Activate from '../components/register/activate';
import fetchActive from '../actions/actionActivate';

// Connect variables
function mapStateToProps(state) {
    return {
        message: state.activeReducers.message
    };
}

// Connect functions
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            fetchActive
        }, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Activate);