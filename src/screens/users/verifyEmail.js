import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { verifyEmail } from '../../apiServices';
import config from '../../config';

const VerifyEmailPage = ({ jwtToken }) => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [tokenFromUrl, setTokenFromUrl] = useSearchParams();
    const token = tokenFromUrl.get('token');

    useEffect(() => {
        (async () => {
            const { data, status } = await verifyEmail({ token }, jwtToken);
            if (status === 200) {
                toast.success(data.message);
            } else {
                navigate('*');
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='flex justify-center mt-10'>
            <Link
                className='font-bold px-6 py-2 bg-primary text-white rounded-full hover:bg-opacity-80'
                to={config.routes.login}
            >
                Verified successfully. Navigate to the login page
            </Link>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        jwtToken: state.authenticateReducer.jwtToken,
    };
};

export default connect(mapStateToProps)(VerifyEmailPage);
