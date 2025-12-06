import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MobileNavbar from '../components/MobileNavbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <main className="flex flex-col gap-2.5 items-center relative w-full min-h-screen pb-20 md:pb-0">
                <div className="flex items-start relative w-full max-w-[1460px]">
                    <Sidebar />
                    <div className="flex-1 box-border flex gap-2.5 grow items-start px-0 md:px-[92px] py-0 relative w-full">
                        <div className="flex-1 box-border flex flex-col grow isolate items-start px-0 md:px-11 py-0 relative self-stretch shrink-0 w-full">
                            <Header />
                            <div className="w-full px-4 md:px-0">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <MobileNavbar />
        </>
    );
}
