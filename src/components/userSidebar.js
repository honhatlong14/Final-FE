import {Link, useNavigate, useLocation} from "react-router-dom";
import {connect, useDispatch} from "react-redux";
import React, {useEffect, useState} from "react";
import {logout, tokenRequestInterceptor, refreshToken as refreshTokenApi} from "../apiServices";
import authenticateReducer from "../store/reducers/authenticateReducer";
import routes from "../config/routes";
import {FaBeer} from "react-icons/fa";
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";

import {UserCircleIcon} from "@heroicons/react/24/outline";
import {RxAvatar} from "react-icons/rx";
import {RiMapPinLine} from "react-icons/ri";
import {CiDeliveryTruck} from "react-icons/ci";
import {TbTruckDelivery} from "react-icons/tb";

const UserSidebar = () => {
    const {jwtToken, refreshToken} = authenticateReducer;
    const [open, setOpen] = React.useState(0);
    const navigate = useNavigate();

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };


    return (
        <>
            <Card className="h-[calc(100vh-2rem)] bg-[#FAEED1] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
                <List>
                    {/*<hr className="my-2 border-blue-gray-50"/>*/}
                    <ListItem  onClick={() => {
                        navigate(`${routes.userProfile}`)
                    }}>
                        <ListItemPrefix>
                            <RxAvatar className="h-5 w-5"/>
                        </ListItemPrefix>
                        Account Information
                    </ListItem>
                    <ListItem onClick={() => {
                        navigate(`${routes.addressProfile}`)
                    }} >
                        <ListItemPrefix>
                            <RiMapPinLine className="h-5 w-5"/>
                        </ListItemPrefix>
                        Your Address
                    </ListItem>
                    <ListItem onClick={() => {
                        navigate(`${routes.order}`)
                    }} >
                        <ListItemPrefix>
                            <TbTruckDelivery className="h-5 w-5"/>
                        </ListItemPrefix>
                        Your Orders
                    </ListItem>
                </List>
            </Card>


        </>);
};

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        doLogout: () => dispatch(logout({})),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSidebar);