"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import NotFound from '@/components/ui/NotFound';
import { useAppContext } from '@/context/AppContext';

// No longer using hardcoded initialServices



// Add Service Modal
function AddServiceModal({ onClose, onConfirm }) {
    const [serviceName, setServiceName] = useState('');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-7 flex flex-col gap-6 animate-fadeInScale"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-blue flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#2E5F9E]">Management</p>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Add New Service</h3>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Service Name</label>
                    <input
                        autoFocus
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        placeholder="e.g. Annual Audit Report"
                        className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-[#2E5F9E] focus:bg-white transition-all duration-200 outline-none font-bold text-gray-700 placeholder:text-gray-300 shadow-inner"
                    />
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] border-2 border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!serviceName.trim()}
                        onClick={() => onConfirm(serviceName)}
                        className="flex-1 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] bg-gradient-blue text-black shadow-lg shadow-blue-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                    >
                        Create Service
                    </button>
                </div>
            </div>
        </div>
    );
}

// Delete Confirmation Modal
function DeleteConfirmModal({ service, onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
                className="relative bg-white rounded-2xl shadow-2xl border border-red-50 w-full max-w-sm p-7 flex flex-col gap-6 animate-fadeInScale"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400">Warning</p>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Delete Service</h3>
                    </div>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    Are you sure you want to remove <span className="text-gray-900 font-bold underline decoration-red-200 decoration-2 underline-offset-4">"{service.name}"</span>? This action cannot be undone.
                </p>

                <div className="flex gap-4 pt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] border-2 border-gray-100 text-gray-400 hover:bg-gray-50 transition-all duration-200"
                    >
                        Keep It
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] bg-red-500 text-white shadow-lg shadow-red-200/50 hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ServicesPage() {
    const params = useParams();
    const userId = params.id;
    const { user } = useAppContext();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null); // service to delete
    const [isAdding, setIsAdding] = useState(false); // add modal visibility

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get(`/user/user-services/${userId}`);
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

        if (userId && user && (user.role === 'admin' || user.role === 'superadmin')) {
            fetchServices();
        } else if (!user) {
            // Wait for user to load
        } else {
            setLoading(false);
        }
    }, [userId, user]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-[#2E5F9E] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isNotFound) {
        return <NotFound title="User Not Found" message="The user whose services you are trying to manage is not registered in the system." />;
    }

    const handleAddService = async (serviceName) => {
        try {
            const response = await api.post(`/user/user-services/${userId}`, {
                serviceName
            });

            if (response.data.success) {
                setServices(response.data.data);
            }
        } catch (error) {
            console.error('[Add Service Error]', error);
            alert(error.response?.data?.message || 'Failed to add service');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteService = async () => {
        try {
            const response = await api.delete(`/user/user-services/${userId}/${deleteTarget.name}`);

            if (response.data.success) {
                setServices(response.data.data);
            }
        } catch (error) {
            console.error('[Delete Service Error]', error);
            alert(error.response?.data?.message || 'Failed to delete service');
        } finally {
            setDeleteTarget(null);
        }
    };

    const handleToggleStatus = async (serviceName) => {
        try {
            const response = await api.patch(`/user/user-services/${userId}`, {
                serviceName
            });

            if (response.data.success) {
                setServices(response.data.data);
            }
        } catch (error) {
            console.error('[Toggle Status Error]', error);
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible">
            {/* Global Watermark - Professional Templeton Blue */}
            {/* <div className="absolute left-0 top-[240px] -translate-x-[35%] -translate-y-1/2 w-[1400px] h-[1400px] opacity-[0.25] pointer-events-none z-0 flex items-center justify-center">
                <img
                    src="/lion.png"
                    alt=""
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]"
                />
            </div> */}

            {/* Header Section */}
            <div className="w-full text-center py-8 md:py-14 mb-6 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[25vh]">
                <div className="relative z-10 w-full">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-wide text-gradient-blue bg-clip-text uppercase">
                        Our Services
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg font-medium">
                        View the current status of your subscribed and available services.
                    </p>
                </div>
            </div>

            {/* Services List Section */}
            <div className="w-full max-w-4xl animate__animated animate__fadeInUp">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#2E5F9E]/30 overflow-hidden">
                    <div className="bg-gradient-blue px-8 py-5 flex items-center justify-between border-b border-[#1E3F66]/30">
                        <div className="flex flex-col gap-0.5">
                            <h2 className="text-black font-black text-sm tracking-widest uppercase">Available Services</h2>
                            <div className="flex items-center gap-2">
                                <span className="bg-black/10 text-black px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight">
                                    Total: {services.length}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-black text-[#2E5F9E] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black/80 transition-all duration-200 flex items-center gap-2 shadow-xl shadow-black/10 active:scale-95"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add Service
                        </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {services.map((service, idx) => (
                            <div key={idx} className="group p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-blue flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-[#1A3C61] transition-colors">
                                        {service.name}
                                    </h3>
                                </div>

                                {/* Status badge + edit icon */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(service.name)}
                                        title={`Change status to ${service.status === 'Valid' ? 'Invalid' : 'Valid'}`}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm transition-all active:scale-95 hover:scale-[1.02] cursor-pointer group/toggle
                                        ${service.status === 'Valid'
                                                ? 'bg-green-50 text-green-600 border-green-100 shadow-green-900/5 hover:bg-green-100'
                                                : 'bg-red-50 text-red-600 border-red-100 shadow-red-900/5 hover:bg-red-100'}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Valid' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                        {service.status}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3 opacity-40 group-hover/toggle:opacity-100 transition-all group-hover/toggle:rotate-180">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                        </svg>
                                    </button>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setDeleteTarget(service)}
                                            title="Delete service"
                                            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200 group/btn shadow-sm hover:shadow-red-900/10 active:scale-95 bg-white"
                                        >
                                            <svg className="w-5 h-5 transition-transform group-hover/btn:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 px-8 py-4 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Templeton Trust Fund Limited • Precision & Trust</p>
                    </div>
                </div>
            </div>

            {/* Add Service Modal */}
            {isAdding && (
                <AddServiceModal
                    onClose={() => setIsAdding(false)}
                    onConfirm={handleAddService}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <DeleteConfirmModal
                    service={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDeleteService}
                />
            )}
        </div>
    );
}
