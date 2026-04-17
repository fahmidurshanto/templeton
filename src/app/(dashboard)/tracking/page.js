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
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4 scale-75 md:scale-100"></div>
            </div>
        );
    }

    if (!stageVisibility) {
        return (
            <div className="animate__animated animate__fadeIn">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-50 text-center">
                    <h2 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] mb-4">Verification Status</h2>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">you donot have permission to access stages</p>
                </div>
            </div>
        );
    }

    if (stages.length === 0) {
        return (
            <div className="animate__animated animate__fadeIn">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-50 text-center">
                    <h2 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] mb-4">Journey Status</h2>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">No stage added</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Journey Progress Section - EXACT MATCH FROM DASHBOARD */}
            <div className="animate__animated animate__fadeIn">
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-50 relative overflow-y-hidden">
                    <h2 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-[#D4AF37]"></span>
                        Your Partnership Journey
                    </h2>

                    <div className="overflow-x-auto pb-12 pt-5">
                        <div className="min-w-[1000px] flex items-start relative px-4 gap-8">
                            {/* Line */}
                            <div className="absolute top-[35px] left-0 w-full h-[2px] bg-gray-100 rounded-full"></div>
                            <div
                                className="absolute top-[35px] left-0 h-[3px] bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37] rounded-full z-0 transition-all duration-1000"
                                style={{ width: `${Math.min(((stages.filter(s => s.status === 'processed').length + 1) / stages.length) * 100, 100)}%` }}
                            ></div>

                            {stages.sort((a, b) => {
                                const statusOrder = { 'processed': 0, 'active': 1, 'upcoming': 2 };
                                const weightA = statusOrder[a.status] ?? 3;
                                const weightB = statusOrder[b.status] ?? 3;
                                if (weightA !== weightB) return weightA - weightB;
                                return a.sequence - b.sequence;
                            }).map((stage, idx) => (
                                <div key={stage._id} className="flex flex-col items-center flex-1 relative z-10 max-w-[250px]">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-4 transition-all duration-500 shadow-md border flex-shrink-0
                                        ${stage.status === 'active' ? 'bg-gradient-gold text-black animate-pulse ring-4 ring-[#D4AF37]/20 scale-105 border-transparent' :
                                            stage.status === 'processed' ? 'bg-black text-white border-transparent' : 'bg-white text-gray-300 border-gray-100'}
                                    `}>
                                        {stage.status === 'processed' ? '✓' : (idx + 1)}
                                    </div>
                                    <div className="text-center w-full px-2">
                                        <p className={`text-[11px] font-black uppercase tracking-tight leading-tight mb-1 ${stage.status === 'active' ? 'text-gray-950' : 'text-gray-400'}`}>
                                            {stage.name}
                                        </p>
                                        <div className="flex flex-col gap-1 items-center">
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

                                        {/* {stage.description && (
                                            <p className="mt-4 text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-3">
                                                {stage.description}
                                            </p>
                                        )}

                                        {(stage.remark || stage.remarkLabel) && (
                                            <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-left w-full transition-all hover:shadow-sm">
                                                <p className="text-[9px] font-black text-[#D4AF37] uppercase mb-1">{stage.remarkLabel || 'Update'}:</p>
                                                <p className="text-[10px] font-bold text-gray-600 leading-relaxed italic">"{stage.remark || 'No remarks provided'}"</p>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
