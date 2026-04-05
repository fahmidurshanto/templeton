"use client";
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import api from '@/lib/api';
import NotFound from '@/components/ui/NotFound';

// No longer using hardcoded services


export default function ServicesPage() {
    const { user } = useAppContext();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        const fetchServices = async () => {
            if (!user?.id) return;
            try {
                const response = await api.get(`/user/user-services/${user.id}`);
                if (response.data.success) {
                    setServices(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                if (error.response?.status === 404) {
                    setIsNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-[#2E5F9E] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isNotFound) {
        return <NotFound title="Services Unavailable" message="We were unable to retrieve your account services at this time." />;
    }

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible">
            {/* Global Watermark - hidden on mobile/tablet to avoid overflow and prioritize performance */}
            <div className="hidden xl:block absolute left-0 top-[240px] -translate-x-[35%] -translate-y-1/2 w-[1400px] h-[1400px] opacity-[0.25] pointer-events-none z-0 flex items-center justify-center">
                <img
                    src="/lion.png"
                    alt=""
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]"
                />
            </div>

            {/* Header Section */}
            <div className="w-full text-center py-8 md:py-14 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[15vh] md:min-h-[25vh]">
                <div className="relative z-10 w-full px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 tracking-tight text-gradient-blue bg-clip-text uppercase leading-none">
                        Our Services
                    </h1>
                    <p className="text-[10px] sm:text-xs md:text-base text-gray-400 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto opacity-70">
                        Subscribed & Strategic Account Services • Precision & Trust
                    </p>
                </div>
            </div>

            {/* Services List Section */}
            <div className="w-full max-w-4xl animate__animated animate__fadeInUp">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#2E5F9E]/30 overflow-hidden">
                    <div className="bg-gradient-blue px-6 py-4 flex items-center justify-between border-b border-[#1E3F66]/30">
                        <h2 className="text-black font-black text-xs sm:text-sm tracking-widest uppercase">Available Services</h2>
                        <span className="bg-black/10 text-black px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-tight">
                            Total: {services.length}
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {services.map((service, idx) => (
                            <div key={idx} className="group p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight group-hover:text-[#1A3C61] transition-colors">
                                        {service.name}
                                    </h3>
                                </div>

                                <div className="flex items-center">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm
                                        ${service.status === 'Valid'
                                            ? 'bg-green-50 text-green-600 border-green-100 shadow-green-900/5'
                                            : 'bg-red-50 text-red-600 border-red-100 shadow-red-900/5'}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Valid' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                        {service.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 px-8 py-4 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Templeton Trust Fund Limited • Precision & Trust</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
