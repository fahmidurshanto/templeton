"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getFriendlyErrorMessage } from '@/lib/error-utils';

function VerifyContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get('id');
    
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Initializing secure verification...');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const verifyAuthAndClient = async () => {
            try {
                // 1. First, verify if the current user session is valid
                await api.get('/auth/verify');

                // 2. If authenticated, proceed with client verification logic
                if (!userId) {
                    setStatus('error');
                    setMessage('Invalid verification link. No client ID provided.');
                    return;
                }

                const res = await api.get(`/stage/verify?id=${userId}`);
                if (res.data.success) {
                    setStatus('success');
                    setMessage('Client Identity Verified Successfully.');
                    setUserData(res.data.user);
                } else {
                    setStatus('error');
                    setMessage(res.data.message || 'Verification failed.');
                }
            } catch (err) {
                // 3. If unauthenticated (401), the global interceptor in AppContext handles redirection.
                // We just need to stop execution here.
                if (err.response?.status === 401 || err.silent) {
                    return;
                }

                setStatus('error');
                setMessage(getFriendlyErrorMessage(err));
            }
        };

        verifyAuthAndClient();
    }, [userId, router]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md animate__animated animate__fadeIn">
                {/* Logo Area */}
                <div className="flex justify-center mb-12">
                    <h1 className="text-3xl font-black tracking-[0.2em] uppercase">Templeton</h1>
                </div>

                {/* Verification Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-bl-full"></div>
                    
                    <div className="flex flex-col items-center text-center space-y-8">
                        {/* Inner status circle */}
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-1000 ${
                            status === 'verifying' ? 'border-white/20 animate-pulse' :
                            status === 'success' ? 'border-green-500 scale-110 shadow-[0_0_30px_rgba(34,197,94,0.3)]' :
                            'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                        }`}>
                            {status === 'verifying' && <div className="w-12 h-12 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin"></div>}
                            {status === 'success' && <span className="text-4xl text-green-500">✓</span>}
                            {status === 'error' && <span className="text-4xl text-red-500">✕</span>}
                        </div>

                        <div className="space-y-3">
                            <h2 className={`text-xl font-black uppercase tracking-widest ${
                                status === 'success' ? 'text-green-500' : 
                                status === 'error' ? 'text-red-500' : 'text-white'
                            }`}>
                                {status.toUpperCase()}
                            </h2>
                            <p className="text-xs font-bold text-gray-400 leading-relaxed max-w-[250px] mx-auto uppercase tracking-wide">
                                {message}
                            </p>
                        </div>

                        {userData && (
                            <div className="w-full mt-4 p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Client Name</p>
                                    <p className="text-sm font-black uppercase text-white">{userData.firstName} {userData.lastName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Status</p>
                                        <p className="text-xs font-bold uppercase text-green-400">Authenticated</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Visibility</p>
                                        <p className="text-xs font-bold uppercase text-white">Full Tracking</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => router.push('/')}
                            className="w-full py-4 bg-gradient-gold text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl mt-4"
                        >
                            {status === 'success' ? 'Access Dashboard' : 'Return Home'}
                        </button>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.5em]">Templeton Security Protocol v4.0</p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
                <div className="w-12 h-12 border-2 border-white/10 border-t-[#D4AF37] rounded-full animate-spin"></div>
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}

