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
            <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-[#4A4A4A] rounded-full animate-spin"></div>
            </div>
        );
    }

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
