import {roles} from "../../constants/role";
import {Navigate, useLocation} from "react-router-dom";
import DashBoardLayout from "../../layout/DashBoardLayout";
import ApplicationBaseLayout from "../../layout/ApplicationBaseLayout";
import config from "../../config";
import {connect} from "react-redux";

const AdminRouters = ({ jwtToken, role, children, allowRoles = roles.ALL }) => {
    const location = useLocation();
    return jwtToken ? (
        allowRoles?.includes(role) ? (
                (role === roles.Admin || role === roles.Staff || role === roles.Supervisor) && (
                <DashBoardLayout>{children}</DashBoardLayout>
            )
        ) : (
            <Navigate to='/error' state={{ from: location }} />
        )
    ) : (
        <Navigate to={config.routes.login} state={{ from: location }} />
    );
};

const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
        role: state.authenticateReducer.role,
    };
};

export default connect(mapStateToProps)(AdminRouters);
