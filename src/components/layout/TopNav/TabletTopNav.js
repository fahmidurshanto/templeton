"use client";
import React from 'react';
import Link from 'next/link';

export default function TabletTopNav({ user, tabs, activeTab, setActiveTab, logout, pathname }) {
    return (
        <div className="hidden md:flex lg:hidden flex-col w-full bg-gradient-silver-horizontal shadow-xl">
            {/* CONTAINER 1 — Branding + User Info */}
            <div className="relative w-full flex items-center h-12 bg-white shadow-lg overflow-visible">
                <div className="absolute left-4 top-0 w-[140px] h-[80px] bg-white rounded-br-[2rem] flex items-center justify-center shadow-md z-40">
                    <img
                        src="/templeton-logo.png"
                        alt="Templeton Trust Fund Ltd."
                        className="w-[100px] h-[70px] object-contain"
                    />
                </div>

                <div className="flex-1 flex items-center justify-end pr-4 gap-3 h-full">
                    {user && (
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-[#3a3a3a] hidden sm:inline">{user.name}</span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm bg-gradient-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={logout}
                        className="px-4 py-1.5 rounded-full bg-gradient-blue text-gray-900 text-[10px] font-bold shadow-sm transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* CONTAINER 2 — Navigation Links (Scrollable for tablet) */}
            <div className="w-full bg-gradient-to-r from-[#939391] via-[#b7b8b2] to-[#a4a39f] overflow-x-auto no-scrollbar">
                <nav className="flex items-stretch h-10 ml-[150px]">
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
                                className="flex items-stretch"
                                onClick={() => setActiveTab(tab)}
                            >
                                <span className={`flex items-center h-full px-4 font-bold text-[10px] tracking-wider whitespace-nowrap border-b-[2px] transition-colors
                                    ${isActive
                                        ? 'bg-[#1e232d] text-white border-[#2E5F9E]'
                                        : 'text-[#4a4a4a] border-transparent'
                                    }`}
                                >
                                    {tab}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
