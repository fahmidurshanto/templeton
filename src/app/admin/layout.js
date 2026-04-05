"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import AdminTopNav from '../../components/layout/AdminTopNav';
import Footer from '../../components/layout/Footer';

export default function AdminLayout({ children }) {
    const { user, isAuthChecked } = useAppContext();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        // Don't make any decision until auth check is complete
        if (!isAuthChecked) return;

        if (user?.role === 'admin' || user?.role === 'superadmin') {
            setIsAuthorized(true);
        } else {
            // Non-admin or not logged in → redirect to home
            router.replace('/');
        }
    }, [user, isAuthChecked, router]);

    // Show spinner while checking authorization
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2E5F9E] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col overflow-x-hidden relative">
            {/* Global Lion Watermark - visible on all screens with responsive sizing */}
            <div className="absolute left-0 top-[300px] md:top-[400px] -translate-x-[30%] sm:-translate-x-[25%] md:-translate-x-[20%] -translate-y-1/2 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] md:w-[1100px] md:h-[1100px] xl:w-[1400px] xl:h-[1400px] opacity-[0.12] sm:opacity-[0.18] md:opacity-[0.22] xl:opacity-[0.25] pointer-events-none z-0">
                <img
                    src="/lion.png"
                    alt=""
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]"
                />
            </div>

            <AdminTopNav />

            <main className="pt-24 md:pt-32 lg:pt-[100px] transition-all duration-300 flex-1 relative">
                <div className="p-4 sm:p-6 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
