import HeadlessTippy from '@tippyjs/react/headless';
import {createElement, useCallback, useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';
import 'tippy.js/dist/tippy.css';

import {
    refreshToken as refreshTokenApi,
    tokenRequestInterceptor,
    getSingleUser, getBookBySort, refreshToken
} from '../apiServices';
import config from '../config';
import {getNewTokenSuccess, logoutSuccess, logout, getNewToken} from '../store/actions/authenticateAction';
import {NotifyIcon} from './Icon';
import Image from '../components/Image';
import {toast} from "react-toastify";
import {MdLogout} from "react-icons/md";

import {
    Navbar,
    MobileNav,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
    Card,
    IconButton, Input,
} from "@material-tailwind/react";
import {
    CubeTransparentIcon,
    ChevronDownIcon,
    PowerIcon,
} from "@heroicons/react/24/outline";
import routes from "../config/routes";
import {RxAvatar} from "react-icons/rx";
import {CgProfile} from "react-icons/cg";
import {AiFillShop, AiOutlineShoppingCart} from "react-icons/ai";
import {useData} from "./DataProvider";


const Header = ({doGetNewToken, doLogout, authenticateReducer}) => {
    const {refreshToken, jwtToken, id} = authenticateReducer;
    const [user, setUser] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();




    let jwtTokenState = jwtToken;
    let refreshTokenState = refreshToken;

    // const { sharedState, setSharedState } = useData();

    useEffect(() => {
        (async () => {
            const getSingleUserData = async () => {
                const {data, status} = await getSingleUser(jwtTokenState, id);
                return {data, status};
            };

            const getRefreshToken = async () => {
                const {data, status} = await refreshTokenApi(refreshTokenState);
                if (status === 200) {
                    jwtTokenState = data.jwtToken;
                    refreshTokenState = data.refreshToken;
                    dispatch(getNewTokenSuccess(data));
                } else {
                    dispatch(logoutSuccess());
                }
            };

            const {status, data} = await tokenRequestInterceptor(getSingleUserData, getRefreshToken);
            console.log(data);
            if (status === 200) {
                setUser(data);
            } else if (status == 401) {
                toast.error(data.message);
            } else {
                toast.error(JSON.stringify(data.errors));
            }
        })();
    }, [id, jwtToken]);



    const handleLogout = async (e) => {
        e.preventDefault();
        doLogout(refreshToken, jwtTokenState);
    };





    const ProfileMenu = () => {

        const [isMenuOpen, setIsMenuOpen] = useState(false);

        const closeMenu = () => setIsMenuOpen(false);


        return (
            <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
                <MenuHandler>
                    <Button
                        variant="text"
                        color="blue-gray"
                        className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                    >
                        <Avatar
                            variant="circular"
                            size="sm"
                            alt="tania andrew"
                            className="border border-gray-900 p-0.5"
                            src={user.avatar}
                        />
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`h-3 w-3 transition-transform ${
                                isMenuOpen ? "rotate-180" : ""
                            }`}
                        />
                    </Button>
                </MenuHandler>
                <MenuList className="p-1">
                    return (
                    <Link to={config.routes.userProfile}>
                        <MenuItem
                            onClick={closeMenu}
                            className={`flex items-center gap-2 rounded`}

                        >
                            {createElement(CgProfile, {
                                className: `h-4 w-4 }`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal"
                                color={"inherit"}
                            >
                                My Profile
                            </Typography>
                        </MenuItem>
                    </Link>
                    <Link to={config.routes.stallProfile}>
                        <MenuItem
                            onClick={closeMenu}
                            className={`flex items-center gap-2 rounded`}

                        >
                            {createElement(AiFillShop, {
                                className: `h-4 w-4 }`,
                                strokeWidth: 2,
                            })}
                            <Typography
                                as="span"
                                variant="small"
                                className="font-normal"
                                color={"inherit"}
                            >
                                My Stall
                            </Typography>
                        </MenuItem>
                    </Link>

                    <MenuItem
                        onClick={closeMenu}
                        className={`flex items-center gap-2 rounded
                                            "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"`}
                    >
                        {createElement(PowerIcon, {
                            className: `h-4 w-4 text-red-500`,
                            strokeWidth: 2,
                        })}
                        <Typography
                            as="span"
                            variant="small"
                            className="font-normal"
                            color={"red"}
                            onClick={handleLogout}
                        >
                            LogOut
                        </Typography>
                    </MenuItem>
                    );
                </MenuList>
            </Menu>
        );
    }

    const ComplexNavbar = () => {
        const [isNavOpen, setIsNavOpen] = useState(false);
        const [searchParam] = useState(['title', 'author']);
        const [searchQuery, setSearchQuery] = useState('');

        const { pendingRequest, setPendingRequest } = useData();

        const handleSearch = () => {
            if (searchQuery.trim() === '') {
                loadingRequest();
            } else {
                const filteredItems = search(pendingRequest, searchQuery);
                setPendingRequest(filteredItems);
            }
        };

        function search(items, query) {
            return items.filter((item) => {
                return searchParam.some((newItem) => {
                    return (
                        item[newItem]
                            .toString()
                            .toLowerCase()
                            .indexOf(query.toLowerCase()) > -1
                    );
                });
            });
        }



        const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

        useEffect(() => {
            window.addEventListener(
                "resize",
                () => window.innerWidth >= 960 && setIsNavOpen(false),
            );
        }, []);

        const loadingRequest = useCallback(async () => {
            const loadPendingRequests = async () => {
                const {data, status} = await getBookBySort(jwtTokenState.current, "newest");
                if (status === 200) {
                    return {data, status};
                } else {
                    console.log("Error")
                }
            };

            const getRefreshToken = async () => {
                const {data, status} = await refreshToken(jwtTokenState);
                if (status === 200) {
                    jwtTokenState.current = data.jwtToken;
                    dispatch(getNewTokenSuccess(data));
                } else {
                    dispatch(logoutSuccess());
                }
            };

            const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
            if (status === 200) {
                setPendingRequest(data);
            }
        }, [jwtToken])


        useEffect(() => {
            loadingRequest();

        }, [])


        return (
            // <Navbar className="mx-auto max-w-screen-xl p-2 lg:pl-6">
                <Navbar className="mx-auto w-[1440px] p-2 lg:pl-6">

                <div className="relative mx-auto flex items-center text-blue-gray-900">
                    <Typography
                        as="a"
                        href="#"
                        className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
                    >
                        <Link to={routes.home}>ReadRealm Store</Link>
                    </Typography>
                    {/*<div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">*/}
                    {/*    <NavList/>*/}
                    {/*</div>*/}
                    <IconButton
                        size="sm"
                        color="blue-gray"
                        variant="text"
                        onClick={toggleIsNavOpen}
                        className="ml-auto mr-2 lg:hidden"
                    >
                        <CubeTransparentIcon className="h-6 w-6"/>
                    </IconButton>

                    <div className="relative mx-auto flex flex-1 max-w-[820px]">
                        <Input
                            type="text"
                            label="Search somethings ... "
                            className="pr-20 w-full"
                            containerProps={{
                                className: "min-w-0",
                            }}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Button
                            size="sm"
                            className="!absolute right-1 top-1 rounded bg-[#BBAB8C]"
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </div>

                   <div className='ml-auto flex items-center'>
                       <div className='mr-4 w-9 h-9 hover:bg-[#e2edff] hover:cursor-pointer rounded-xl'>
                           <AiOutlineShoppingCart onClick={() => {
                               navigate(`${routes.cart}`)
                           }} className='mx-auto h-full my-auto text-2xl'/>
                       </div>
                       <ProfileMenu />
                   </div>

                </div>
                {/*<MobileNav open={isNavOpen} className="overflow-scroll">*/}
                {/*    <NavList/>*/}
                {/*</MobileNav>*/}
            </Navbar>
        );
    }


    return (
        <>
            <nav
                // className='flex items-center justify-center z-10 bg-white w-full fixed top-0 left-0 h-[70px]'>
                className='flex items-center justify-center z-10 bg-white w-full top-0 left-0 h-[70px] mb-[1.5rem]'>
                <div className='flex justify-center w-full'>
                    {jwtToken ? <ComplexNavbar/> : (
                        <Link
                            className='h-[34px] flex items-center justify-center px-4 hover:underline underline-offset-1 hover:bg-gray-200 shadow-[0_4px_4px_rgba(0,0,0,0.25)] rounded-md bg-gray-50 text-primary font-normal'
                            to={config.routes.login}
                        >
                            Đăng nhập
                        </Link>
                    )}


                </div>
            </nav>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        doLogout: (refreshToken, token) => dispatch(logout({refreshToken, token})),
        doGetNewToken: (token) => dispatch(getNewToken(token))
    }
}
const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
