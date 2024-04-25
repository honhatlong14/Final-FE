import Footer from '../components/footer';
import Header from '../components/Header';
import {DataProvider} from "../components/DataProvider";

const ApplicationBaseLayout = ({children}) => {
    return (
        <>

                <Header/>
                {/*<main className='mt-[70px] mb-[2rem] h-max min-h-screen w-[1440px] m-auto'>{children}</main>*/}
                <main className='mb-[2rem] h-max min-h-screen w-[1440px] m-auto'>{children}</main>
                <Footer/>

        </>
    );
};
export default ApplicationBaseLayout;
