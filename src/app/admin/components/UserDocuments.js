"use client";

import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Swal from 'sweetalert2';
import api from '@/lib/api';

export default function UserDocuments({ targetUserId, userName }) {
    const { user, addDocument, deleteDocument, viewDocument } = useAppContext();
    const [docs, setDocs] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const fileInputRef = useRef(null);

    const fetchDocs = React.useCallback(async () => {
        if (!targetUserId) return;
        setIsLoading(true);
        try {
            const response = await api.get(`/document/user/${targetUserId}`);
            if (response.data.success) {
                const mapped = response.data.documents.map(doc => ({
                    id: doc._id,
                    userId: doc.user,
                    name: doc.name,
                    date: new Date(doc.createdAt).toISOString().split('T')[0],
                    size: doc.size || 'N/A',
                    category: 'Documents',
                    hasUserSeen: doc.hasUserSeen || false
                }));
                setDocs(mapped);
            }
        } catch (error) {
            console.error('Fetch docs error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [targetUserId]);

    useEffect(() => {
        fetchDocs();
    }, [fetchDocs]);

    // Removed mock filtering logic, using direct API results
    const userSpecificDocs = docs;

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const response = await addDocument(file, targetUserId);
                if (response && response.success) {
                    await fetchDocs(); // Refresh list
                    Swal.fire({
                        icon: 'success',
                        title: 'Document Uploaded',
                        text: `${file.name} has been added for ${userName}.`,
                        confirmButtonColor: '#4A4A4A'
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Upload Failed',
                    text: error.message,
                    confirmButtonColor: '#D33'
                });
            }
        }
    };

    const handleView = async (doc) => {
        try {
            await viewDocument(doc.id);
        } catch (error) {
            Swal.fire({
                title: 'View Failed',
                text: error.message,
                icon: 'error',
                confirmButtonColor: '#4A4A4A'
            });
        }
    };

    const handleDelete = async (docId) => {
        Swal.fire({
            title: 'Delete Document?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#D33',
            cancelButtonColor: '#4A4A4A',
            confirmButtonText: 'Yes, delete it',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDocument(docId);
                    await fetchDocs();
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted',
                        text: 'Document has been removed.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Delete Failed',
                        text: error.message,
                        confirmButtonColor: '#D33'
                    });
                }
            }
        });
    };

    const categories = [...new Set(userSpecificDocs.map(d => d.category))];

    return (
        <div className="rounded-2xl p-[6px] bg-metallic-silver shadow-xl hover:scale-[1.02] transition-transform duration-500 group animate__animated animate__fadeIn">
            <div className="bg-white rounded-[13px] shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),inset_0_-2px_10px_rgba(0,0,0,0.02)] overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white/80 to-transparent pointer-events-none z-10"></div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                <div className="px-6 sm:px-8 pt-5 sm:pt-6 pb-2 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#4A4A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <h3 className="text-[10px] sm:text-[11px] font-black text-gray-900 uppercase tracking-widest">Vault & Documents</h3>
                    </div>
                    <button
                        onClick={handleUploadClick}
                        className="px-4 py-2 bg-metallic-pill text-white border border-[#888888] rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-sm flex items-center gap-2"
                    >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Upload
                    </button>
                </div>

                <div className="w-full h-[2px] bg-metallic-divider shadow-sm relative z-10 mb-4">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/60"></div>
                </div>

                <div className="p-8 relative z-10">
                    {isLoading ? (
                        <div className="py-12 flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-4 border-[#4A4A4A] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Scanning Vault...</p>
                        </div>
                    ) : userSpecificDocs.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                            <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125V3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v3.125c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No documents found for this user</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {categories.map(category => (
                                <div key={category} className="space-y-4">
                                    <h4 className="text-[10px] font-black text-[#4A4A4A] uppercase tracking-[0.2em] border-b border-gray-50 pb-2">{category}</h4>
                                    <div className="grid grid-cols-1 gap-3">
                                        {userSpecificDocs.filter(d => d.category === category).map(doc => (
                                            <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#4A4A4A] shadow-sm group-hover:bg-gradient-premium group-hover:text-black transition-all">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase">{doc.date} • {doc.size}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleView(doc)}
                                                        className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all bg-white text-black border-gray-100 hover:border-[#4A4A4A]"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
