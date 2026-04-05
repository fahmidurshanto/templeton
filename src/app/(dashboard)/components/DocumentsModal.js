"use client";
import React, { useState, useRef } from 'react';
import DashboardModal from '../../../components/ui/DashboardModal';

const DocumentsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

export default function DocumentsModal({ isOpen, onClose }) {
    const [documents, setDocuments] = useState([]);
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newDoc = {
                id: Date.now(),
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
                type: file.type,
                date: new Date().toLocaleDateString()
            };
            setDocuments([...documents, newDoc]);
        }
        // Reset input so the same file can be uploaded again if deleted
        event.target.value = null;
    };

    return (
        <DashboardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Documents"
            icon={DocumentsIcon}
        >
            <div className="relative pt-6">
                {/* Floating Add Button */}
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer absolute -top-2 -right-2 w-10 h-10 bg-gradient-blue text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-20 group"
                    title="Upload Document"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                        Upload Document
                    </span>
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                />

                <div className="min-h-[200px] border border-gray-100 rounded-xl bg-gray-50/30 flex flex-col items-center justify-center p-8 transition-all duration-300">
                    {documents.length === 0 ? (
                        <div className="flex flex-col items-center text-center animate__animated animate__fadeIn">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="gray" className="w-8 h-8 opacity-40">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                </svg>
                            </div>
                            <span className="text-gray-400 text-sm font-medium">No Documents Available</span>
                        </div>
                    ) : (
                        <div className="w-full space-y-3 animate__animated animate__fadeIn">
                            <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-2">Uploaded Files</h4>
                            {documents.map((doc) => (
                                <div key={doc.id} className="bg-white border border-gray-100 p-3 rounded-lg flex items-center justify-between group hover:border-[#2E5F9E]/30 transition-all duration-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 truncate max-w-[150px]">{doc.name}</p>
                                            <p className="text-[10px] text-gray-400">{doc.size} • {doc.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardModal>
    );
}
