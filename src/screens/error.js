import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();
    document.title = 'Error';
    return (
        <div className='min-w-screen min-h-screen bg-[rgba(47,161,48,0.8)] flex items-center p-5 lg:p-20 overflow-hidden relative'>
            <div className='flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left'>
                <div className='w-full md:w-1/2'>
                    <div className='mb-10 md:mb-20 text-gray-600 font-light'>
                        <h1 className='font-black uppercase text-3xl lg:text-5xl text-primary mb-10'>
                            Oops
                            <br />
                            Something went wrong.
                        </h1>
                        <p>This site is not available</p>
                        <p>or you don't have permission to access this page.</p>
                    </div>
                    <div className='mb-20 md:mb-0'>
                        <button
                            onClick={() => navigate('/')}
                            className='text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-primary'
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
            <div className='w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform'></div>
            <div className='w-96 h-full bg-indigo-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform'></div>
        </div>
    );
};

export default ErrorPage;
