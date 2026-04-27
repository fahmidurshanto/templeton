import React, { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginCard() {
    return (
        <div className="w-full max-w-[380px] mx-auto rounded-lg p-[3px] bg-gradient-premium shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate__animated animate__zoomIn animate__fast">
            <div className="bg-white rounded-[5px] w-full overflow-hidden relative shadow-inner flex flex-col pt-8">
                <div className="px-6 sm:px-10 pb-6 relative z-10 bg-white">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-[85%] h-auto mb-4 flex items-center justify-center">
                            <img src="/templeton-logo.png" alt="Templeton Trustees (S) Ltd." className="w-full h-auto object-contain" />
                        </div>
                        <h1 className="text-[18px] sm:text-[20px] leading-tight font-bold text-center text-black mb-2 mt-1 uppercase tracking-tight">
                            WELCOME TO THE<br />PARTNERSHIP PORTAL
                        </h1>
                        <p className="text-[12px] sm:text-[13px] text-center text-black font-medium leading-snug">
                            Please enter your corporate credentials to continue.
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-3 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                            <p className="mt-4 text-[13px] text-gray-500 font-medium animate-pulse">Initializing Secure Portal...</p>
                        </div>
                    }>
                        <LoginForm />
                    </Suspense>

                    <div className="mt-7 flex justify-center items-center text-[12px]">
                        <span className="text-white w-4 h-4 mr-1.5 rounded-full bg-brand-primary text-[10px] flex justify-center items-center font-bold">?</span>
                        <span className="text-black font-medium">Having trouble logging in? <a href="#" className="font-semibold text-brand-primary underline decoration-brand-primary underline-offset-2 hover:text-brand-muted">Contact Support</a></span>
                    </div>
                </div>

                {/* Footer Bar */}
                <div className="py-2.5 px-4 text-center text-[11px] text-gray-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] bg-gradient-silver-horizontal font-medium relative z-10 border-t border-brand-border">
                    Powered by Templeton Trustees (S) Ltd.
                </div>
            </div>
        </div>
    )
}

