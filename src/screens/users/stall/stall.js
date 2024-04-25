import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    createStall, getBookById, getProfitByQuantity, getProfitByStallId,
    getStallByUserId, getTopUser, getTopUserStall,
    refreshToken,
    tokenRequestInterceptor,
} from "../../../apiServices";
import {connect, useDispatch} from "react-redux";
import {getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import StallLayout from "../../../layout/StallLayout";
import images from "../../../assets/images";
import {Avatar, Button} from "@material-tailwind/react";
import {useFormik} from "formik";
import {toast} from "react-toastify";
import {Loading} from "../../../components/loading";
import {useLocation, useNavigate} from "react-router-dom";
import {Bar} from "react-chartjs-2";
import VerticalBarChart from "../../../components/VerticalBarChart";
import routes from "../../../config/routes";
import {Card, Typography} from "@material-tailwind/react";


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const RenderProfitQuantitySold = ({data}) => {
    // Chuẩn bị dữ liệu cho biểu đồ
    const chartData = {
        labels: data.map(entry => entry.DateTime),
        datasets: [
            {
                label: 'Total quantity sold per day',
                data: data.map(entry => entry.QuantityBookSold),
                backgroundColor: 'rgba(75,192,192,0.6)', // Màu của cột
                borderColor: 'rgba(75,192,192,1)', // Màu đường viền cột
                borderWidth: 1,
            },
        ],
    };


    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Total Quantity Book Sold',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Date time',
                },
            },
        },
    };

    return (
        <div>
            <Bar data={chartData} options={chartOptions}/>
        </div>
    );
};

