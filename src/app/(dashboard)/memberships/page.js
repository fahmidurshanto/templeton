"use client";
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import api from '@/lib/api';
import NotFound from '@/components/ui/NotFound';

export default function MembershipsPage() {
    const { user } = useAppContext();
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        const fetchMemberships = async () => {
            if (!user?.id) return;
            try {
                const response = await api.get(`/user/memberships/${user.id}`);
                if (response.data.success) {
                    setTiers(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching memberships:', error);
                if (error.response?.status === 404) {
                    setIsNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMemberships();
    }, [user]);

    const renderTierCard = (tier, idx) => (
        <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 w-full mb-4 hover:shadow-md hover:border-gray-200 transition-all duration-300 group gap-3">
            <h3 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight uppercase leading-tight truncate">{tier.name}</h3>
            <span className={`px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border shrink-0 ${tier.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                {tier.status}
            </span>
        </div>
    );

    const primaryTiers = tiers.filter(t => t.type === 'primary');
    const thirdPartyTiers = tiers.filter(t => t.type === 'third_party');

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-[#2E5F9E] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isNotFound) {
        return <NotFound title="Memberships Unavailable" message="We were unable to retrieve your membership data at this time." backLink="/" backText="Home" />;
    }

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible pb-20">
            {/* Global Watermark - hidden on mobile/tablet to avoid overflow and prioritize performance */}
            <div className="hidden xl:block absolute left-0 top-1/2 -translate-x-[35%] -translate-y-1/2 w-[1400px] h-[1400px] opacity-[0.25] pointer-events-none z-0 flex items-center justify-center">
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
                        Strategic Partners
                    </h1>
                    <p className="text-[10px] sm:text-xs md:text-base text-gray-400 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto opacity-70">
                        Dual-Categorized Entity Overview • Excellence & Trust
                    </p>
                </div>
            </div>

            {/* Side-by-Side Content Section */}
            <div className="w-full max-w-7xl px-2 sm:px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 animate__animated animate__fadeInUp relative z-10 pb-20">

                {/* Primary Column */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-4 sm:gap-6 mb-6 md:mb-10">
                        <div className="h-[2px] w-6 sm:w-10 bg-[#2E5F9E] rounded-full"></div>
                        <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-[0.3em] uppercase">
                            Primary
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        {primaryTiers.map((tier, idx) => renderTierCard(tier, idx))}
                        {primaryTiers.length === 0 && (
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center py-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">No primary entities recorded</p>
                        )}
                    </div>
                </div>

                {/* 3rd Party Column */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-4 sm:gap-6 mb-6 md:mb-10">
                        <div className="h-[2px] w-6 sm:w-10 bg-gray-400 rounded-full"></div>
                        <h2 className="text-sm sm:text-lg font-black text-gray-900 tracking-[0.3em] uppercase">
                            Marketing Agents
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        {thirdPartyTiers.map((tier, idx) => renderTierCard(tier, idx))}
                        {thirdPartyTiers.length === 0 && (
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center py-10 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">No third-party alliances recorded</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full text-center py-20 mt-10">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.4em] opacity-60">Templeton Trust Fund Limited • Privilege Redefined • Since 2025</p>
            </div>
        </div>
    );
}
