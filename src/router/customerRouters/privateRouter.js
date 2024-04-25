import DashBoardLayout from '../../layout/DashBoardLayout';
import { Navigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { roles } from '../../constants/role';
import ApplicationBaseLayout from '../../layout/ApplicationBaseLayout';
import config from '../../config';


const PrivateRoute = ({jwtToken, role, children, allowRoles = roles.ALL}) => {
    const location = useLocation();
    return jwtToken ? (
        allowRoles?.includes(role) ? (
            role === roles.Admin || role === roles.Staff || role === roles.Supervisor ? (
                <DashBoardLayout>{children}</DashBoardLayout>
            ) : (
                <ApplicationBaseLayout>{children}</ApplicationBaseLayout>
            )
        ) : (
            <Navigate to='/error' state={{ from: location }} />
        )
    ) : (
        <Navigate to={config.routes.login} state={{ from: location }} />
    );
};

// State từ redux ?
const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
        role: state.authenticateReducer.role,
    };
};

export default connect(mapStateToProps)(PrivateRoute);
