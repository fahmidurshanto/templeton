"use client";

import React, { useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import Swal from 'sweetalert2';

export default function AdminDocumentsPage() {
    const { user, documents, addDocument, deleteDocument, viewDocument } = useAppContext();
    const fileInputRef = useRef(null);

    const isAdmin = user?.role === 'admin';

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await addDocument(file);
                Swal.fire({
                    icon: 'success',
                    title: 'Document Uploaded',
                    text: `${file.name} has been added to the vault.`,
                    confirmButtonColor: '#2E5F9E'
                });
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
                confirmButtonColor: '#000000',
                confirmButtonText: 'Close'
            });
        }
    };

    const handleDelete = async (docId) => {
        Swal.fire({
            title: 'Delete Document?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#000000',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it'
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

    // Group documents by category for display
    const categories = [...new Set(documents.map(d => d.category))];

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Global Watermark - hidden on mobile/tablet to avoid overflow and prioritize performance */}
            <div className="hidden xl:block absolute left-0 top-1/2 -translate-x-[35%] -translate-y-1/2 w-[1400px] h-[1400px] opacity-[0.25] pointer-events-none z-0 flex items-center justify-center">
                <img
                    src="/lion.png"
                    alt=""
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]"
                />
            </div>

            {/* Header Section */}
            <div className="w-full text-center py-6 md:py-14 mb-2 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[15vh] px-4">
                <div className="relative z-10 w-full">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 tracking-wide text-gradient-blue bg-clip-text uppercase">
                        Secure Vault
                    </h1>
                    <p className="text-gray-500 text-xs sm:text-sm md:text-lg font-medium mb-6 sm:mb-8">
                        Access and manage sensitive document repository.
                    </p>

                    {isAdmin && (
                        <button
                            onClick={handleUploadClick}
                            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-blue rounded-full text-black font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Upload Document
                        </button>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-4xl px-4 animate__animated animate__fadeInUp relative z-10 space-y-10">
                {categories.map((category, gIdx) => (
                    <div key={gIdx} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 flex items-center gap-3 sm:gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 sm:w-5 h-5 text-[#2E5F9E]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h2.25m9 0h2.25A2.25 2.25 0 0121 6v3.776m-12 0h6m-9-3h9m-9-3h9" />
                            </svg>
                            <h3 className="font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gray-500">{category}</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {documents.filter(d => d.category === category).map((doc, dIdx) => {
                                const isViewed = !isAdmin && doc.hasUserSeen;

                                return (
                                    <div key={dIdx} className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group gap-4">
                                        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0
                                                ${isViewed ? 'bg-gray-100 text-gray-300' : 'bg-gray-50 text-gray-400 group-hover:bg-gradient-blue group-hover:text-black'}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`text-xs sm:text-sm font-bold tracking-tight transition-colors truncate ${isViewed ? 'text-gray-300' : 'text-gray-900 group-hover:text-[#1A3C61]'}`}>{doc.name}</p>
                                                <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mt-0.5 sm:mt-1 truncate">
                                                    {doc.date} <span className="hidden sm:inline">• {doc.size}</span>
                                                    {isViewed && <span className="ml-2 text-red-300">• VIEWED</span>}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                disabled={isViewed}
                                                onClick={() => handleView(doc)}
                                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all
                                                    ${isViewed
                                                        ? 'bg-gray-100 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                        : 'bg-white text-black border-2 border-gray-100 hover:border-[#2E5F9E] hover:shadow-md'}`}
                                            >
                                                {isViewed ? 'Seen' : 'View'}
                                            </button>

                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete Document"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full text-center py-12 mt-8">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Templeton Trust Fund Limited • Secure Infrastructure</p>
            </div>
        </div>
    );
}
