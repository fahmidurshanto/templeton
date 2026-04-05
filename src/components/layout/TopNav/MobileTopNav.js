"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function MobileTopNav({ user, tabs, activeTab, setActiveTab, logout, pathname }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden flex flex-col w-full bg-white shadow-md">
            <div className="flex items-center justify-between h-20 px-4 bg-white z-50">
                {/* Logo */}
                <Link href="/" className="h-full py-3">
                    <img
                        src="/templeton-logo.png"
                        alt="Templeton"
                        className="h-full w-auto object-contain"
                    />
                </Link>

                {/* Hamburger and User Info */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-blue shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                    <button 
                        onClick={toggleMenu}
                        className="p-2 text-gray-600 focus:outline-none"
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

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-20 bg-black/50 z-40 backdrop-blur-sm transition-opacity" onClick={toggleMenu} />
            )}

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-20 right-0 h-screen w-64 bg-white z-50 shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <nav className="flex flex-col py-4">
                    {tabs.map((tab) => {
                        let href = '/';
                        if (tab === 'REPORTS') href = '/reports';
                        if (tab === 'SERVICES') href = '/services';
                        if (tab === 'SCHEDULE') href = '/schedule';
                        if (tab === 'PERSONAL') href = '/personal';
                        if (tab === 'MEMBERSHIPS') href = '/memberships';
                        if (tab === 'DOCUMENTS') href = '/documents';

                        const isActive = (href === '/' && pathname === '/') || (href !== '/' && pathname.startsWith(href));

                        return (
                            <Link
                                key={tab}
                                href={href}
                                className={`px-6 py-4 font-bold text-sm border-l-4 transition-colors ${
                                    isActive 
                                    ? 'bg-gray-100 text-[#2E5F9E] border-[#2E5F9E]' 
                                    : 'text-gray-700 border-transparent hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setIsOpen(false);
                                }}
                            >
                                {tab}
                            </Link>
                        );
                    })}
                    <div className="mt-auto p-6 border-t border-gray-100">
                        {user ? (
                            <button 
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full py-3 rounded-xl bg-gradient-blue text-gray-900 font-bold shadow-md active:scale-95 transition-all text-center"
                            >
                                Logout
                            </button>
                        ) : (
                            <Link 
                                href="/login" 
                                className="block w-full py-3 rounded-xl bg-gradient-blue text-gray-900 font-bold shadow-md active:scale-95 transition-all text-center"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}
