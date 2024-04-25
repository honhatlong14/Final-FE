import StallLayout from "../../../layout/StallLayout";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {
    getAllOrders, getBookBySort,
    getOrdersByStallId,
    getStallByUserId,
    refreshToken,
    tokenRequestInterceptor
} from "../../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip, Input,
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
    Typography
} from "@material-tailwind/react";
import routes from "../../../config/routes";
import images from "../../../assets/images";
import truncateString from "../../../components/truncateString";
import {toast} from "react-toastify";
import {PencilIcon, ArrowRightIcon, ArrowLeftIcon} from "@heroicons/react/24/outline";
import ReactPaginate from "react-paginate";
import {FaSearch} from "react-icons/fa";


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
            <OrdersList currentItems={currentItems}></OrdersList>
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
        </>
    );
}

function OrdersList({className, currentItems}) {
    const navigate = useNavigate();
    const [searchParam] = useState(["OrderId"]);
    const [q, setQ] = useState("");


    function search(items) {
        return items.filter((item) => {
            return searchParam.some((newItem) => {
                return (
                    item[newItem]
                        .toString()
                        .toLowerCase()
                        .indexOf(q.toLowerCase()) > -1 || item.OrderDetail.some((o) => {
                            return (
                                o['Title'].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
                            )
                    } )
                );
            });
        });
    }


    return (
        currentItems.length !== 0 ?
            <div className='flex flex-col w-full'>
                <div className="ml-3 mb-3 relative flex w-full max-w-[24rem]">
                    <Input
                        type="email"
                        label="Search By Order Number"
                        // value={email}
                        onChange={e => setQ(e.target.value)}
                        className="pr-20"
                        containerProps={{
                            className: "min-w-0",
                        }}
                        icon={ <FaSearch />}
                    />
                </div>
                <div>
                    <div className='px-3 py-3 mx-3 mb-3 min-w-[910px] bg-[#f5f5fa] h-fit'>
                        {search(currentItems).map((i, index) => (
                            <div className='group bg-white mb-3'>
                                <div className='group-hover:bg-[#f5f5fa] flex group-hover:cursor-pointer'>
                                    <div className='min-w-[213px] mx-1'>
                                        <div className="w-max flex">
                                            <Chip
                                                size="sm"
                                                variant="ghost"
                                                value={
                                                    i.PaymentStatus === "success"
                                                        ? "Paid"
                                                        : i.PaymentStatus === null
                                                            ? "Not paid"
                                                            : ""
                                                }
                                                color={
                                                    i.PaymentStatus === "success"
                                                        ? "green"
                                                        : i.PaymentStatus === null
                                                            ? "red"
                                                            : ""
                                                }
                                            />
                                        </div>
                                        <div className="w-max">
                                            <Chip
                                                size="sm"
                                                variant="ghost"
                                                value={
                                                    i.PaymentMethod === 0
                                                        ? "Cash"
                                                        : i.PaymentMethod === 1
                                                            ? "Cart"
                                                            : ""
                                                }
                                                color={
                                                    i.PaymentMethod === 0
                                                        ? "blue"
                                                        : i.PaymentMethod === 1
                                                            ? "green"
                                                            : ""
                                                }
                                            />
                                        </div>
                                        <div className="w-max">
                                            <Chip
                                                size="sm"
                                                variant="ghost"
                                                value={
                                                    i.ShippingStatus === 0
                                                        ? "Prepare"
                                                        : i.ShippingStatus === 1
                                                            ? "On Delivery"
                                                            : i.ShippingStatus === 2
                                                                ? "Received"
                                                                : ""
                                                }
                                                color={
                                                    i.ShippingStatus === 0
                                                        ? "blue"
                                                        : i.ShippingStatus === 1
                                                            ? "violet"
                                                            : i.ShippingStatus === 2
                                                                ? "green"
                                                                : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className='group-hover:bg-[#f5f5fa] group-hover:cursor-pointer'>
                                        <span className='font-bold text-xl mr-3'>Order Number:</span>
                                        <span className='font-bold text-cyan-500'>{i.OrderId}</span>
                                    </div>
                                </div>
                                <div key={index}
                                     onClick={ () => navigate('/stall/manager/listOrders/' + i.OrderId) }
                                     className='bg-white py-3 h-fit w-full flex flex-col items-center group-hover:bg-[#f5f5fa] group-hover:cursor-pointer'>
                                    {i.OrderDetail.map((item, index) => (
                                        <div className='flex'>
                                            <div
                                                className='w-[80px] h-[80px] relative mr-[5px] mb-[5px] flex items-center '>
                                                <img className='w-full h-full object-cover' src={item.ImageUrl}
                                                     alt={item.ImageUrl}/>
                                            </div>
                                            <div className='w-[252px]'>
                                                {truncateString(item.Title, 30)}
                                            </div>
                                            <div className='ml-5 w-[150px] h-fit flex'>
                                                <p>x</p> {(item.Quantity)}
                                            </div>
                                            <div className='ml-5 w-[150px] h-fit flex justify-evenly'>
                                                <p>Total:</p> {item.Total} đ
                                            </div>
                                        </div>

                                    ))}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            :
            <div className='flex flex-col hover:cursor-pointer hover:text-blue-800 w-full items-center'
                 onClick={() => navigate(`${routes.home}`)}>
                <img className="w-[450px] h-[450px]" src="http://res.cloudinary.com/dr1eznvmn/image/upload/v1699202446/6d957cda-94a9-4db2-be31-6fb02e729515.jpg" alt=""/>
                <p className="text-center text-2xl font-bold hover:cursor-pointer ">Filter order empty</p>
            </div>
    );
}

const ListOrdersPage = ({authenticateReducer, getNewTokenRequest}) => {
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const [pendingRequest, setPendingRequest] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [activeTab, setActiveTab] = useState("all");
    const data = [
        {
            label: "All",
            value: "all",
        },
        {
            label: "Prepare",
            value: "prepare",
        },

        {
            label: "On Delivery",
            value: "onDelivery",
        },

        {
            label: "Received",
            value: "received",
        },
    ];

    const dataValue = Object.values(pendingRequest);

    const getStallInfo = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getStallByUserId(jwtTokenState.current, id);
            return {data, status};
        };

        const getRefreshToken = async () => {
            const {data, status} = await refreshToken(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return data;
        }

    }, [jwtToken, getNewTokenRequest])

    const loadingOrdersRequest = useCallback(async (stallId, filter) => {
        const loadPendingRequests = async () => {
            const {data, status} = await getOrdersByStallId(jwtTokenState.current, stallId, filter);
            return {data, status};
        };

        const getRefreshToken = async () => {
            const {data, status} = await refreshToken(jwtTokenState.current);
            if (status === 200) {
                jwtTokenState.current = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return data;
        }

    }, [jwtToken, getNewTokenRequest])
    const handleChanePage = (value) => {
        setActiveTab(value)
        const changePage = (async () => {
            getStallInfo().then(pre => {
                loadingOrdersRequest(pre.id, value).then(data => {
                    setPendingRequest(data)
                })
            })
        })()
    }


    useEffect(() => {
        getStallInfo().then(pre => {
            loadingOrdersRequest(pre.id, "all").then(data => {
                setPendingRequest(data)
            })
        })
    }, [])


    return (
        <>
            <StallLayout>
                <div className='w-full'>
                    <div className=''>
                        <Tabs value={activeTab}>
                            <TabsHeader
                                className="rounded-none border-b border-blue-gray-50 bg-transparenxxxxt p-0 w-[50%] "
                                indicatorProps={{
                                    className:
                                        "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                                }}
                            >
                                {data.map(({label, value}) => (
                                    <Tab
                                        key={value}
                                        value={value}
                                        onClick={() => handleChanePage(value)}
                                        className={` ${activeTab === value ? "text-gray-900" : ""}`}
                                    >
                                        {label}
                                    </Tab>
                                ))}
                            </TabsHeader>
                            <TabsBody>
                                {data.map(({value}) => (
                                    <TabPanel key={value} value={value} className='flex flex-wrap justify-start'>
                                        <PaginatedItems items={pendingRequest} itemsPerPage={5}/>
                                    </TabPanel>
                                ))}
                            </TabsBody>
                        </Tabs>
                    </div>
                </div>
            </StallLayout>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getNewTokenRequest: (jwtToken) => dispatch(getNewToken(jwtToken)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListOrdersPage)