"use client";
import React, { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import { useAppContext } from '@/context/AppContext';

export default function TrackingPage() {
    const { user } = useAppContext();
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stageVisibility, setStageVisibility] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        if (user?.id) {
            fetchUserStages();
        }
    }, [user]);

    const fetchUserStages = async () => {
        try {
            const res = await api.get(`/stage/user/${user.id}`);
            if (res.data.success) {
                const userStages = res.data.data || [];
                setStages(userStages.sort((a, b) => a.sequence - b.sequence));
            }
            const meRes = await api.get('/auth/me');
            if (meRes.data.success) {
                setStageVisibility(meRes.data.user.stageVisibility || false);
            }
        } catch (err) {
            console.error('Failed to fetch stages:', err);
        } finally {
            setLoading(false);
        }
    };

    const slidesPerView = 5;
    const maxIndex = Math.max(0, stages.length - slidesPerView);

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const goToSlide = (index) => {
        setCurrentIndex(Math.min(index, maxIndex));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!stageVisibility) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[40px] p-12 shadow-2xl border border-gray-50 text-center">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">Stage Tracking Restricted</h2>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                        Your stage and progress tracking is currently restricted. Please scan the QR code provided by your administrator to enable full access to your journey timeline.
                    </p>
                    <div className="mt-8 p-6 bg-gray-50 rounded-2xl inline-block">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                        <span className="px-4 py-2 bg-red-100 text-red-600 text-xs font-black uppercase rounded-full tracking-wider">
                            Visibility Disabled
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (stages.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-[40px] p-12 shadow-2xl border border-gray-50 text-center">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-4">No Stages Assigned</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Your journey stages will appear here once they have been assigned by the administrator.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 animate__animated animate__fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">
                        Your Journey
                    </h1>
                    <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest mt-2">
                        Track Your Progress & Milestones
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-green-50 px-5 py-3 rounded-full border border-green-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse ring-4 ring-green-100"></span>
                    <span className="text-xs font-black text-green-700 uppercase tracking-wider">Live Tracking</span>
                </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-bl-full -z-0 opacity-50"></div>
                
                <h2 className="text-xs font-black text-gray-950 uppercase tracking-[0.3em] mb-8 relative z-10 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-[#D4AF37]"></span>
                    Progress Timeline
                </h2>

                <div className="relative z-10">
                    <div className="relative">
                        <div className="overflow-hidden" ref={carouselRef}>
                            <div 
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentIndex * (100 / 5)}%)` }}
                            >
                                {stages.map((stage, idx) => {
                                    const isActive = stage.status === 'active';
                                    const isProcessed = stage.status === 'processed';
                                    
                                    return (
                                        <div 
                                            key={stage._id} 
                                            className="w-1/5 flex-shrink-0 px-2"
                                        >
                                            <div className={`rounded-2xl border p-4 transition-all duration-300 h-full ${
                                                isActive ? 'bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg shadow-green-900/10' : 
                                                isProcessed ? 'bg-gray-50 border-gray-100' :
                                                'bg-white border-gray-100'
                                            }`}>
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-all duration-500 shadow-md
                                                        ${isActive ? 'bg-gradient-gold text-black animate-pulse ring-4 ring-[#D4AF37]/20' : 
                                                          isProcessed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}
                                                    `}>
                                                        {isProcessed ? '✓' : isActive ? '●' : (idx + 1)}
                                                    </div>
                                                    <p className={`text-xs font-black uppercase tracking-tight mb-2 leading-tight ${isActive ? 'text-gray-950' : 'text-gray-700'}`}>
                                                        {stage.name}
                                                    </p>
                                                    <span className={`inline-block text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-widest mb-3
                                                        ${isActive ? 'bg-green-600 text-white' : 
                                                          isProcessed ? 'bg-green-100 text-green-600' :
                                                          'bg-gray-100 text-gray-400'}
                                                    `}>
                                                        {stage.status}
                                                    </span>
                                                    {stage.time && (
                                                        <p className={`text-[9px] font-bold ${isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                                                            {new Date(stage.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {stages.length > 1 && (
                            <>
                                <button 
                                    onClick={prevSlide}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-20"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button 
                                    onClick={nextSlide}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-20"
                                >
                                    <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>

                    {stages.length > slidesPerView && (
                        <div className="flex justify-center items-center gap-3 mt-8">
                            <button 
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex gap-2">
                                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => goToSlide(idx)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            idx === currentIndex 
                                                ? 'bg-[#D4AF37] w-8' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                            <button 
                                onClick={nextSlide}
                                disabled={currentIndex >= maxIndex}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Processed</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Upcoming</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gradient-gold text-black px-4 py-2 rounded-full">
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {Math.min(currentIndex * slidesPerView + 1, stages.length)}-{Math.min((currentIndex + 1) * slidesPerView, stages.length)} / {stages.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
