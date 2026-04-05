"use client";

import React, { useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import Swal from 'sweetalert2';

export default function DocumentsPage() {
    const { user, documents, addDocument, viewDocument } = useAppContext();
    const fileInputRef = useRef(null);

    const isAdmin = user?.role === 'admin';

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            Swal.fire({
                title: 'Encrypting & Uploading...',
                text: `Transferring ${file.name} to the secure vault.`,
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            try {
                await addDocument(file);
                Swal.fire({
                    icon: 'success',
                    title: 'Asset Secured',
                    text: `${file.name} has been successfully added to your vault.`,
                    confirmButtonColor: '#2E5F9E'
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Transmission Failed',
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
                title: 'Access Denied',
                text: error.message || 'You cannot view this document again.',
                icon: 'error',
                confirmButtonColor: '#000000',
                confirmButtonText: 'Close'
            });
        }
    };


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
            <div className="w-full text-center py-8 md:py-14 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[15vh] md:min-h-[25vh]">
                <div className="relative z-10 w-full px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-3 tracking-tight text-gradient-blue bg-clip-text uppercase leading-none">
                        Secure Vault
                    </h1>
                    <p className="text-[10px] sm:text-xs md:text-base text-gray-400 font-bold uppercase tracking-[0.3em] mb-8 opacity-70">
                        Strategic Document Repository • Encrypted
                    </p>

                    <button
                        onClick={handleUploadClick}
                        className="px-8 py-3.5 bg-gradient-blue rounded-full text-black font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Upload Document
                    </button>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-4xl px-4 animate__animated animate__fadeInUp relative z-10">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#2E5F9E]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h2.25m9 0h2.25A2.25 2.25 0 0121 6v3.776m-12 0h6m-9-3h9m-9-3h9" />
                        </svg>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-500">All Files & Documents</h3>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {documents.map((doc, dIdx) => {
                            const isViewed = !isAdmin && doc.hasUserSeen;

                            return (
                                <div key={dIdx} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition-colors group gap-4">
                                    <div className="flex items-center gap-3 sm:gap-5">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all flex-shrink-0
                                            ${isViewed ? 'bg-gray-100 text-gray-300' : 'bg-gray-50 text-gray-400 group-hover:bg-gradient-blue group-hover:text-black'}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className={`font-bold tracking-tight truncate transition-colors ${isViewed ? 'text-gray-300' : 'text-gray-900 group-hover:text-[#1A3C61]'}`}>{doc.name}</p>
                                            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase mt-0.5 sm:mt-1 truncate">
                                                {doc.date} • {doc.size}
                                                {isViewed && <span className="ml-2 text-red-300">• VIEWED</span>}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center sm:justify-end">
                                        <button
                                            disabled={isViewed}
                                            onClick={() => handleView(doc)}
                                            className={`w-full sm:w-auto px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all text-center
                                                ${isViewed
                                                    ? 'bg-gray-100 text-gray-300 border border-gray-100 cursor-not-allowed'
                                                    : 'bg-white text-black border-2 border-gray-100 hover:border-[#2E5F9E] hover:shadow-md cursor-pointer'}`}
                                        >
                                            {isViewed ? 'Viewed' : 'View Content'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {documents.length === 0 && (
                            <div className="p-12 text-center">
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No documents available in the vault</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full text-center py-12 mt-8">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Templeton Trust Fund Limited • Secure Infrastructure</p>
            </div>
        </div>
    );
}

