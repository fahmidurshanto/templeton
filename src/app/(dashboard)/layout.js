import TopNav from '../../components/layout/TopNav';
import Footer from '../../components/layout/Footer';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#f4f6f8] flex flex-col overflow-x-hidden relative">
            {/* Global Lion Watermark - visible on all screens with responsive sizing */}
            <div className="absolute left-0 top-[300px] md:top-[400px] -translate-x-[30%] sm:-translate-x-[25%] md:-translate-x-[20%] -translate-y-1/2 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] md:w-[1100px] md:h-[1100px] xl:w-[1400px] xl:h-[1400px] opacity-[0.12] sm:opacity-[0.18] md:opacity-[0.22] xl:opacity-[0.25] pointer-events-none z-0">
                <img
                    src="/lion.png"
                    alt=""
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]"
                />
            </div>

            <TopNav />
            <main className="pt-24 md:pt-32 lg:pt-[100px] transition-all duration-300 flex-1 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
