"use client";

import React, { useRef, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import Swal from 'sweetalert2';

export default function UserDocuments({ targetUserId, userName }) {
    const { user, documents, addDocument, deleteDocument, viewDocument, fetchUserDocuments } = useAppContext();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (targetUserId && user) {
            fetchUserDocuments(targetUserId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetUserId, user]);

    // Robust admin check
    const isAdmin = user?.role?.toLowerCase() === 'admin' ||
        user?.role?.toLowerCase() === 'superadmin' ||
        (typeof window !== 'undefined' && window.location.pathname.includes('/admin'));

    // Mock filtering logic - in a real app, this would be an API call for this userId
    // For now, we'll try to match by userId if available, or show a subset for demo
    // If a document has a matching userId, we show it.
    const userSpecificDocs = documents.filter(doc =>
        String(doc.userId) === String(targetUserId) ||
        (!doc.userId && String(targetUserId) === "1" && doc.category === 'Recent Reports') // Mock for Alexander Reed
    );

    console.log("documents:", documents)

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const response = await addDocument(file, targetUserId);
                // Mark the local document with the targetUserId so it shows up in the filtered list
                // Note: The AppContext setDocuments should ideally handle this, 
                // but for this specific local state sync:
                if (response && response.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Document Uploaded',
                        text: `${file.name} has been added for ${userName}.`,
                        confirmButtonColor: '#2E5F9E'
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
                confirmButtonColor: '#2E5F9E'
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
            cancelButtonColor: '#2E5F9E',
            confirmButtonText: 'Yes, delete it',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteDocument(docId);
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
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate__animated animate__fadeIn">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#2E5F9E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest text-[11px]">Vault & Documents</h3>
                </div>
                <button
                    onClick={handleUploadClick}
                    className="px-4 py-2 bg-gradient-blue text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Upload
                </button>
            </div>

            <div className="p-8">
                {userSpecificDocs.length === 0 ? (
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
                                <h4 className="text-[10px] font-black text-[#2E5F9E] uppercase tracking-[0.2em] border-b border-gray-50 pb-2">{category}</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {userSpecificDocs.filter(d => d.category === category).map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2E5F9E] shadow-sm group-hover:bg-gradient-blue group-hover:text-black transition-all">
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
                                                    disabled={!isAdmin && doc.hasUserSeen}
                                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${!isAdmin && doc.hasUserSeen
                                                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                                            : "bg-white text-black border-gray-100 hover:border-[#2E5F9E]"
                                                        }`}
                                                >
                                                    {!isAdmin && doc.hasUserSeen ? 'Viewed' : 'View'}
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleDelete(doc.id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                        </svg>
                                                    </button>
                                                )}
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
    );
}

