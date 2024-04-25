import {Carousel, IconButton} from "@material-tailwind/react";
import {getBookById, refreshToken, tokenRequestInterceptor} from "../../../apiServices";
import {toast} from "react-toastify";
import {getNewTokenSuccess, logoutSuccess} from "../../../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";


export function CarouselCustomArrows({data}) {
    return (
        <Carousel
            className="rounded-xl w-[430px] h-[430px]"
            prevArrow={({handlePrev}) => (<IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handlePrev}
                className="!absolute top-2/4 left-4 -translate-y-2/4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
                </svg>
            </IconButton>)}
            nextArrow={({handleNext}) => (<IconButton
                variant="text"
                color="white"
                size="lg"
                onClick={handleNext}
                className="!absolute top-2/4 !right-4 -translate-y-2/4"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                </svg>
            </IconButton>)}
        >
            {data?.map((item) => (<img
                key={item.bookId}
                src={item.imageUrl}
                alt={item.bookId}
                className="h-full w-full object-cover"
            />))}
        </Carousel>
    );
}
const BookDetailStall = ({authenticateReducer}) => {
    const {jwtToken, id} = authenticateReducer;
    const param = useParams();
    const jwtTokenState = useRef(jwtToken);
    const dispatch = useDispatch();
    const [bookData, setBookData] = useState();

    const loadingBookRequest = (async () => {
        const getBookData = async () => {
            const {data, status} = await getBookById(jwtTokenState.current, param.id);
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

        const {status, data} = await tokenRequestInterceptor(getBookData, getRefreshToken);
        if (status === 200) {
            return data;
        }
        else if (status === 401) {
            toast.error(data.message);
        } else {
            toast.error(JSON.stringify(data.errors));
        }
    })

    useEffect(() => {
        loadingBookRequest().then(data => setBookData(data))

    }, []);

    console.log("data", param.id)

    return (
        <>
            <CarouselCustomArrows data={bookData?.images}/>
        </>
    )
}
const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};


export default connect(mapStateToProps)(BookDetailStall)