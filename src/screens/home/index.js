import {connect, useDispatch} from 'react-redux';
import HomeSidebar from "../../components/homeSidebar";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel, Chip, Tooltip, IconButton,
} from "@material-tailwind/react";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {getBookBySort, refreshToken, tokenRequestInterceptor, updateStallStatus} from "../../apiServices";
import {getNewToken, getNewTokenSuccess, logoutSuccess} from "../../store/actions/authenticateAction";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import {toast} from "react-toastify";
import {Link, useNavigate} from "react-router-dom";
import routes from "../../config/routes";
import {useData} from "../../components/DataProvider";
import {roles} from "../../constants/role";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import {stallStatusConstant} from "../../constants";
import {FaCheck, FaLock, FaUnlock} from "react-icons/fa";
import {IoCloseSharp} from "react-icons/io5";

function truncateString(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength) + "...";
    }
}

function PaginatedItems({ itemsPerPage, items }) {

    const [itemOffset, setItemOffset] = useState(0);

    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <div className='w-full flex flex-col'>
                <div className='flex flex-wrap min-h-[1200px]'>
                   <div className='w-full h-fit flex flex-wrap'>
                       <EcommerceCard  dataResponse={currentItems}  ></EcommerceCard>
                   </div>
                </div>
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
            </div>
        </>
    );
}




function EcommerceCard({ className, dataResponse }) {
    const defaultImageHeight = '250px'; // Đặt chiều cao mặc định cho ảnh

    return (
        dataResponse.map((item) => (
            <Card key={item.id} className={`w-[19%] mx-[0.5%] my-[0.5%] h-[388px] hover:cursor-pointer ${className}`}>
                <Link className='' to={`/bookDetail/${item.id}`}>
                    <CardHeader shadow={false} floated={false} className="h-[60%] relative">
                        <img
                            src={item.images[0].imageUrl}
                            alt="card-image"
                            className="h-full w-full object-cover"
                            style={{ height: defaultImageHeight }}
                        />
                    </CardHeader>
                    <CardBody>
                        <div className="mb-2 flex flex-col items-start justify-between">
                                <div className="flex flex-wrap font-medium h-[60px] max-w-[175px]">
                                    <span>
                                        {truncateString(item.title, 20)}
                                    </span>
                                </div>
                            <Typography color="blue-gray" className="font-medium text-2xl">
                                {item.price} $
                            </Typography>
                        </div>
                    </CardBody>
                </Link>
            </Card>
        ))
    );
}


const HomePage = ({jwtToken, authenticateReducer, getNewTokenRequest}) => {
    // const [pendingRequest, setPendingRequest] = useState([]);
    const dispatch = useDispatch();
    const jwtTokenState = useRef(jwtToken);
    const navigation = useNavigate();
    const [postData, setPostData] = useState();
    const {role} = authenticateReducer;

    const { pendingRequest, setPendingRequest } = useData();

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
    }, [jwtToken, getNewTokenRequest])

    useEffect(() => {
        if(role === roles.Admin){
            navigation(`${routes.admin}`)
        }
        loadingRequest();
    }, [])



    const updateFilterData = (newData) => {
        setPendingRequest(newData);
    };



    const [activeTab, setActiveTab] = useState("newest");

    const data = [
        {
            label: "Newest",
            value: "newest",
        },
        {
            label: "Best Sellers",
            value: "bestSellers",
        },

        {
            label: "Lowest Price",
            value: "lowestPrice",
        },

        {
            label: "Highest Price",
            value: "highestPrice",
        },
    ];


    const handleChanePage = (value) => {
        setActiveTab(value)
        const changePage = (async () => {
            const loadPendingRequests = async () => {
                const {data, status} = await getBookBySort(jwtTokenState.current, value);
                if (status === 200) {
                    return {data, status};
                } else {
                    toast.error(data.message);
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
        })()
    }


    return (
        <div className='mt-18 flex'>
            {/*TODO: FIX sidebar after have Book Products---------------------------------------------------------------------------------------------*/}
            <div className='max-w-[20rem]'>
                <HomeSidebar filterData={pendingRequest} updateFilter={updateFilterData}/>
            </div>
            {/*<div className='w-full'>*/}
            <div className='flex-1'>
                <div className=''>
                    <Tabs value={activeTab}>
                        <TabsHeader
                            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 w-[50%] "
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
                                    <PaginatedItems itemsPerPage={15} items={pendingRequest}></PaginatedItems>
                                </TabPanel>
                            ))}
                        </TabsBody>
                    </Tabs>
                </div>
            </div>

        </div>
    );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
