export default function DashboardHero() {
    return (
        <div className="w-full text-center py-8 md:py-16 mb-8 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[40vh]">

            <div className="relative z-10 w-full">

                <button className="cursor-pointer px-8 py-3 rounded-full text-gray-900 bg-gradient-blue font-bold shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.6)] hover:scale-105 transition-all flex items-center justify-center mx-auto border border-transparent">
                    EXPLORE NEW OPPORTUNITIES
                    {/* Cursor icon mockup as seen in design */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2 -mb-1 animate-bounce text-gray-900 drop-shadow-sm">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.141-7.312m2.369 5.087l-2.275-6.22m0 0l-3.262 4.315-1.99-6.93" /> {/* Hand pointer roughly */}
                    </svg>
                </button>
            </div>
        </div>
    )
}
