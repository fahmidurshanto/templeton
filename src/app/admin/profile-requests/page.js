"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Swal from 'sweetalert2';

export default function ProfileRequestsPage() {
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
        setLoading(true);
        try {
            const response = await api.get('/profile-updates');
            if (response.data.success) {
                setRequests(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching profile requests:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to fetch profile update requests.',
                icon: 'error',
                confirmButtonColor: '#153A6A'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (e, id) => {
        e.stopPropagation();
        const result = await Swal.fire({
            title: 'Confirm Approval',
            text: "Are you sure you want to approve this profile update? The user's data will be updated permanently.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#153A6A',
            cancelButtonColor: '#888888',
            confirmButtonText: 'Yes, Approve',
            background: '#ffffff',
            customClass: {
                title: 'font-black uppercase tracking-widest text-sm',
                content: 'text-xs font-bold text-gray-600',
                confirmButton: 'rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[10px]',
                cancelButton: 'rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[10px]'
            }
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Processing...',
                didOpen: () => { Swal.showLoading(); }
            });

            try {
                const response = await api.post(`/profile-updates/approve/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        title: 'Approved!',
                        text: 'User profile has been updated successfully.',
                        icon: 'success',
                        confirmButtonColor: '#153A6A'
                    });
                    fetchRequests();
                }
            } catch (error) {
                console.error('Error approving request:', error);
                Swal.fire({
                    title: 'Failed',
                    text: error.response?.data?.message || 'Approval failed.',
                    icon: 'error',
                    confirmButtonColor: '#153A6A'
                });
            }
        }
    };

    const handleReject = async (e, id) => {
        e.stopPropagation();
        const result = await Swal.fire({
            title: 'Confirm Rejection',
            text: "Are you sure you want to reject this request? It will be permanently removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#888888',
            cancelButtonColor: '#444444',
            confirmButtonText: 'Yes, Reject',
            background: '#ffffff'
        });

        if (result.isConfirmed) {
            try {
                const response = await api.post(`/profile-updates/reject/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        title: 'Rejected',
                        text: 'Request has been removed.',
                        icon: 'info',
                        confirmButtonColor: '#153A6A'
                    });
                    fetchRequests();
                }
            } catch (error) {
                console.error('Error rejecting request:', error);
                Swal.fire({
                    title: 'Failed',
                    text: error.response?.data?.message || 'Rejection failed.',
                    icon: 'error',
                    confirmButtonColor: '#153A6A'
                });
            }
        }
    };

    if (loading && requests.length === 0) {
        return <div className="p-20 text-center font-bold text-gradient-premium">Loading Requests...</div>;
    }

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible p-4 md:p-8">
            <div className="w-full max-w-7xl animate__animated animate__fadeIn">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight text-gradient-premium bg-clip-text uppercase">
                        Profile Update Requests
                    </h1>
                    <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest opacity-70">
                        Strategic Review & Verification Center
                    </p>
                </div>

                {requests.length === 0 ? (
                    <div className="rounded-2xl p-[6px] bg-metallic-silver shadow-xl">
                        <div className="bg-white rounded-[13px] p-20 text-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.9)]">
                            <p className="text-gray-400 font-black uppercase tracking-widest">No pending profile update requests</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        {requests.map((request) => (
                            <div key={request._id} className="rounded-2xl p-[6px] bg-metallic-silver shadow-xl hover:scale-[1.01] transition-transform duration-500 group">
                                <div className="bg-white rounded-[13px] overflow-hidden shadow-[inset_0_2px_10px_rgba(255,255,255,0.9)]">
                                    <div 
                                        onClick={() => toggleExpand(request._id)}
                                        className="px-6 sm:px-8 py-5 bg-gray-50/30 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-gray-100/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`transition-transform duration-300 ${expandedIds.has(request._id) ? 'rotate-180' : ''}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#153A6A]">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                </svg>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-metallic-circle flex items-center justify-center metallic-text-dark font-black text-lg shadow-lg border-2 border-white flex-shrink-0">
                                                {request.userId?.firstName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-gray-950 uppercase tracking-tight">
                                                    {request.userId?.firstName} {request.userId?.lastName}
                                                </h3>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    ID: {request.userId?.userId} • {new Date(request.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) => handleApprove(e, request._id)}
                                                className="px-6 py-2 bg-metallic-pill text-white font-black text-[10px] uppercase tracking-widest rounded-full shadow-sm hover:brightness-110 active:scale-95 transition-all border border-[#888888]"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={(e) => handleReject(e, request._id)}
                                                className="px-6 py-2 bg-white text-gray-500 border border-gray-200 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-gray-50 active:scale-95 transition-all"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {expandedIds.has(request._id) && (
                                        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 bg-white animate__animated animate__fadeIn">
                                            {[
                                                { label: 'First Name', value: request.requestedData.firstName },
                                                { label: 'Last Name', value: request.requestedData.lastName },
                                                { label: 'Gender', value: request.requestedData.gender },
                                                { label: 'Contact', value: request.requestedData.phone },
                                                { label: 'Email', value: request.requestedData.email },
                                                { label: 'NRIC', value: request.requestedData.nric },
                                                { label: 'Nationality', value: request.requestedData.nationality },
                                                { label: 'Address', value: request.requestedData.address, full: true },
                                            ].map((field, idx) => (
                                                <div key={idx} className={field.full ? 'md:col-span-2 lg:col-span-4' : ''}>
                                                    <label className="block text-[9px] font-black text-[#153A6A] uppercase tracking-widest mb-1.5">{field.label}</label>
                                                    <p className="text-sm text-gray-950 font-bold border-b border-gray-50 pb-1">{field.value || 'N/A'}</p>
                                                </div>
                                            ))}
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
