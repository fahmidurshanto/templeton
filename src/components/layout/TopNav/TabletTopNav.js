"use client";
import React from 'react';
import Link from 'next/link';

export default function TabletTopNav({ user, tabs, activeTab, setActiveTab, logout, pathname }) {
    return (
        <div className="hidden md:flex lg:hidden flex-col w-full bg-white shadow-sm border-b border-gray-100 z-50">
            {/* CONTAINER 1 — Branding + User Info */}
            <div className="relative w-full flex items-center h-14 bg-white">
                <div className="absolute left-0 top-0 w-[140px] h-[80px] bg-white rounded-br-[2rem] flex items-center justify-center shadow-md z-[60] border-r border-b border-gray-100">
                    <img
                        src="/Templeton-logo.png"
                        alt="Templeton APAC Ltd."
                        className="w-[100px] h-[70px] object-contain"
                    />
                </div>

                <div className="flex-1 flex items-center justify-end pr-6 gap-4 h-full">
                    {user && (
                        <div className="flex items-center gap-2 group">
                            <span className="font-bold text-[10px] text-gray-900 uppercase tracking-widest hidden sm:inline">{user.name}</span>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-md bg-gray-950">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={logout}
                        className="px-4 py-1.5 rounded-lg bg-gray-950 text-white text-[10px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* CONTAINER 2 — Navigation Links (Scrollable for tablet) */}
            <div className="w-full bg-[#f4f4f4] border-t border-gray-100 overflow-x-auto no-scrollbar">
                <nav className="flex items-stretch h-11 ml-[140px]">
                    {tabs.map((tab) => {
                        let href = '/';
                        if (tab === 'REPORTS') href = '/reports';
                        if (tab === 'SERVICES') href = '/services';
                        if (tab === 'SCHEDULE') href = '/schedule';
                        if (tab === 'PERSONAL') href = '/personal';
                        if (tab === 'MEMBERSHIPS') href = '/memberships';
                        if (tab === 'DOCUMENTS') href = '/documents';
                        if (tab === 'TRACKING') href = '/tracking';

                        const isActive = (href === '/' && pathname === '/') || (href !== '/' && pathname.startsWith(href));

                        return (
                            <Link
                                key={tab}
                                href={href}
                                className="flex items-stretch focus:outline-none"
                                onClick={() => setActiveTab(tab)}
                            >
                                <span className={`flex items-center h-full px-5 font-black text-[9px] uppercase tracking-[0.15em] whitespace-nowrap border-b-2 transition-all cursor-pointer select-none
                                    ${isActive
                                        ? 'bg-white text-gray-900 border-gray-950 shadow-[inset_0_-2px_0_0_#000]'
                                        : 'text-gray-400 border-transparent hover:text-gray-900'
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

