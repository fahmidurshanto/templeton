import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound({ 
    title = "Resource Not Found", 
    message = "The information you are looking for is either unavailable or has been moved to a different sector.",
    backLink = "/admin/users",
    backText = "Return to Oversight"
}) {
    const router = useRouter();

    return (
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden px-4">
            {/* Background Accent - hidden on mobile */}
            <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2E5F9E]/5 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-xl animate__animated animate__fadeIn">
                <div className="mb-6 sm:mb-8 relative inline-block">
                    <div className="text-[80px] sm:text-[120px] font-black text-gray-100 leading-none select-none tracking-tighter opacity-50">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#2E5F9E]/30 flex items-center justify-center bg-white shadow-xl">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#2E5F9E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight mb-4 leading-tight px-2">
                    {title}
                </h1>
                
                <p className="text-gray-400 sm:text-gray-500 font-medium text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed px-4">
                    {message}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="px-8 py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm w-full sm:w-auto"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => router.push(backLink)}
                        className="px-8 py-4 rounded-2xl bg-gradient-blue text-black font-black text-xs uppercase tracking-widest hover:scale-105 shadow-xl hover:shadow-blue-500/20 transition-all w-full sm:w-auto"
                    >
                        {backText}
                    </button>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] opacity-60 italic">Templeton Trust Fund • Privilege Redefined</p>
                </div>
            </div>
        </div>
    );
}
