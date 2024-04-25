import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Avatar,
    IconButton,
    Tooltip,
    Input,
} from "@material-tailwind/react";
import {useCallback, useEffect, useRef, useState} from "react";
import {getBookPostByUserId, getStallByUserId, refreshToken, tokenRequestInterceptor} from "../../../apiServices";
import {getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import moment from "moment";
import ReactPaginate from "react-paginate";
import {FaBeer} from "react-icons/fa";
import {PencilIcon, ArrowRightIcon, ArrowLeftIcon} from "@heroicons/react/24/outline";
import React from "react";
import {useNavigate} from "react-router-dom";
import routes from "../../../config/routes";



const TABLE_HEAD = ["Title", "Author", "Create At", "Sell Status", "Price", "Available Quantity", "Edit"];


function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength) + "...";
    }
}
function PaginatedItems({ itemsPerPage, items }) {

    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        setItemOffset(newOffset);
    };

    return (
        <>
            <RenderViewBookPage currentItems={currentItems}></RenderViewBookPage>
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



const RenderViewBookPage = ({ currentItems }) => {
    const navigate = useNavigate();


    return (
        <>
            <Card className="h-full w-full">
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    All Book
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    These are details about all books in your stalls
                                </Typography>
                            </div>
                            <div className="flex w-full shrink-0 gap-2 md:w-max">
                                <div className="w-full md:w-72">
                                    <Input
                                        label="Search"
                                        icon={<FaBeer className="h-5 w-5" />}
                                    />
                                </div>
                                <Button className="flex items-center gap-3" size="sm">
                                    <FaBeer strokeWidth={2} className="h-4 w-4" /> Download
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
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
                            {currentItems.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const isLast = index === currentItems.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr className='hover:cursor-pointer'
                                            key={item.book.id}>
                                            <td className={classes}>
                                                <div className="flex items-center gap-3">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold"
                                                    >
                                                        {truncateString(item.book.title, 50)}
                                                    </Typography>
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {truncateString(item.book.author, 40)}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {moment(item.book.createdAt).format('DD/MM/YYYY')}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="w-max">
                                                    <Chip
                                                        size="sm"
                                                        variant="ghost"
                                                        value={
                                                            item.sellStatus === 1
                                                                ? "Sell"
                                                                : item.sellStatus === 0
                                                                    ? "Not sell"
                                                                    : ""
                                                        }
                                                        color={
                                                            item.sellStatus === 1
                                                                ? "green"
                                                                : item.sellStatus === 0
                                                                    ? "red"
                                                                    : ""
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item.book.price + "   VND"}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {item.book.availbleQuantity}
                                                </Typography>
                                            </td>
                                            <td onClick={() => navigate(`/stall/updateBook/${item.bookId}`)} className={classes}>
                                                <Tooltip content="Update Book">
                                                    <IconButton variant="text">
                                                        <PencilIcon className="h-4 w-4" />
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

                </Card>
        </>
    )
}


const ViewAllBookPage = ({authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const [pendingRequest, setPendingRequest] = useState([]);
    const dispatch = useDispatch();
    const jwtTokenState = useRef(jwtToken);
    const [postData, setPostData] = useState();


    const loadingRequest = (async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getBookPostByUserId(jwtTokenState.current, id);
            if(status === 200) {
                setPostData(data);
                return {data, status};
            }
            else {
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
    })


    useEffect(() => {
        loadingRequest();
    }, [jwtTokenState.current])
    return (
        <>
            <PaginatedItems itemsPerPage={4} items={pendingRequest}/>
        </>
    )
}


const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps)(ViewAllBookPage);