import TopNav from '../../components/layout/TopNav';
import Footer from '../../components/layout/Footer';

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#f4f6f8] flex flex-col overflow-x-hidden relative">
            {/* Global Watermarks - Left and Right */}
            <div className="fixed left-0 top-[300px] md:top-[40%] -translate-x-[15%] sm:-translate-x-[10%] md:-translate-x-[5%] -translate-y-1/2 w-[45vw] h-[45vw] md:w-[35vw] md:h-[35vw] max-w-[700px] max-h-[700px] min-w-[300px] min-h-[300px] opacity-[0.04] pointer-events-none z-0">
                <img
                    src="/templeton_watermark.png"
                    alt=""
                    className="w-full h-full object-contain mix-blend-multiply"
                />
            </div>
            <div className="fixed right-0 top-[400px] md:top-[60%] translate-x-[15%] sm:translate-x-[10%] md:translate-x-[5%] -translate-y-1/2 w-[45vw] h-[45vw] md:w-[35vw] md:h-[35vw] max-w-[700px] max-h-[700px] min-w-[300px] min-h-[300px] opacity-[0.04] pointer-events-none z-0">
                <img
                    src="/templeton_watermark.png"
                    alt=""
                    className="w-full h-full object-contain mix-blend-multiply"
                />
            </div>

            <TopNav />
            <main className="pt-20 md:pt-28 lg:pt-32 transition-all duration-300 flex-1 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
