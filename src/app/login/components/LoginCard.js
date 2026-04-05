import React from 'react';
import LoginForm from './LoginForm';

export default function LoginCard() {
    return (
        <div className="w-full max-w-[380px] mx-auto rounded-lg p-[3px] bg-gradient-to-b from-[#1A3C61] via-[#DDE5F0] to-[#1A3C61] shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate__animated animate__zoomIn animate__fast">
            <div className="bg-white rounded-[5px] w-full overflow-hidden relative shadow-inner flex flex-col pt-8">
                <div className="px-6 sm:px-10 pb-6 relative z-10 bg-white">
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-4 flex items-center justify-center">
                            <img src="/templeton-logo.png" alt="Templeton Trust Fund Ltd." className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-[18px] sm:text-[20px] leading-tight font-bold text-center text-black mb-2 mt-1 uppercase tracking-tight">
                            WELCOME TO THE<br />PARTNERSHIP PORTAL
                        </h1>
                        <p className="text-[12px] sm:text-[13px] text-center text-black font-medium leading-snug">
                            Please enter your corporate credentials to continue.
                        </p>
                    </div>
                    
                    <LoginForm />
                    
                    <div className="mt-7 flex justify-center items-center text-[12px]">
                        <span className="text-white w-4 h-4 mr-1.5 rounded-full bg-[#2E5F9E] text-[10px] flex justify-center items-center font-bold">?</span>
                        <span className="text-black font-medium">Having trouble logging in? <a href="#" className="font-semibold text-[#1E3F66] underline decoration-[#1E3F66] underline-offset-2 hover:text-[#1A3C61]">Contact Support</a></span>
                    </div>
                </div>
                
                {/* Footer Bar */}
                <div className="py-2.5 px-4 text-center text-[11px] text-gray-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] bg-gradient-to-r from-[#1A3C61] via-[#B8C6DB] to-[#1A3C61] font-medium relative z-10 border-t border-[#2E5F9E]">
                    Powered by Templeton Trust Fund Ltd.
                </div>
            </div>
        </div>
    )
}