const TABLE_HEAD = ["", "Name", "Phone Number", "Money Spent"];
const StallPage = ({jwtToken, id}) => {
    const [stallData, setStallData] = useState({});
    const [loading, setLoading] = useState(false);
    // const [stallId, setStallId] = useState("");
    const [chartData, setChartData] = useState([]);
    const [topUserStall, setTopUserStall] = useState([]);


    const [chartQuantitySoldData, setChartQuantitySoldData] = useState([]);


    let jwtTokenState = jwtToken;
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const loadingRequest = useCallback(async () => {
        const loadPendingRequests = async () => {
            const {data, status} = await getStallByUserId(jwtTokenState, id);
            setStallData(data);
            return {data, status};
        };

        const getRefreshToken = async () => {
            const {data, status} = await refreshToken(jwtTokenState);
            if (status === 200) {
                jwtTokenState = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            setStallData(data);
            return data
        }

    }, [jwtToken])

    const loadingProfitRequest = useCallback(async (stallId) => {
        const loadPendingRequests = async () => {
            const {data, status} = await getProfitByStallId(jwtTokenState, stallId);
            return {data, status};
        };

        const getRefreshToken = async () => {
            const {data, status} = await refreshToken(jwtTokenState);
            if (status === 200) {
                jwtTokenState = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return data
        }
    }, [stallData])

    const loadingProfitQuantitySoldRequest = useCallback(async (stallId) => {
        const loadPendingRequests = async () => {
            const {data, status} = await getProfitByQuantity(jwtTokenState, stallId);
            return {data, status};
        };

        const getRefreshToken = async () => {
            const {data, status} = await refreshToken(jwtTokenState);
            if (status === 200) {
                jwtTokenState = data.jwtToken;
                dispatch(getNewTokenSuccess(data));
            } else {
                dispatch(logoutSuccess());
            }
        };

        const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
        if (status === 200) {
            return data
        }
    }, [chartQuantitySoldData])

    const loadingTopUserRequest = (async (stallId) => {
        const getTopUserData = async () => {
            const {data, status} = await getTopUserStall(jwtTokenState.current, stallId);
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

    useEffect(() => {
        loadingRequest().then(pre => {
            if (pre && pre.id) {
                loadingProfitRequest(pre.id).then(data => {
                    setChartData(data);
                });
                loadingProfitQuantitySoldRequest(pre.id).then(data => {
                    setChartQuantitySoldData(data);
                });
                loadingTopUserRequest(pre.id).then(data => setTopUserStall(data))
            }
        });


    }, []);


    const formik = useFormik({
        initialValues: {
            stallName: '',
        },
        onSubmit: async (value) => {
            const formData = new FormData();
            formData.append('stallName', value.stallName);
            setLoading(true);

            setTimeout(async () => {
                const {data, status} = await createStall(formData, jwtTokenState)

                if (value.stallName === '' || value.stallName === null) {
                    toast.error('Stall name can not null!');
                }
                if (status === 200) {
                    toast.success(data.message);
                    setLoading(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000)
                } else {
                    toast.error(JSON.stringify(data.message));
                    setLoading(false);
                }
            }, 1000);

        },
    });

    const handleInputChange = (event) => {
        const data = event.target.value;
        formik.setFieldValue('stallName', data);
    };


    return (
        <>
            {stallData ? (stallData.stallStatus === 1 ?
                    <StallLayout>
                        <div className='mt-5 flex flex-wrap w-full h-fit justify-between ml-3'>
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
                                        {topUserStall?.map((item, key) => (
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
                            <div className='max-w-[500px] w-full'>
                                <span className='w-full font-bold text-xl'>Revenue statistics for the last 3 days</span>
                                <div className='mt-5 w-full h-fit overflow-x-auto'>
                                    {chartData.length !== 0 ? <VerticalBarChart data={chartData}/> : ""}
                                </div>
                            </div>

                            <div className='max-w-[500px] w-full'>
                                <span className='w-full font-bold text-xl'>Total Quantity sold per day</span>
                                <div className='mt-5 w-full h-fit overflow-x-auto'>
                                    {chartData.length !== 0 ?
                                        <RenderProfitQuantitySold data={chartQuantitySoldData}/> : ""}
                                </div>
                            </div>

                        </div>

                    </StallLayout> : (stallData.stallStatus === 0 ?
                        <div className='mt-3 mx-auto flex flex-col items-center w-[800px] h-[450px] bg-[#faeed1] rounded-2xl'>
                            <img className='w-[300px] h-[300px]' src={images.denyStall} alt='404'/>
                            <div className='grid gap-2'>
                                <div className="w-72 flex flex-col items-center ">
                                    <Button onClick={() => navigate(`${routes.home}`)} type="submit" className='mt-3'>Sorry!
                                        Your Stall Deny. Go back home page</Button>
                                </div>
                            </div>
                        </div> : stallData.stallStatus === 3 ?
                            <div className='mt-3 mx-auto flex flex-col items-center w-[800px] h-[450px] bg-[#faeed1] rounded-2xl'>
                                <img className='w-[300px] h-[300px]' src={images.lockStall} alt='404'/>
                                <div className='grid gap-2'>
                                    <div className="w-72 flex flex-col items-center ">
                                        <Button onClick={() => navigate(`${routes.home}`)} type="submit"
                                                className='mt-3'>Sorry! Your Stall Locked. Go back home page</Button>
                                    </div>
                                </div>
                            </div> :

                            <div className='mt-3 mx-auto flex flex-col items-center w-[800px] h-[450px] bg-[#faeed1] rounded-2xl'>
                                <img className='w-[300px] h-[300px]' src={images.pendingStall} alt='404'/>
                                <div className='grid gap-2'>
                                    <div className="w-72 flex flex-col items-center ">
                                        <Button onClick={() => navigate(`${routes.home}`)} type="submit"
                                                className='mt-3'>Your create Stall are in Pending Request. Go back home
                                            page</Button>
                                    </div>
                                </div>
                            </div>)
            ) : (
                <>
                    <div className='mt-3 flex flex-col items-center'>
                        <img className='w-[450px] h-[450px]' src={images.stall} alt='404'/>
                        <div className='grid gap-2'>
                            <form
                                onSubmit={formik.handleSubmit}
                            >
                                <div className="w-72 flex flex-col items-center ">
                                    <div className="relative h-10 w-full min-w-[200px]">
                                        <input
                                            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-blue-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                                            placeholder=" "
                                            onChange={handleInputChange}
                                        />
                                        <label
                                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-blue-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                            Stall name
                                        </label>
                                    </div>
                                    {loading ? <Loading className='mt-3 '/> : (
                                        <Button type="submit" className='mt-3'>Create your stall !!!
                                        </Button>)}

                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

        </>
    )
}
const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
        id: state.authenticateReducer.id,
    };
};

export default connect(mapStateToProps)(StallPage)