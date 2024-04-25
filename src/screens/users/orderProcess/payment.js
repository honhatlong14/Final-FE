import {useEffect, useRef, useState} from "react";
import {Elements} from "@stripe/react-stripe-js";
import CheckoutForm from "../../../components/checkoutForm";
import {connect} from "react-redux";
import {loadStripe} from "@stripe/stripe-js";


const stripePromise = loadStripe('pk_test_51OxKACRpntJeZywLrKBKuftTGdBeJ9gg9zkq7TotnSJWg5hJb3DzwpH9q9bEjna3ufSTJdwdPr5joxJOIAabYggv001i4tXbsL');
const PaymentPage = ({authenticateReducer}) => {

    const [clientSecret, setClientSecret] = useState("");
    const {jwtToken, id} = authenticateReducer;
    const jwtTokenState = useRef(jwtToken);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch(`https://localhost:7158/create-payment-intent/${id}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };


    return (
        <>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm/>
                </Elements>
            )}
        </>


    )

}

const mapStateToProps = (state) => {
    return {
        authenticateReducer: state.authenticateReducer,
    };
};

export default connect(mapStateToProps)(PaymentPage)