"use client";
import React, { useState } from 'react';
import DashboardModal from '../../../components/ui/DashboardModal';



const PersonIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export default function PersonalModal({ isOpen, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [formData, setFormData] = useState({
        "First Name": "Saad",
        "Last Name": "Salman",
        "Phone Number": "8423525",
        "Gender": "MALE",
        "Email": "saad@gmail.com",
        "NRIC": "S12345678N",
        "Address": "96 Northumberland Road, Singapore 938221",
        "Nationality": "Singaporean"
    });

    const handleInputChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        setIsPending(true);
        setIsEditing(false);
    };

    const secondaryAction = !isPending && (
        <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 cursor-pointer py-2 border-2 border-black text-black text-sm font-bold rounded-lg hover:bg-black hover:text-white transition-all duration-200"
        >
            {isEditing ? 'Cancel' : 'Request Edit'}
        </button>
    );

    const footerAction = isEditing ? (
        <button
            onClick={handleSubmit}
            className="px-6 cursor-pointer py-2 bg-gradient-blue text-black text-sm font-bold rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200"
        >
            Submit Request
        </button>
    ) : null;

    return (
        <DashboardModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                if (!isPending) setIsEditing(false);
            }}
            title="Personal Information"
            icon={PersonIcon}
            secondaryAction={secondaryAction}
            footer={footerAction}
        >
            <div className="space-y-4 py-2">
                {isPending && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center gap-3 mb-4 animate__animated animate__fadeIn">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-[11px] font-bold text-blue-800">Edit Request Pending Approval</p>
                    </div>
                )}

                <div className="divide-y divide-gray-100">
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{key}</span>
                            <div className="flex items-center gap-2 flex-1 sm:justify-end">
                                <span className="hidden sm:inline text-gray-300 font-medium">:</span>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        className="w-full sm:w-auto text-sm font-bold text-gray-900 border-b border-gray-200 focus:border-[#2E5F9E] outline-none bg-transparent py-1 px-2 text-right"
                                    />
                                ) : (
                                    <span className="text-sm font-bold text-gray-900 text-right">{value}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardModal>
    );
}
