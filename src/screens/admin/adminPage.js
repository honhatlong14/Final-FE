import {
    activateUserAccount,
    deleteUser, deleteUserAccount,
    getAllUsers, getProfitBookQuality, getProfitCountingUser, getProfitTotalIncome, getProfitUserByRole,
    getSingleUser, getTopUser, getTopUserStall, getTotalOrders, reactiveUser, refreshToken as refreshTokenApi,
    refreshToken,
    tokenRequestInterceptor, updateShippingStatus
} from "../../apiServices";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {getNewToken, getNewTokenSuccess, logout, logoutSuccess} from "../../store/actions/authenticateAction";
import {toast} from "react-toastify";
import {Link, useNavigate, useParams} from "react-router-dom";
import moment from "moment/moment";
import {Avatar, Button, Card, Chip, Typography} from "@material-tailwind/react";
import ReactPaginate from "react-paginate";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {FaDollarSign} from "react-icons/fa";
import {GrGroup} from "react-icons/gr";
import {BsCashCoin} from "react-icons/bs";
import {MdLocalShipping, MdOutlineGeneratingTokens} from "react-icons/md";
import Swal from 'sweetalert2'
import VerticalBarChart from "../../components/VerticalBarChart";

ChartJS.register(ArcElement, Tooltip, Legend);



const ProfitDataUserRoleChart = ({users}) => {
    const data = {
        labels: ['User', 'Admin'],
        datasets: [
            {
                label: 'Account By Role',
                data: users.map(item => item.userCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };





    return <Doughnut className='max-w-[300px] max-h-[300px] mb-10' data={data} />

}




function PaginatedItems({ itemsPerPage, items, handleActivate, handleDelete ,getAllUserDataRequest}) {

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    return (
        <div className=''>
            <RenderUsersPage currentItems={currentItems} getAllUserDataRequest={getAllUserDataRequest} handleActivate={handleActivate} handleDelete={handleDelete} ></RenderUsersPage>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}

                containerClassName= "flex items-center gap-2 mx-auto justify-center my-3"
                pageLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                previousLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                nextLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                activeLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 p-0 text-sm text-white shadow-md shadow-blue-500/20 transition duration-150 ease-in-out"
            />
        </div>
    );
}


const RenderUsersPage = ({currentItems, handleActivate, handleDelete ,getAllUserDataRequest} ) => {
    return (
        <div className="pl-10 relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Full name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Create At
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Role
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Action
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Account Status
                    </th>
                </tr>
                </thead>
                <tbody>
                {currentItems.map((item, key) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={key}>
                        <th scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.fullName}
                        </th>
                        <th scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <p>{moment(item.createdAt).format('DD/MM/YYYY')}</p>
                        </th>
                        <th scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.email}
                        </th>
                        <th scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {item.role}
                        </th>
                        <th scope="row"
                            className="flex px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                            <Link to={'/admin/editUser/' + item.id}>
                                <Button className='flex-auto ' color='blue'>Update</Button>
                            </Link>

                        </th>
                        <th scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white hover:cursor-pointer"
                            onClick={item.isDeleted === true ? () => {handleActivate(item.id)} : () => {handleDelete(item.id)}}
                        >


                            <Chip
                                className='max-w-[100px]'
                                size="md"
                                variant="ghost"
                                value={
                                    item.isDeleted === false
                                        ? "Active"
                                        : item.isDeleted === true
                                            ? "Deleted"
                                            : ""
                                }
                                color={
                                    item.isDeleted === false
                                        ? "green"
                                        : item.isDeleted === true
                                            ? "amber"
                                            : ""
                                }
                            />
                        </th>
                    </tr>

                ))}



                </tbody>
            </table>
        </div>
    )
}



