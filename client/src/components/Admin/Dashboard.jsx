import { useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import MenuIcon from '@mui/icons-material/Menu';
import MobileSidebar from './Sidebar/MobileSidebar';

const Dashboard = ({ activeTab, children }) => {
    const [onMobile, setOnMobile] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [showMobileSidebar, setShowMobileSidebar] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 600;
            setOnMobile(isMobile);
            if (!isMobile) {
                setShowMobileSidebar(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <main className="flex h-auto sm:min-w-full mt-4">
                {!onMobile && <Sidebar activeTab={activeTab} />}
                {toggleSidebar && <Sidebar activeTab={activeTab} setToggleSidebar={setToggleSidebar} />}
                {onMobile && (
                    <div className="fixed bottom-6 right-6 z-50">
                        <button
                            onClick={() => setShowMobileSidebar(true)}
                            className="bg-blue-600 w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                            aria-label="Open menu"
                        >
                            <MenuIcon className="w-7 h-7" />
                        </button>
                    </div>
                )}

                <div className="w-full sm:w-4/5 sm:ml-72 h-auto">
                    <div className="flex flex-col gap-6 sm:m-8 p-2 pb-6 overflow-hidden">
                        {children}
                    </div>
                </div>

                {onMobile && (
                    <MobileSidebar
                        open={showMobileSidebar}
                        onClose={() => setShowMobileSidebar(false)}
                    />
                )}
            </main>
        </>
    );
};

export default Dashboard;
