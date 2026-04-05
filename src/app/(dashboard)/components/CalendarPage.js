"use client";
import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import { useAppContext } from '@/context/AppContext';
import api from '@/lib/api';

export default function CalendarPage({ isAdmin = false }) {
    const { userList } = useAppContext();
    const [events, setEvents] = useState([]);
    const [upcomingSchedules, setUpcomingSchedules] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'Meeting', userId: '', userName: '', description: '' });
    const [userSearch, setUserSearch] = useState('');
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const userDropdownRef = useRef(null);

    // Close user dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchSchedules = async () => {
        try {
            const endpoint = isAdmin ? '/schedule/admin/all' : '/schedule/my';
            const res = await api.get(endpoint);
            if (res.data.success) {
                const fetchedSchedules = res.data.data;
                
                // Format for FullCalendar
                const formattedEvents = fetchedSchedules.map(sch => {
                    const color = sch.type === 'Meeting' ? '#10b981' : '#3b82f6';
                    const borderColor = sch.type === 'Meeting' ? '#10b981' : '#3b82f6';
                    return {
                        id: sch._id,
                        title: sch.title,
                        start: new Date(sch.time).toISOString(),
                        backgroundColor: color,
                        borderColor: borderColor
                    };
                });
                setEvents(formattedEvents);

                // Format for Upcoming list
                const now = new Date();
                const upcoming = fetchedSchedules
                    .filter(sch => new Date(sch.time) >= now)
                    .sort((a, b) => new Date(a.time) - new Date(b.time))
                    .slice(0, 5) // top 5
                    .map(sch => ({
                        id: sch._id,
                        title: sch.title,
                        date: new Date(sch.time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                        time: new Date(sch.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                        type: sch.type
                    }));
                setUpcomingSchedules(upcoming);
            }
        } catch (error) {
            console.error("Failed to fetch schedules", error);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, [isAdmin]);

    const filteredUsers = (userList || []).filter(u => {
        const name = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim();
        const email = u.email || '';
        const query = userSearch.toLowerCase();
        return name.toLowerCase().includes(query) || email.toLowerCase().includes(query);
    });

    const handleDateSelect = (selectInfo) => {
        if (!isAdmin) return;
        setNewEvent({ ...newEvent, date: selectInfo.startStr });
        setIsModalOpen(true);
    };

    const handleAddEvent = async (e) => {
        e.preventDefault();

        if (!newEvent.userId) {
            Swal.fire({ title: 'User Required', text: 'Please select a user to assign this schedule to.', icon: 'warning', confirmButtonColor: '#2E5F9E' });
            return;
        }

        const start = `${newEvent.date}T${newEvent.time || '00:00:00'}`;
        const color = newEvent.type === 'Meeting' ? '#10b981' : '#3b82f6';
        const borderColor = newEvent.type === 'Meeting' ? '#10b981' : '#3b82f6';

        try {
            // Persist to backend
            const res = await api.post('/schedule/create', {
                title: newEvent.title,
                time: new Date(start).toISOString(),
                type: newEvent.type,
                description: newEvent.description || '',
                userId: newEvent.userId
            });

            if (res.data.success) {
                // Re-fetch all schedules to guarantee sync
                await fetchSchedules();

                setIsModalOpen(false);
                setNewEvent({ title: '', date: '', time: '', type: 'Meeting', userId: '', userName: '', description: '' });
                setUserSearch('');

                Swal.fire({
                    title: 'Schedule Confirmed!',
                    text: `Schedule has been saved for ${newEvent.userName}.`,
                    icon: 'success',
                    background: '#ffffff',
                    confirmButtonColor: '#2E5F9E',
                    customClass: {
                        title: 'text-black font-black uppercase tracking-widest text-lg',
                        content: 'text-gray-600 font-bold',
                        confirmButton: 'px-8 py-3 rounded-full font-black uppercase tracking-widest'
                    }
                });
            }
        } catch (error) {
            console.error('Schedule save error:', error);
            Swal.fire({ title: 'Error', text: 'Failed to save schedule. Please try again.', icon: 'error', confirmButtonColor: '#2E5F9E' });
        }
    };

    const handleEventClick = (clickInfo) => {
        if (!isAdmin) return;
        
        Swal.fire({
            title: 'Cancel Schedule?',
            text: `Are you sure you want to remove '${clickInfo.event.title}' from the agenda?`,
            icon: 'warning',
            showCancelButton: true,
            background: '#ffffff',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#2E5F9E',
            confirmButtonText: 'Yes, Remove It',
            cancelButtonText: 'No, Keep It',
            reverseButtons: true,
            customClass: {
                title: 'text-black font-black uppercase tracking-widest text-lg',
                content: 'text-gray-600 font-bold',
                confirmButton: 'px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]',
                cancelButton: 'px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/schedule/${clickInfo.event.id}`);
                    setEvents(events.filter(ev => ev.id !== clickInfo.event.id));
                    setUpcomingSchedules(upcomingSchedules.filter(s => s.id !== clickInfo.event.id));

                    Swal.fire({
                        title: 'Removed!',
                        text: 'The schedule has been successfully removed.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#ffffff',
                        customClass: {
                            title: 'text-black font-black uppercase tracking-widest text-sm',
                        }
                    });
                } catch (error) {
                    console.error("Failed to delete schedule", error);
                    Swal.fire('Error', 'Failed to delete schedule.', 'error');
                }
            }
        });
    };

    return (
        <>
            <div className="w-full h-full space-y-4 md:space-y-8 animate__animated animate__fadeIn relative overflow-visible">
                {/* Header Section */}
                <div className="w-full text-center py-6 md:py-10 relative flex flex-col items-center justify-center px-4">
                    <div className="relative z-10 w-full">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-3 tracking-tight text-gradient-blue bg-clip-text uppercase leading-none text-center">
                            Calendar
                        </h1>
                        <p className="text-[10px] sm:text-xs md:text-base text-gray-400 font-bold uppercase tracking-[0.3em] opacity-70 text-center">
                            Strategic Appointment Management • Precision Scheduling
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                    {/* Left: Calendar Component */}
                    <div className="lg:col-span-8 bg-white rounded-2xl shadow-2xl border-2 border-[#2E5F9E]/30 overflow-hidden">
                        <div className="bg-gradient-blue px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#1E3F66]/30 gap-2">
                            <h2 className="text-black font-black text-xs sm:text-sm tracking-widest uppercase">Monthly Schedule</h2>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 rounded-full bg-[#10b981] aspect-square"></span>
                                    <span className="text-[9px] sm:text-[10px] text-black font-bold uppercase">Meetings</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 rounded-full bg-[#3b82f6] aspect-square"></span>
                                    <span className="text-[9px] sm:text-[10px] text-black font-bold uppercase">Tasks</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 sm:p-6 calendar-container overflow-x-auto">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView={typeof window !== 'undefined' && window.innerWidth < 768 ? 'dayGridDay' : 'dayGridMonth'}
                                headerToolbar={{
                                    left: 'prev,next',
                                    center: 'title',
                                    right: typeof window !== 'undefined' && window.innerWidth < 768 ? 'today' : 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                events={events}
                                height={typeof window !== 'undefined' && window.innerWidth < 768 ? '450px' : '550px'}
                                eventTextColor="#000000"
                                dayMaxEvents={true}
                                selectable={isAdmin}
                                selectMirror={true}
                                select={handleDateSelect}
                                eventClick={handleEventClick}
                                editable={isAdmin}
                            />
                        </div>
                    </div>

                    {/* Right Panel: Upcoming Sched & Summaries */}
                    <div className="lg:col-span-4 space-y-6 flex flex-col">
                        {/* Upcoming Schedules Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest">Upcoming Schedules</h3>
                            </div>
                            <div className="p-4 space-y-3 overflow-y-auto max-h-[300px] md:max-h-[500px] custom-scrollbar">
                                {upcomingSchedules.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        No upcoming schedules
                                    </div>
                                ) : (
                                    upcomingSchedules.map(item => (
                                        <div key={item.id} className="p-3 border border-gray-50 rounded-xl hover:border-[#2E5F9E]/30 hover:bg-gray-50/50 transition-all group">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-tighter">{item.type}</span>
                                                <span className="text-[10px] text-[#2E5F9E] font-black">{item.time}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-black group-hover:text-[#2E5F9E] transition-colors line-clamp-1">{item.title}</h4>
                                            <p className="text-[10px] text-gray-800 font-medium mt-0.5">{item.date}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <button className="w-full text-center text-xs font-bold text-gray-500 hover:text-black transition-colors">View All Schedules</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Management Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate__animated animate__fadeIn">
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-2 border-[#2E5F9E]/50 w-full max-w-md overflow-hidden animate__animated animate__zoomIn">
                        <div className="bg-gradient-blue py-4 px-6 flex items-center justify-between border-b border-[#1E3F66]/30">
                            <h3 className="text-black font-black uppercase tracking-widest text-[10px] sm:text-xs text-center">Strategic Schedule Entry</h3>
                            <button onClick={() => setIsModalOpen(false)} className="bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-black group-hover:rotate-90 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddEvent} className="p-6 sm:p-8 space-y-5 md:space-y-6">
                            <div className="space-y-1.5 md:space-y-2">
                                <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#1A3C61] mb-2">Event Title</label>
                                <input 
                                    required
                                    type="text" 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black"
                                    placeholder="e.g. Executive Meeting"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                />
                            </div>

                            <div ref={userDropdownRef} className="relative space-y-1.5 md:space-y-2">
                                <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#1A3C61] mb-2">Assign to User</label>
                                <div
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-black cursor-pointer flex items-center justify-between hover:border-[#2E5F9E]/50 transition-all shadow-sm"
                                    onClick={() => setShowUserDropdown(v => !v)}
                                >
                                    <span className={newEvent.userName ? 'text-black' : 'text-gray-400 opacity-60'}>
                                        {newEvent.userName || 'Select strategic partner...'}
                                    </span>
                                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {showUserDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-[#2E5F9E]/30 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        <div className="p-2 border-b border-gray-100">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search users..."
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[10px] font-bold text-black outline-none focus:border-[#2E5F9E] transition-all"
                                                value={userSearch}
                                                onChange={e => setUserSearch(e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        </div>
                                        <div className="max-h-44 overflow-y-auto custom-scrollbar">
                                            {filteredUsers.length === 0 ? (
                                                <div className="px-4 py-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">No partners found</div>
                                            ) : (
                                                filteredUsers.map(u => {
                                                    const name = u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim();
                                                    const uid = u._id || u.id;
                                                    return (
                                                        <div
                                                            key={uid}
                                                            className="px-4 py-3 flex items-center gap-3 hover:bg-[#2E5F9E]/10 cursor-pointer transition-colors"
                                                            onClick={() => {
                                                                setNewEvent({ ...newEvent, userId: uid, userName: name });
                                                                setUserSearch('');
                                                                setShowUserDropdown(false);
                                                            }}
                                                        >
                                                            <div className="w-7 h-7 rounded-full bg-gradient-blue flex items-center justify-center text-black font-black text-[9px] flex-shrink-0">
                                                                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black text-gray-900">{name}</p>
                                                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight opacity-70">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#1A3C61] mb-2">Time</label>
                                    <input 
                                        type="time" 
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5 md:space-y-2">
                                    <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#1A3C61] mb-2">Type</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black appearance-none"
                                            value={newEvent.type}
                                            onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                                        >
                                            <option value="Meeting">Meeting</option>
                                            <option value="Task">Task</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-[#1A3C61] mb-2">Description</label>
                                <textarea
                                    rows={2}
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black resize-none"
                                    placeholder="Brief description..."
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-4 sm:py-4.5 bg-gradient-blue text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 active:scale-[0.98] transition-all text-xs sm:text-sm"
                            >
                                Confirm Schedule
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Global Style overrides */}
            <style jsx global>{`
                .calendar-container .fc {
                    --fc-border-color: #f1f1f1;
                    --fc-daygrid-event-dot-width: 8px;
                    --fc-today-bg-color: #fffbeb;
                    font-family: inherit;
                }
                .calendar-container .fc-toolbar-title {
                    font-size: 0.9rem !important;
                    font-weight: 800 !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #1A3C61;
                }
                @media (min-width: 640px) {
                    .calendar-container .fc-toolbar-title {
                        font-size: 1.1rem !important;
                    }
                }
                .calendar-container .fc-button-primary {
                    background-color: #ffffff !important;
                    border-color: #2E5F9E !important;
                    color: #1A3C61 !important;
                    text-transform: uppercase !important;
                    font-size: 0.7rem !important;
                    font-weight: 700 !important;
                    padding: 8px 12px !important;
                    transition: all 0.2s;
                }
                .calendar-container .fc-button-primary:hover {
                    background-color: #2E5F9E !important;
                    color: #fff !important;
                }
                .calendar-container .fc-button-active {
                    background-color: #1A3C61 !important;
                    border-color: #1A3C61 !important;
                    color: #fff !important;
                }
                .calendar-container .fc-col-header-cell {
                    background-color: #fffbeb;
                    padding: 10px 0 !important;
                    text-transform: uppercase;
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    color: #1A3C61;
                    border-color: #B8C6DB !important;
                }
                .calendar-container .fc-daygrid-day-number {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #1E3F66;
                    padding: 10px !important;
                }
                .calendar-container .fc-event {
                    border-radius: 4px;
                    padding: 2px 4px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    color: #000000 !important;
                }
                .calendar-container .fc-event-main,
                .calendar-container .fc-event-title,
                .calendar-container .fc-event-time {
                    color: #000000 !important;
                }
                .calendar-container .fc-daygrid-day.fc-day-today {
                    background-color: #fff9e6 !important;
                }
                .calendar-container .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
                    color: #000;
                    font-weight: 800;
                }
            `}</style>
        </>
    );
}
