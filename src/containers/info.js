import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Info from '../components/info/info';
import fetchChangeInfo from '../actions/actionChangeInfo';
import fetchInfo from '../actions/actionGetInfo'

// Connect variables
function mapStateToProps(state) {
    return {
        isFetching: state.infoReducers.isFetching,
        message: state.infoReducers.message, 
        userInfo: state.infoReducers.userInfo
    };
}

// Connect functions
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            fetchChangeInfo,
            fetchInfo
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Info);