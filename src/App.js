import AppRouter from './router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import {GoogleOAuthProvider} from "@react-oauth/google";

function App() {
    return (
        <>
            <GoogleOAuthProvider clientId="144816886130-7o8hl4b5e6frf4ht00cif7cpsq2vc5ci.apps.googleusercontent.com">
            {/*<TestPage/>*/}
            <AppRouter />
            <ToastContainer
                position='top-center'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                pauseOnHover
                limit={1}
            />
            </GoogleOAuthProvider>
        </>
    );
}

export default App;
