import UserSidebar from "../components/userSidebar";
import StallSidebar from "../components/stallSidebar";

const StallLayout = ({children}) => {
    return (
        <>
            <div className='w-full flex flex-col-reverse md:flex-row'>
                <div className='w-full sm:w-[250px] md:h-full'>
                    <StallSidebar/>
                </div>
                <main className='w-full mb-5 flex justify-center h-full overflow-y-hidden'>
                    {children}
                </main>
            </div>
        </>
    )
}

export default StallLayout;