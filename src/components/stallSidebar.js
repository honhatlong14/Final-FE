import {Link, useNavigate, useLocation} from "react-router-dom";
import {connect, useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {logout, tokenRequestInterceptor, refreshToken as refreshTokenApi} from "../apiServices";
import authenticateReducer from "../store/reducers/authenticateReducer";
import routes from "../config/routes";
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
import {HomeIcon} from "./Icon";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import {ChevronUpIcon} from "@heroicons/react/20/solid";
import {LuBookCopy} from "react-icons/lu";
import {HiOutlineClipboardList} from "react-icons/hi";


const StallSidebar = () => {
    const {jwtToken, refreshToken} = authenticateReducer;
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };


    let jwtTokenState = jwtToken;
    let refreshTokenState = refreshToken;


    return (<>
        <Card className="h-[calc(100vh-2rem)] w-full  bg-[#faeed1] max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
            </div>
            <List>
                <Accordion
                    open={open === 1}
                    icon={
                        <ChevronUpIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open === 1}>
                        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                            <ListItemPrefix>
                                <LuBookCopy className="h-5 w-5"/>
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                Manager Books
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                            <ListItem>
                                {/*<ListItemPrefix>*/}
                                {/*  <HomeIcon strokeWidth={3} className="h-3 w-5" />*/}
                                {/*</ListItemPrefix>*/}
                                <Link to={routes.createBook}>
                                    Create a Book
                                </Link>
                            </ListItem>
                            <ListItem>
                                {/*<ListItemPrefix>*/}
                                {/*  <HomeIcon strokeWidth={3} className="h-3 w-5" />*/}
                                {/*</ListItemPrefix>*/}
                                <Link to={routes.viewBook}>
                                    View all Book
                                </Link>
                            </ListItem>
                        </List>
                    </AccordionBody>
                </Accordion>
                <Accordion
                    open={open === 2}
                    icon={
                        <ChevronUpIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open === 2}>
                        <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                            <ListItemPrefix>
                                <HiOutlineClipboardList className="h-5 w-5"/>
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                Order management
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                            <ListItem>
                                {/*<ListItemPrefix>*/}
                                {/*    <HomeIcon strokeWidth={3} className="h-3 w-5"/>*/}
                                {/*</ListItemPrefix>*/}
                                <Link to={routes.listOrders}>
                                    All Order
                                </Link>

                            </ListItem>
                            <ListItem>
                                {/*<ListItemPrefix>*/}
                                {/*    <HomeIcon strokeWidth={3} className="h-3 w-5"/>*/}
                                {/*</ListItemPrefix>*/}
                                Delivered
                            </ListItem>
                        </List>
                    </AccordionBody>
                </Accordion>




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

export default connect(mapStateToProps, mapDispatchToProps)(StallSidebar);