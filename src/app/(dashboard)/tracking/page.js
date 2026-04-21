"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import api from '@/lib/api';

export default function TrackingPage() {
    const router = useRouter();
    const { user } = useAppContext();
    const [stages, setStages] = useState([]);
    const [stageVisibility, setStageVisibility] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            if (user?.id || user?._id) {
                const userId = user._id || user.id;
                try {
                    const meRes = await api.get('/auth/me');
                    if (meRes.data.success) {
                        const isVisible = meRes.data.user.stageVisibility || false;
                        setStageVisibility(isVisible);
                        
                        if (isVisible) {
                            const stageRes = await api.get(`/stage/user/${userId}`);
                            if (stageRes.data.success) {
                                setStages(stageRes.data.stage || []);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Data fetch error:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadUserData();
    }, [user?.id, user?._id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#4A4A4A] rounded-full animate-spin mx-auto mb-4 scale-75 md:scale-100"></div>
            </div>
        );
    }

    if (!stageVisibility) {
        return (
            <div className="animate__animated animate__fadeIn">
                <div className="rounded-2xl p-[6px] bg-metallic-silver shadow-xl">
                    <div className="bg-white rounded-[13px] h-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-2px_10px_rgba(0,0,0,0.02)] p-8 md:p-10 flex flex-col relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10"></div>
                        <h2 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] mb-4 relative z-10">Verification Status</h2>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-tight relative z-10">you donot have permission to access stages</p>
                    </div>
                </div>
            </div>
        );
    }

    if (stages.length === 0) {
        return (
            <div className="animate__animated animate__fadeIn">
                <div className="rounded-2xl p-[6px] bg-metallic-silver shadow-xl">
                    <div className="bg-white rounded-[13px] h-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-2px_10px_rgba(0,0,0,0.02)] p-8 md:p-10 flex flex-col relative overflow-hidden text-center">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10"></div>
                        <h2 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] mb-4 relative z-10">Journey Status</h2>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-tight relative z-10">No stage added</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Journey Progress Section - EXACT MATCH FROM DASHBOARD */}
            <div className="animate__animated animate__fadeIn">
                <div className="rounded-2xl p-[6px] bg-metallic-silver shadow-xl relative">
                    <div className="bg-white rounded-[13px] h-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-2px_10px_rgba(0,0,0,0.02)] p-8 md:p-10 flex flex-col relative overflow-y-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10"></div>
                        <h2 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] mb-12 flex items-center gap-3 relative z-10">
                            <span className="w-8 h-[2px] bg-[#4A4A4A]"></span>
                            Your Partnership Journey
                        </h2>

                    <div className="pb-12 pt-5">
                        <div className="flex flex-col md:flex-row items-start relative px-4 gap-8 md:gap-4 lg:gap-8 overflow-hidden md:overflow-visible">
                            {/* Horizontal Line for Desktop */}
                            <div className="hidden md:block absolute top-[28px] left-4 right-4 h-[2px] bg-gray-100 rounded-full"></div>
                            <div
                                className="hidden md:block absolute top-[28px] left-4 h-[3px] bg-gradient-to-r from-[#4A4A4A]/40 to-[#4A4A4A] rounded-full z-0 transition-all duration-1000"
                                style={{ width: `calc(${Math.min(((stages.filter(s => s.status === 'processed').length + 1) / stages.length) * 100, 100)}% - 2rem)` }}
                            ></div>

                            {/* Vertical Line for Mobile */}
                            <div className="block md:hidden absolute left-[44px] top-4 bottom-4 w-[2px] bg-gray-100 rounded-full"></div>
                            <div
                                className="block md:hidden absolute left-[44px] top-4 w-[3px] bg-gradient-to-b from-[#4A4A4A]/40 to-[#4A4A4A] rounded-full z-0 transition-all duration-1000"
                                style={{ height: `calc(${Math.min(((stages.filter(s => s.status === 'processed').length + 1) / stages.length) * 100, 100)}% - 2rem)` }}
                            ></div>

                            {stages.sort((a, b) => {
                                const statusOrder = { 'processed': 0, 'active': 1, 'upcoming': 2 };
                                const weightA = statusOrder[a.status] ?? 3;
                                const weightB = statusOrder[b.status] ?? 3;
                                if (weightA !== weightB) return weightA - weightB;
                                return a.sequence - b.sequence;
                            }).map((stage, idx) => (
                                <div key={stage._id} className="flex flex-row md:flex-col items-center flex-1 relative z-10 w-full md:w-auto">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-0 md:mb-4 mr-6 md:mr-0 transition-all duration-500 shadow-md border flex-shrink-0
                                        ${stage.status === 'active' ? 'bg-gradient-premium text-white animate-pulse ring-4 ring-[#4A4A4A]/20 scale-105 border-transparent' :
                                            stage.status === 'processed' ? 'bg-black text-white border-transparent' : 'bg-white text-gray-300 border-gray-100'}
                                    `}>
                                        {stage.status === 'processed' ? '✓' : (idx + 1)}
                                    </div>
                                    <div className="text-left md:text-center flex-1 md:w-full md:px-2 flex flex-col justify-center">
                                        <p className={`text-[11px] font-black uppercase tracking-tight leading-tight mb-1 md:mb-2 ${stage.status === 'active' ? 'text-gray-950' : 'text-gray-400'}`}>
                                            {stage.name}
                                        </p>
                                        <div className="flex flex-row md:flex-col gap-2 md:gap-1 items-center md:items-center justify-start md:justify-center">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest ${stage.status === 'active' ? 'bg-amber-100 text-amber-700' :
                                                stage.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {stage.status}
                                            </span>
                                            {stage.time && (
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    {new Date(stage.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
