"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAppContext } from '@/context/AppContext';
import Swal from 'sweetalert2';

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { setUser, fetchCurrentUser } = useAppContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;
            console.log(data);
            if (data.success) {
                // The backend sets HTTP-only cookies (accessToken, refreshToken)
                // BUT it does NOT return the user object in the login response.
                // We must fetch the profile manually.
                try {
                    // Small delay to ensure browser persists cookies after cross-domain response
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const freshUser = await fetchCurrentUser();

                    Swal.fire({
                        icon: 'success',
                        title: 'Welcome',
                        text: 'Redirecting to your dashboard...',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // Safe check for role
                        const role = freshUser?.role || freshUser?.Role || 'client';
                        const target = role === 'admin' ? '/admin' : '/';
                        router.push(target);
                    });
                } catch (fetchError) {
                    console.error('Profile fetch failed:', fetchError);
                    // Fallback redirect if profile fetch fails
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged In',
                        text: 'Redirecting...',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        router.push('/');
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: data.message || 'Invalid credentials',
                    confirmButtonColor: '#D33'
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'System Error',
                text: 'Connection to corporate servers failed.',
                confirmButtonColor: '#D33'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="w-full mt-5" onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="w-full mb-4">
                <div className="relative">
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.name@templeton.apac"
                        className="w-full px-3 py-2.5 border-[1.5px] border-gray-300 rounded-md focus:outline-none focus:border-[#2E5F9E] focus:ring-1 focus:ring-[#2E5F9E] transition-colors text-black placeholder-gray-500 bg-white text-[14px]"
                    />
                </div>
                <label htmlFor="email" className="block mt-1 text-[13px] font-medium text-[#9a804a]">
                    Username or Email Address
                </label>
            </div>

            {/* Password Input */}
            <div className="w-full mb-5 relative">
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2.5 border-[1.5px] border-gray-300 rounded-md focus:outline-none focus:border-[#2E5F9E] focus:ring-1 focus:ring-[#2E5F9E] transition-colors text-black placeholder-gray-500 bg-white text-[14px]"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        title="Toggle Password Visibility"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[18px] h-[18px] cursor-pointer">
                            {showPassword ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            ) : (
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
                <label htmlFor="password" className="block mt-1 text-[13px] font-medium text-[#9a804a]">
                    Password
                </label>
            </div>

            {/* Premium Metallic Login Button with Refined 3D Border Gradient */}
            <div className="w-full p-[3px] rounded-xl mt-5 transition-all hover:brightness-110 active:scale-[0.98] shadow-[0_8px_25px_rgba(0,0,0,0.4)] bg-gradient-to-b from-[#fcfcfc] via-[#cecece] to-[#8a8a8a]">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 rounded-[10px] flex items-center justify-center gap-3 shadow-[inset_0_2px_2px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.4)]"
                    style={{
                        background: 'linear-gradient(to bottom, #1A3C61 0%, #B8C6DB 15%, #2E5F9E 85%, #4A90E2 100%)',
                    }}
                >
                    <span className="text-[17px] font-black text-black tracking-[0.1em]">{isLoading ? 'AUTHENTICATING...' : 'LOGIN'}</span>
                    {!isLoading && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-black drop-shadow-sm">
                            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    )
}