const TABLE_HEAD = ["", "Name", "Phone Number", "Money Spent"];
const AdminPage = ({getNewTokenRequest, getNewToken, authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const [users, setUsers] = useState([]);
    const param = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const jwtTokenState = useRef(jwtToken);
    const [profitUserRole, setProfitUserRole] = useState([]);
    const [profitTotalIncome, setProfitTotalIncome] = useState();
    const [profitCountingUsers, setProfitCountingUsers] = useState();
    const [totalOrders, setTotalOrders] = useState();
    const [booksQuality, setBooksQuality] = useState();
    const [topUser, setTopUser] = useState([]);



    const deleteHandler = async (id) => {
        await deleteUser(jwtTokenState, id)
        window.location.reload();
    }


    const loadingTopUserRequest = (async () => {
        const getTopUserData = async () => {
            const {data, status} = await getTopUser(jwtTokenState.current);
            if (status === 200) {
                return {data, status};
            } else {
                toast.error(JSON.stringify(data.message));
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

        const {status, data} = await tokenRequestInterceptor(getTopUserData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    })

    const getUserRoleDataRequest = async () => {
        const getAllUserData = async () => {
            const {data, status} = await getProfitUserByRole(jwtTokenState.current);
            return {data, status}
        }

        const getRefreshToken = async () => {
            const {data, status} = await refreshTokenApi(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {data, status} = await tokenRequestInterceptor(getAllUserData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }

    const getTotalOrderDataRequest = async () => {
        const getTotalOrderData = async () => {
            const {data, status} = await getTotalOrders(jwtTokenState.current);
            return {data, status}
        }

        const getRefreshToken = async () => {
            const {data, status} = await refreshTokenApi(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {data, status} = await tokenRequestInterceptor(getTotalOrderData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }


    const getUsersCountingDataRequest = async () => {
        const getCountingUsersData = async () => {
            const {data, status} = await getProfitCountingUser(jwtTokenState.current);
            return {data, status}
        }

        const getRefreshToken = async () => {
            const {data, status} = await refreshTokenApi(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {data, status} = await tokenRequestInterceptor(getCountingUsersData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }

    const getBookQualityDataRequest = async () => {
        const getProfitBookQualityData = async () => {
            const {data, status} = await getProfitBookQuality(jwtTokenState.current);
            return {data, status}
        }

        const getRefreshToken = async () => {
            const {data, status} = await refreshTokenApi(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {data, status} = await tokenRequestInterceptor(getProfitBookQualityData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }
    const getTotalIncomeDataRequest = async () => {
        const getTotalIncomeData = async () => {
            const {data, status} = await getProfitTotalIncome(jwtTokenState.current);
            return {data, status}
        }

        const getRefreshToken = async () => {
            const {data, status} = await refreshTokenApi(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {data, status} = await tokenRequestInterceptor(getTotalIncomeData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }


    const getAllUserDataRequest = async () => {
        const getAllUserData = async () => {
            const {data, status} = await getAllUsers(jwtToken);
            return {data, status}
        }

        const getRefreshToken = async () => {
            const {data, status} = await refreshTokenApi(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {data, status} = await tokenRequestInterceptor(getAllUserData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }

    const handleActivate = (id) => {

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to activate this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I do!"
        }).then((result) => {
            if (result.isConfirmed) {
                (async () => {
                    const activateAccountRequest = async () => {
                        const {data, status} = await activateUserAccount(jwtTokenState.current, id);
                        return {data, status}
                    }

                    const getRefreshToken = async () => {
                        const {data, status} = await refreshTokenApi(jwtTokenState.current);
                        if (status === 200) {
                            jwtTokenState.current = data.jwtToken;
                            dispatch(getNewTokenSuccess(data));
                        } else {
                            dispatch(logoutSuccess());
                        }
                    };

                    const {data, status} = await tokenRequestInterceptor(activateAccountRequest, getRefreshToken);
                    if (status === 200) {
                        return data;
                    } else if (status === 401) {
                        toast.error(data.message);
                    } else {
                        toast.error(JSON.stringify(data.errors));
                    }
                })().then(data => {
                    getAllUserDataRequest().then(data => setUsers(data))
                })
                Swal.fire({
                    title: "User Activated!",
                    text: "The User had been activated",
                    icon: "success"
                });
            }
        });

    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Lock this user?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I do!"
        }).then((result) => {
            if (result.isConfirmed) {
                (async () => {
                    const deleteAccountRequest = async () => {
                        const {data, status} = await deleteUserAccount(jwtTokenState.current, id);
                        return {data, status}
                    }

                    const getRefreshToken = async () => {
                        const {data, status} = await refreshTokenApi(jwtTokenState.current);
                        if (status === 200) {
                            jwtTokenState.current = data.jwtToken;
                            dispatch(getNewTokenSuccess(data));
                        } else {
                            dispatch(logoutSuccess());
                        }
                    };

                    const {data, status} = await tokenRequestInterceptor(deleteAccountRequest, getRefreshToken);
                    if (status === 200) {
                        return data;
                    } else if (status === 401) {
                        toast.error(data.message);
                    } else {
                        toast.error(JSON.stringify(data.errors));
                    }
                })().then(data => {
                    getAllUserDataRequest().then(data => setUsers(data))
                })
                Swal.fire({
                    title: "User Locked!",
                    text: "The User had been Locked",
                    icon: "success"
                });
            }
        });


    }




    useEffect(() => {
        getAllUserDataRequest().then(data => setUsers(data))
        getUserRoleDataRequest().then(data => setProfitUserRole(data))
        getTotalIncomeDataRequest().then(data => setProfitTotalIncome(data))
        getUsersCountingDataRequest().then(data => setProfitCountingUsers(data))
        getTotalOrderDataRequest().then(data => setTotalOrders(data))
        getBookQualityDataRequest().then(data => setBooksQuality(data))
        loadingTopUserRequest().then(data => setTopUser(data))
    }, [id, jwtToken])


    return (
        <>
            <div className='w-full h-[200px] flex justify-around items-center'>
                <div className='w-[20%] bg-white rounded-md h-[80%] flex flex-col items-center border-4 border-indigo-200 border-l-indigo-500'>
                    <div className='w-full my-auto mx-auto text-center flex items-center justify-center'>
                        <BsCashCoin className='w-[50px] h-[50px] mr-3' />
                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-2xl'>Total Income </p>
                            <div className=' flex items-center'>
                                <FaDollarSign />
                                <p className='text-xl'>{profitTotalIncome}</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-[20%] bg-white rounded-md h-[80%] flex flex-col items-center border-4 border-indigo-200 border-l-indigo-500'>
                    <div className='w-full my-auto mx-auto text-center flex items-center justify-center'>
                        <GrGroup className='w-[50px] h-[50px] mr-3' />
                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-2xl'>Total User </p>
                            <div className=' flex items-center'>
                                <p className='text-xl'>{profitCountingUsers} Users</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-[20%] bg-white rounded-md h-[80%] flex flex-col items-center border-4 border-indigo-200 border-l-indigo-500'>
                    <div className='w-full my-auto mx-auto text-center flex items-center justify-center'>
                        <MdLocalShipping className='w-[50px] h-[50px] mr-3' />
                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-2xl'>Total Order </p>
                            <div className=' flex items-center'>
                                <p className='text-xl'>{totalOrders} Orders</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='w-[20%] bg-white rounded-md h-[80%] flex flex-col items-center border-4 border-indigo-200 border-l-indigo-500'>
                    <div className='w-full my-auto mx-auto text-center flex items-center justify-center'>
                        <MdOutlineGeneratingTokens className='w-[50px] h-[50px] mr-3' />
                        <div className='flex flex-col items-center'>
                            <p className='font-bold text-2xl'>Book Quality </p>
                            <div className=' flex items-center'>
                                <p className='text-xl'>{booksQuality} Books</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className='w-full h-fit flex justify-evenly'>
                <div className='mt-5 flex flex-wrap w-fit h-fit justify-between ml-3'>
                    <div className='w-[600px] mb-[30px]'>
                        <div className='max-w-[500px] w-full'>
                            <span className='w-full font-bold text-xl'>Top User </span>
                        </div>
                        <Card className="h-full w-full overflow-hidden">
                            <table className="w-full min-w-max table-auto text-left ">
                                <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th
                                            key={head}
                                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                        >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal leading-none opacity-70"
                                            >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {topUser?.map((item, key) => (
                                    <tr key={key}>
                                        <td>

                                        </td>
                                        <td className='flex items-center'>
                                            <Avatar src={item.avatar} alt="avatar"/>
                                            <Typography className='ml-1 text-sm'>
                                                {item.fullName}
                                            </Typography>
                                        </td>
                                        <td className=''>
                                            <Typography className='ml-1 text-sm'>
                                                {item.phoneNumber}
                                            </Typography>
                                        </td>
                                        <td className=''>
                                            <Typography className='ml-1 text-sm text-green-600'>
                                                {item.total} $
                                            </Typography>
                                        </td>

                                    </tr>

                                ))}

                                </tbody>
                            </table>
                        </Card>
                    </div>
                </div>
                <ProfitDataUserRoleChart users={profitUserRole}/>
            </div>
            <PaginatedItems items={users} itemsPerPage={8} getAllUserDataRequest={getAllUserDataRequest} handleActivate={handleActivate} handleDelete={handleDelete}/>

        </>

    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        getNewToken: (token) => dispatch(getNewToken(token))
    }
}
const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);