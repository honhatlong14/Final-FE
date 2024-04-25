import { useNavigate, useLocation} from "react-router-dom";

import {connect, useDispatch} from "react-redux";
import {getNewTokenSuccess, logoutSuccess, logout} from "../store/actions/authenticateAction";
import {useState} from "react";

import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {TbCategory} from "react-icons/tb";
import {CiShop} from "react-icons/ci";
import routes from "../config/routes";
import {FaUsers} from "react-icons/fa";



const SideBar = ({authenticateReducer, doLogout}) => {
    const {jwtToken, refreshToken} = authenticateReducer;
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [open, setOpen] = useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };


    let jwtTokenState = jwtToken;
    let refreshTokenState = refreshToken;

    const handleLogout = async (e) => {
        e.preventDefault();
        doLogout(refreshToken, jwtTokenState);

        // const doLogout = async () => {
        //     const {data, status} = await logout({refreshTokenState, jwtTokenState});
        //     return {data, status};
        // };
        // const getRefreshToken = async () => {
        //     const {data, status} = await refreshTokenApi(jwtToken);
        //     if (status === 200) {
        //         jwtTokenState = data.jwtToken;
        //         refreshTokenState = data.refreshToken;
        //         dispatch(getNewTokenSuccess(data));
        //     } else {
        //         dispatch(logoutSuccess());
        //     }
        // };
        //
        // const {status} = await tokenRequestInterceptor(doLogout, getRefreshToken);
        //
        // if (status === 200) {
        //     dispatch(logoutSuccess());
        //     navigate(config.routes.login);
        // }
    };






    return (<>
        <aside
            className=" w-full h-fit"
            aria-label="Sidebar"
            style={{minHeight: "calc(100vh - 4rem)"}}
        >
            <Card className="h-[calc(100vh-2rem)] w-full bg-[#FAEED1] p-4 shadow-xl shadow-blue-gray-900/5">
                <div className="mb-2 p-4 hover:cursor-pointer" onClick={() => navigate(`${routes.admin}`)}>
                    <Typography variant="h5" color="blue-gray ">
                        Dashboard
                    </Typography>
                </div>
                <List>
                    <List>
                        <Accordion
                            open={open === 1}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={open === 1}>
                                <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                                    <ListItemPrefix>
                                        <TbCategory className="h-5 w-5" />
                                    </ListItemPrefix>
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                        Management Categories
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0">
                                    <ListItem onClick={() => navigate(`${routes.adminCategory}`)} >
                                        <ListItemPrefix>
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        List Categories
                                    </ListItem>
                                </List>
                            </AccordionBody>
                        </Accordion>
                        <Accordion
                            open={open === 2}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={open === 2}>
                                <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                                    <ListItemPrefix>
                                        <CiShop className="h-5 w-5" />
                                    </ListItemPrefix>
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                        Management Stall
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0">
                                    <ListItem onClick={() => navigate(`${routes.adminStall}`)}>
                                        <ListItemPrefix >
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        All Stall
                                    </ListItem>
                                </List>
                            </AccordionBody>
                        </Accordion>


                        <Accordion
                            open={open === 3}
                            icon={
                                <ChevronDownIcon
                                    strokeWidth={2.5}
                                    className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`}
                                />
                            }
                        >
                            <ListItem className="p-0" selected={open === 3}>
                                <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
                                    <ListItemPrefix>
                                        <FaUsers className="h-5 w-5" />
                                    </ListItemPrefix>
                                    <Typography color="blue-gray" className="mr-auto font-normal">
                                        Management User
                                    </Typography>
                                </AccordionHeader>
                            </ListItem>
                            <AccordionBody className="py-1">
                                <List className="p-0">
                                    <ListItem onClick={() => navigate(`${routes.createUser}`)}>
                                        <ListItemPrefix >
                                            <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                        </ListItemPrefix>
                                        Create User
                                    </ListItem>
                                </List>
                            </AccordionBody>
                        </Accordion>


                    </List>



                    <ListItem onClick={handleLogout}>
                        <ListItemPrefix>
                            <PowerIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Log Out
                    </ListItem>
                </List>
            </Card>
        </aside>
    </>);
};

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // doLogout: () => dispatch(logout({})),
        doLogout: (refreshToken, token) => dispatch(logout({refreshToken, token})),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);

