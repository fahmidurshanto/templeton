"use client";
import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAppContext } from '@/context/AppContext';

export default function ActivitiesPage() {
    const { user } = useAppContext();
    const [activeTab, setActiveTab] = useState('present');
    const [activitiesData, setActivitiesData] = useState({ present: [], future: [], past: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) return;

        const fetchSchedules = async () => {
            try {
                const res = await api.get('/schedule/admin/all');
                if (res.data.success) {
                    const schedules = res.data.data;
                    const now = new Date();
                    
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);

                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);

                    const categorized = { present: [], future: [], past: [] };

                    schedules.forEach(schedule => {
                        const scheduleDate = new Date(schedule.time);
                        const assignedTo = schedule.user 
                            ? (schedule.user.name || `${schedule.user.firstName || ''} ${schedule.user.lastName || ''}`.trim() || schedule.user.email)
                            : 'Unknown User';

                        const formattedSchedule = {
                            id: schedule._id,
                            title: schedule.title,
                            date: scheduleDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                            time: scheduleDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                            status: schedule.type, // Using type as status badge (Meeting/Task)
                            description: schedule.description || '',
                            assignedTo
                        };

                        if (scheduleDate < startOfWeek) {
                            categorized.past.push(formattedSchedule);
                        } else if (scheduleDate > endOfWeek) {
                            categorized.future.push(formattedSchedule);
                        } else {
                            categorized.present.push(formattedSchedule);
                        }
                    });

                    // Sort: past (newest first), present/future (oldest first)
                    categorized.past.sort((a, b) => new Date(b.date) - new Date(a.date));
                    categorized.present.sort((a, b) => new Date(a.date) - new Date(b.date));
                    categorized.future.sort((a, b) => new Date(a.date) - new Date(b.date));

                    setActivitiesData(categorized);
                }
            } catch (error) {
                console.error("Failed to fetch all schedules", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedules();
    }, [user]);


    const tabs = [
        { id: 'present', label: 'Present Week' },
        { id: 'future', label: 'Future Week' },
        { id: 'past', label: 'Past Week' }
    ];

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible">
            {/* Header Section */}
            <div className="w-full text-center py-6 md:py-14 mb-2 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[15vh] px-4">
                <div className="relative z-10 w-full">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 tracking-wide text-gradient-blue bg-clip-text uppercase">
                        Activities Panel
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-lg font-medium">
                        Monitor historical, current, and upcoming corporate engagements.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-4xl mb-8 sm:mb-12 flex justify-center animate__animated animate__fadeIn px-4">
                <div className="bg-white p-1.5 sm:p-2 rounded-2xl border-2 border-gray-50 flex gap-1 sm:gap-2 shadow-2xl overflow-x-auto no-scrollbar relative w-full sm:w-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 sm:flex-none px-4 sm:px-10 py-3 sm:py-4 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-500 relative z-10 whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-gradient-blue text-black shadow-lg scale-[1.02] sm:scale-[1.05]'
                                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Activities List Section */}
            <div className="w-full max-w-4xl animate__animated animate__fadeInUp pb-24">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2E5F9E] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {activitiesData[activeTab].map((activity) => (
                            <div key={activity.id} className="group bg-white shadow-2xl border border-gray-50 overflow-hidden hover:border-[#2E5F9E]/40 transition-all duration-500 hover:scale-[1.01] flex flex-col sm:flex-row rounded-[2rem]">
                                {/* Metallic Edge Accent */}
                                <div className="sm:w-3 bg-gradient-to-b from-[#fcfcfc] via-[#cecece] to-[#8a8a8a] shadow-inner"></div>

                                <div className="flex-1 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
                                    <div className="flex-1 w-full sm:w-auto">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="px-3 sm:px-4 py-1 sm:py-1.5 bg-green-50 text-green-600 text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100 flex items-center gap-2 shadow-sm">
                                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                {activity.status}
                                            </div>
                                            <div className="text-[9px] sm:text-[10px] text-[#1A3C61] font-black uppercase tracking-[0.2em]">{activity.time}</div>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight group-hover:text-[#1A3C61] transition-colors mb-2 uppercase">
                                            {activity.title}
                                        </h3>
                                        <p className="text-gray-500 text-xs sm:text-sm font-bold italic leading-relaxed">
                                            "{activity.description}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 w-full sm:w-auto">
                                        <div className="text-left sm:text-right bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-50 w-full sm:min-w-[140px]">
                                            <div className="text-[8px] sm:text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Assigned To</div>
                                            <div className="text-gray-950 font-black text-xs sm:text-sm tracking-tight truncate max-w-[200px] sm:max-w-[120px]" title={activity.assignedTo}>{activity.assignedTo}</div>
                                            <div className="mt-2 text-[#2E5F9E] font-black text-[10px] sm:text-xs tracking-tight">{activity.date}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {activitiesData[activeTab].length === 0 && (
                            <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-gray-100 uppercase">
                                <p className="text-gray-400 font-black tracking-[0.3em] text-xs">No schedules found for this period</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
