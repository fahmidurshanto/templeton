"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminMobileTopNav({ user, tabs, logout, pathname }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden flex flex-col w-full bg-white shadow-md">
            <div className="flex items-center justify-between h-20 px-4 bg-white z-50">
                <Link href="/admin" className="h-full py-3">
                    <img
                        src="/templeton-logo.png"
                        alt="Templeton"
                        className="h-full w-auto object-contain"
                    />
                </Link>

                <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-full bg-black text-[#2E5F9E] text-[8px] font-bold">
                        ADMIN
                    </span>
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed inset-y-0 right-0 w-64 bg-white z-[60] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 bg-gradient-to-br from-[#1e232d] to-[#2a303c] text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-blue flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{user?.name}</p>
                                <p className="text-[10px] text-[#2E5F9E] font-bold tracking-widest">ADMINISTRATOR</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 py-4">
                        {tabs.map((tab) => {
                            const isActive = pathname === tab.href;

                            return (
                                <Link
                                    key={tab.name}
                                    href={tab.href}
                                    className={`flex items-center px-6 py-4 font-bold text-sm border-l-4 transition-colors ${
                                        isActive 
                                        ? 'bg-gray-100 text-[#2E5F9E] border-[#2E5F9E]' 
                                        : 'text-gray-700 border-transparent hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {tab.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-gray-100">
                        <button 
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="w-full py-3 rounded-xl bg-gradient-blue text-gray-900 font-bold shadow-md active:scale-95 transition-all text-center"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[55] backdrop-blur-sm transition-opacity" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
