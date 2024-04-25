import React, {useEffect, useRef, useState} from "react";
import ReactPaginate from "react-paginate";
import {useNavigate} from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip, Dialog, DialogBody, DialogFooter, DialogHeader,
    IconButton,
    Input,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import {FaBeer, FaSearch} from "react-icons/fa";
import moment from "moment/moment";
import {PencilIcon} from "@heroicons/react/24/outline";
import {
    createNewCategory,
    deleteCategories, deleteCategory, deleteUserAccount,
    getAllCategories,
    getAllUsers,
    refreshToken as refreshTokenApi,
    tokenRequestInterceptor
} from "../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {toast} from "react-toastify";
import {connect, useDispatch} from "react-redux";
import {MdDelete} from "react-icons/md";
import createCategory from "./createCategory";
import Swal from "sweetalert2";


const TABLE_HEAD = ["Category Name", "Create At", "Action"];



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

const RenderViewCategoriesPage = ({ currentItems, jwtTokenState, searchQuery }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParam] = useState(["categoryName"]);

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

    const handleDeleteCategory = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Delete this Category?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I do!"
        }).then((result) => {
            if (result.isConfirmed) {
                const {data, status} =  deleteCategory(jwtTokenState.current, id);
                window.location.reload();
                Swal.fire({
                    title: "Category Deleted!",
                    text: "The Category had been Deleted",
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
                                                    {item.categoryName}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {moment(item.createdAt).format('DD/MM/YYYY')}
                                            </Typography>
                                        </td>

                                        <td className={classes}>
                                            <Tooltip className={classes} content="Edit Category">
                                                <IconButton variant="text">
                                                    <PencilIcon className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip  className={classes} content="Delete Category">
                                                <IconButton onClick={() => handleDeleteCategory(item.id)} variant="text">
                                                    <MdDelete  className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>

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




const AdminCategoryPage = ({authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categories, setCategories] = useState([]);
    const [categoryCreate, setCategoryCreate] = useState("");
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleOpen = () => setOpen(!open);

    const createCategoryRequest = async () => {
        const loadingPendingRequest = async () => {
            const {data, status} = await createNewCategory(jwtToken, categoryCreate);
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

        const {data, status} = await tokenRequestInterceptor(loadingPendingRequest, getRefreshToken);
        if (status === 200) {
            return {data, status};
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }
    const handleConfirm = () => {
        createCategoryRequest().then(dataResponse => {
            if(dataResponse.status === 200)
                toast.success("Create Category Successfully");
                setOpen(false)
                setTimeout(() => {
                    window.location.reload();
                }, 2000)

        })
    }
    const DialogCustom = () => {
        return (
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Its a simple dialog.</DialogHeader>
                <DialogBody>
                    The key to more success is to have a lot of pillows. Put it this way,
                    it took me twenty five years to get these plants, twenty five years of
                    blood sweat and tears, and I&apos;m never giving up, I&apos;m just
                    getting started. I&apos;m up to something. Fan luv.
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={() => handleConfirm()}>
                        <span>Confirm</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        )

    }

    const getAllCategoriesDataRequest = async () => {
        const getAllCategoriesData = async () => {
            const {data, status} = await getAllCategories(jwtToken);
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

        const {data, status} = await tokenRequestInterceptor(getAllCategoriesData, getRefreshToken);
        if (status === 200) {
            return data;
        } else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    }


    useEffect(() => {
        getAllCategoriesDataRequest().then(data => setCategories(data))
    }, []);



    return (
        <>
            <div>
                <Card className="h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    All Categories
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    These are details about all books in your stalls
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


                    <div className="w-96 flex items-center">
                        <Input onChange={(e) => setCategoryCreate(e.target.value)} label="Create a new Category..."/>
                        <Button onClick={() => categoryCreate.length > 0 && setOpen(true)}>Create</Button>
                    </div>
                    <PaginatedItems itemsPerPage={4} items={categories} jwtTokenState={jwtTokenState} searchQuery={searchQuery}/>
                    {open ? <DialogCustom/> : ""}
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


export default connect(mapStateToProps, mapDispatchToProps)(AdminCategoryPage)