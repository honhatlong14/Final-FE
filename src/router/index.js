import {BrowserRouter, Route, Routes} from 'react-router-dom';

import ErrorPage from '../screens/error';
import PrivateRoute from './customerRouters/privateRouter';
import UnAuthorizeRoute from './customerRouters/unauthorizeRouter';
import {adminRoutes, privateRoutes, unAuthorizeRoutes} from './routes';
import {connect} from "react-redux";
import AdminRouters from "./customerRouters/adminRouters";


const AppRouter = ({authenticateReducer}) => {
    const {role} = authenticateReducer;

    return (
        <BrowserRouter>
            <Routes>
                {unAuthorizeRoutes.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <UnAuthorizeRoute>
                                    <Page/>
                                </UnAuthorizeRoute>
                            }
                        />
                    );
                })}

                {privateRoutes.map((route, index) => {
                    const Page = route.component;
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                <PrivateRoute role={role}>
                                    <Page/>
                                </PrivateRoute>

                            }
                        />
                    );
                })}

                {/*{adminRoutes.map((route, index) => {*/}
                {/*    const Page = route.component;*/}
                {/*    return (*/}
                {/*        <Route*/}
                {/*            key={index}*/}
                {/*            path={route.path}*/}
                {/*            element={*/}
                {/*                <AdminRouters role={role}>*/}
                {/*                    <Page/>*/}
                {/*                </AdminRouters>*/}
                {/*            }*/}
                {/*        />*/}
                {/*    );*/}
                {/*})}*/}


                <Route path='*' element={<ErrorPage/>}/>
            </Routes>
        </BrowserRouter>
    );
};

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps)(AppRouter);
