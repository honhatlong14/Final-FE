import UserSidebar from "../components/userSidebar";

const ProfileLayout = ({children}) => {
    return (
        <>
            <div className='w-full flex flex-col-reverse md:flex-row'>
                <div className='w-full sm:w-[250px] md:h-full'>
                    <UserSidebar/>
                </div>
                <main className='w-full mb-5 flex justify-center h-full overflow-y-hidden'>
                    {children}
                </main>
            </div>

        </>
    )
}


export default ProfileLayout;