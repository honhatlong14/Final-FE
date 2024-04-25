import {LinkAuthenticationElement, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useCallback, useEffect, useRef, useState} from "react";
import {createOrderOrderDetail, getDefaultAddress, refreshToken, tokenRequestInterceptor} from "../apiServices";
import {getNewTokenSuccess, logoutSuccess} from "../store/actions/authenticateAction";
import {connect, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

 function CheckoutForm({authenticateReducer, getNewTokenRequest}) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);
    const dispatch = useDispatch();
    const [orderData, setOrderData] = useState({})



    // const loadingCreateOrderRequest = useCallback(async () => {
    //     const loadPendingRequests = async () => {
    //         const {data, status} = await createOrderOrderDetail(jwtTokenState.current, id);
    //         return {data, status};
    //     };
    //
    //     const getRefreshToken = async () => {
    //         const {data, status} = await refreshToken(jwtTokenState);
    //         if (status === 200) {
    //             jwtTokenState.current = data.jwtToken;
    //             dispatch(getNewTokenSuccess(data));
    //         } else {
    //             dispatch(logoutSuccess());
    //         }
    //     };
    //
    //     const {status, data} = await tokenRequestInterceptor(loadPendingRequests, getRefreshToken);
    //     if (status === 200) {
    //         setOrderData(data);
    //     }
    //
    // }, [jwtToken, getNewTokenRequest])

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }


        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: "http://localhost:3000",
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);

    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                  {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps)(CheckoutForm)