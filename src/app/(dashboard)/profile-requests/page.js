"use client";
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import api from '@/lib/api';
import Swal from 'sweetalert2';

export default function UserProfileRequestsPage() {
    const { user } = useAppContext();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState(new Set());

    const toggleExpand = (id) => {
        const newExpandedIds = new Set(expandedIds);
        if (newExpandedIds.has(id)) {
            newExpandedIds.delete(id);
        } else {
            newExpandedIds.add(id);
        }
        setExpandedIds(newExpandedIds);
    };

    const fetchRequests = async () => {
        if (!user?.id && !user?._id) return;
        const userId = user._id || user.id;
        setLoading(true);
        try {
            const response = await api.get(`/profile-updates/user/${userId}`);
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching user profile requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    if (loading && requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#153A6A] rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Request History...</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible px-4">
            <div className="w-full max-w-5xl animate__animated animate__fadeIn">
                <div className="mb-12 text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 mb-3 tracking-tight leading-[1.1] uppercase">
                        Request <span className="text-gradient-premium">History</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 font-bold uppercase tracking-[0.3em] opacity-70">Track your profile update status</p>
                </div>

                {requests.length === 0 ? (
                    <div className="rounded-3xl p-[6px] bg-metallic-silver shadow-xl">
                        <div className="bg-white rounded-[22px] p-20 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.9)]">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-dashed border-gray-200">
                                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No profile update requests found</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {requests.map((request) => (
                            <div key={request._id} className="rounded-3xl p-[6px] bg-metallic-silver shadow-xl hover:scale-[1.01] transition-transform duration-500 group">
                                <div className="bg-white rounded-[22px] overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.9)]">
                                    <div 
                                        onClick={() => toggleExpand(request._id)}
                                        className="px-6 sm:px-8 py-6 bg-gray-50/30 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-gray-100/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`transition-transform duration-300 ${expandedIds.has(request._id) ? 'rotate-180' : ''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#153A6A]">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-gray-950 uppercase tracking-tight">
                                                    Profile Update Request
                                                </h3>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                    Submitted on {new Date(request.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                                request.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                request.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {expandedIds.has(request._id) && (
                                        <div className="p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-white animate__animated animate__fadeIn">
                                            {[
                                                { label: 'Requested First Name', value: request.requestedData.firstName },
                                                { label: 'Requested Last Name', value: request.requestedData.lastName },
                                                { label: 'Requested Gender', value: request.requestedData.gender },
                                                { label: 'Requested Contact', value: request.requestedData.phone },
                                                { label: 'Requested Email', value: request.requestedData.email },
                                                { label: 'Requested NRIC', value: request.requestedData.nric },
                                                { label: 'Requested Nationality', value: request.requestedData.nationality },
                                                { label: 'Requested Address', value: request.requestedData.address, full: true },
                                            ].map((field, idx) => (
                                                <div key={idx} className={field.full ? 'sm:col-span-2 lg:col-span-3' : ''}>
                                                    <label className="block text-[9px] font-black text-[#153A6A] uppercase tracking-widest mb-2 opacity-60">{field.label}</label>
                                                    <p className="text-sm text-gray-950 font-bold border-b border-gray-50 pb-2">{field.value || 'N/A'}</p>
                                                </div>
                                            ))}
                                            {request.adminNote && (
                                                <div className="sm:col-span-2 lg:col-span-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Admin Remark</label>
                                                    <p className="text-xs text-gray-700 font-bold italic">"{request.adminNote}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
