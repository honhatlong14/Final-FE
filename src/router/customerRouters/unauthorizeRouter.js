import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import config from '../../config';

const UnAuthorizeRoute = ({jwtToken, children }) => {
    return jwtToken ? <Navigate to={config.routes.home} /> : <>{children}</>;
};

const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
    };
};

export default connect(mapStateToProps)(UnAuthorizeRoute);
