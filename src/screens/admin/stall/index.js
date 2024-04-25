import React, {useEffect, useRef, useState} from "react";
import ReactPaginate from "react-paginate";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardHeader, Chip,
    IconButton,
    Input,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import {FaBeer, FaCheck, FaLock, FaSearch, FaUnlock} from "react-icons/fa";
import {
    createNewCategory,
    deleteCategories, deleteCategory, deleteUserAccount,
    getAllCategories, getAllStalls,
    getAllUsers,
    refreshToken as refreshTokenApi,
    tokenRequestInterceptor, updateStallStatus
} from "../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {toast} from "react-toastify";
import {connect, useDispatch} from "react-redux";
import {MdDelete} from "react-icons/md";
import {stallStatusConstant} from "../../../constants";
import {IoCloseCircleOutline, IoCloseSharp} from "react-icons/io5";
import Swal from "sweetalert2";


const TABLE_HEAD = ["Stall Name", "Created By", "Phone Number", "Status" , "Action"];



function PaginatedItems({ itemsPerPage, items , jwtTokenState, searchQuery }) {

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
        <>
            <RenderViewCategoriesPage currentItems={currentItems} jwtTokenState={jwtTokenState} searchQuery={searchQuery} ></RenderViewCategoriesPage>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}

                containerClassName= "flex items-center gap-2 justify-center my-3"
                pageLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                previousLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                nextLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300"
                activeLinkClassName="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-pink-600 to-pink-400 p-0 text-sm text-white shadow-md shadow-pink-500/20 transition duration-150 ease-in-out"
            />
        </>
    );
}

const RenderViewCategoriesPage = ({ currentItems, jwtTokenState, searchQuery}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParam] = useState(["fullName", "stallName"]);



    function search(items) {
        return items.filter((item) => {
            return searchParam.some((newItem) => {
                return (
                    item[newItem]
                        .toString()
                        .toLowerCase()
                        .indexOf(searchQuery.toLowerCase()) > -1
                );
            });
        });
    }

    const handleActivate = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Activate this Stall?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I do!"
        }).then((result) => {
            if (result.isConfirmed) {
                const { data, status} = updateStallStatus(jwtTokenState.current, id, stallStatusConstant.Activate);
                window.location.reload();
                Swal.fire({
                    title: "Stall Locked!",
                    text: "The Stall had been Activated",
                    icon: "success"
                });
            }
        });
    }

    const handleLockStall = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Lock this Stall?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I do!"
        }).then((result) => {
            if (result.isConfirmed) {
                const {data, status} = updateStallStatus(jwtTokenState.current, id, stallStatusConstant.Lock);
                window.location.reload();
                Swal.fire({
                    title: "Stall Locked!",
                    text: "The Stall had been Locked",
                    icon: "success"
                });
            }
        });

    }

    const handleDeny = async (id) => {

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Activate this Stall?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I do!"
        }).then((result) => {
            if (result.isConfirmed) {
                const {data, status} = updateStallStatus(jwtTokenState.current, id, stallStatusConstant.Deny);
                window.location.reload();
                Swal.fire({
                    title: "Deny Stall Request!",
                    text: "The Stall had been Denied",
                    icon: "success"
                });
            }
        });
    }


    return (
        <>

            <CardBody className=" px-0">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th
                                key={head}
                                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
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
                    {search(currentItems).map(
                        (
                            item,
                            index,
                        ) => {
                            const isLast = index === currentItems.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={item.id}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {item.stallName}
                                            </Typography>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {item.fullName}
                                            </Typography>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-bold"
                                            >
                                                {item.phoneNumber}
                                            </Typography>
                                        </div>
                                    </td>

                                    <td className={classes}>
                                        <div className='w-[40%]'>
                                            <Chip
                                                size="sm"
                                                variant="ghost"
                                                value={
                                                    item.stallStatus === 0
                                                        ? "Deny"
                                                        : item.stallStatus === 1
                                                            ? "Activate"
                                                            : item.stallStatus === 2
                                                                ? "Pending" : "Lock"
                                                }
                                                color={
                                                    item.stallStatus === 0
                                                        ? "red"
                                                        : item.stallStatus === 1
                                                            ? "green"
                                                            : item.stallStatus === 2
                                                                ? "blue" : "yellow"
                                                }
                                            />
                                        </div>
                                    </td>


                                    {item.stallStatus === stallStatusConstant.Deny ? (
                                        <> <td className={classes}>
                                        </td></>
                                    ) :
                                        item.stallStatus === stallStatusConstant.Activate ? <>
                                            <td className={classes}>
                                                <Tooltip className={classes} content="Lock Stall">
                                                    <IconButton onClick={() => handleLockStall(item.id)} variant="text">
                                                        <FaLock className="h-4 w-4"/>
                                                    </IconButton>
                                                </Tooltip>
                                            </td>
                                    </> : item.stallStatus === stallStatusConstant.Pending ?
                                            <>
                                                <td className={classes}>
                                                    <Tooltip  className={classes} content="Accept Activate Stall">
                                                        <IconButton onClick={() => handleActivate(item.id)} variant="text">
                                                            <FaCheck   className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip  className={classes} content="Deny Activate Stall">
                                                        <IconButton onClick={() => handleDeny(item.id)} variant="text">
                                                            <IoCloseSharp className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>

                                            </> : <>
                                                <td className={classes}>
                                                    <Tooltip  className={classes} content="Activate Stall">
                                                        <IconButton onClick={() => handleActivate(item.id)} variant="text">
                                                            <FaUnlock className="h-4 w-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </td>
                                            </>
                                    }
                                </tr>
                            );
                        },
                    )}
                    </tbody>
                </table>
            </CardBody>

        </>
    )
}




const AdminStallPage = ({authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [stalls, setStalls] = useState([]);
    const [categoryCreate, setCategoryCreate] = useState("");
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");


    const updateFilterData = (newData) => {
        setStalls(newData);
    };


    const getAllStallsDataRequest = async () => {
        const getAllStallsData = async () => {
            const {data, status} = await getAllStalls(jwtToken);
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

        const {data, status} = await tokenRequestInterceptor(getAllStallsData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }


    useEffect(() => {
        getAllStallsDataRequest().then(data => setStalls(data))
    }, []);



    return (
        <>
            <div>
                <Card className="h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    All User Stall
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Management Stall Here
                                </Typography>
                            </div>
                            <div className="flex w-full shrink-0 gap-2 md:w-max">
                                <div className="w-full md:w-72">
                                    <Input
                                        label="Search"
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        icon={<FaSearch className="h-5 w-5"/>}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>


                    <PaginatedItems itemsPerPage={4} items={stalls} jwtTokenState={jwtTokenState} searchQuery={searchQuery}/>
                </Card>
            </div>
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


export default connect(mapStateToProps, mapDispatchToProps)(AdminStallPage)