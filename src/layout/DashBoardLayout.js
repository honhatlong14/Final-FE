import SideBar from '../components/sidebar';

const DashBoardLayout = ({ children }) => {
    return (
        <div className='w-screen h-screen flex flex-col-reverse md:flex-row'>
            <div className='min-w-[260px] w-full sm:w-[200px] md:h-full'>
                <SideBar />
            </div>
            <main className='w-full flex-auto mb-5 flex justify-center h-full overflow-y-auto'>
                <div className='w-full sm:mt-5'>{children}</div>
            </main>
        </div>
    );
};
export default DashBoardLayout;
