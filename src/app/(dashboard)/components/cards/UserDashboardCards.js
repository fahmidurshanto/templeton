"use client";
import React, { useState } from 'react';
import PersonalModal from '../PersonalModal';
import FinancialSummaryModal from '../FinancialSummaryModal';
import EntitiesModal from '../EntitiesModal';
import DocumentsModal from '../DocumentsModal';

const cards = [
    {
        id: 'personal',
        label: 'Personal',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    },
    {
        id: 'financial-summary',
        label: 'Financial Summary',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        id: 'entities',
        label: 'Entities',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
        ),
    },
    {
        id: 'documents',
        label: 'Documents',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
            </svg>
        ),
    },
];

export default function UserDashboardCards({ onCardClick }) {
    const [personalOpen, setPersonalOpen] = useState(false);
    const [financialOpen, setFinancialOpen] = useState(false);
    const [entitiesOpen, setEntitiesOpen] = useState(false);
    const [documentsOpen, setDocumentsOpen] = useState(false);

    const handleCardClick = (id) => {
        if (id === 'personal') setPersonalOpen(true);
        if (id === 'financial-summary') setFinancialOpen(true);
        if (id === 'entities') setEntitiesOpen(true);
        if (id === 'documents') setDocumentsOpen(true);
        if (onCardClick) onCardClick(id);
    };

    return (
        <>
        <PersonalModal isOpen={personalOpen} onClose={() => setPersonalOpen(false)} />
        <FinancialSummaryModal isOpen={financialOpen} onClose={() => setFinancialOpen(false)} />
        <EntitiesModal isOpen={entitiesOpen} onClose={() => setEntitiesOpen(false)} />
        <DocumentsModal isOpen={documentsOpen} onClose={() => setDocumentsOpen(false)} />
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-2">
            {cards.map((card) => (
                <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="group relative bg-white rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                >
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black rounded-2xl flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <img src="/lion.png" alt="" className="w-16 h-16 object-contain" />
                        <span className="text-white text-sm font-semibold tracking-wide">{card.label}</span>
                    </div>

                    {/* Default content */}
                    <span className="text-gray-400 transition-colors duration-200">
                        {card.icon}
                    </span>
                    <span className="text-sm font-medium text-gray-600 transition-colors duration-200">
                        {card.label}
                    </span>
                </button>
            ))}
        </div>
        </>  
    );
}
