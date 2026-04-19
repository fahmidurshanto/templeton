"use client";
import React from 'react';
import Link from 'next/link';

export default function DesktopTopNav({ user, tabs, activeTab, setActiveTab, logout, pathname }) {
    return (
        <div className="hidden lg:flex flex-col w-full bg-white shadow-sm border-b border-gray-100 z-50 overflow-hidden">
            {/* CONTAINER 1 — Branding + User Info */}
            <div className="relative w-full flex items-center h-16 bg-white">
                <div className="absolute left-0 top-0 w-[200px] h-[102px] bg-white rounded-br-[3rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.05)] z-[60] border-r border-b border-gray-100 transition-all duration-300">
                    <img
                        src="/templeton-logo.png"
                        alt="Templeton APAC Ltd."
                        className="w-[130px] h-[90px] object-contain"
                    />
                </div>

                <div className="ml-[200px] flex-1 flex items-center justify-end pr-8 gap-6 h-full max-w-7xl mx-auto w-full">
                    {user && (
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Portfolio Holder</p>
                                <p className="font-bold text-sm text-gray-900 group-hover:text-black transition-colors">{user.name}</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gray-950 group-hover:scale-105 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    )}
                    
                    <div className="h-6 w-[1px] bg-gray-100"></div>

                    {user ? (
                        <button
                            onClick={logout}
                            className="px-6 py-2 rounded-xl bg-gray-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md active:scale-95"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/login" className="px-6 py-2 rounded-xl bg-gray-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md">
                            Identity Login
                        </Link>
                    )}
                </div>
            </div>

            {/* CONTAINER 2 — Navigation Links — Centered Containment */}
            <div className="w-full bg-[#f4f4f4] border-t border-gray-100">
                <div className="max-w-7xl mx-auto w-full flex">
                    <div className="w-[200px] shrink-0"></div> {/* Sidebar Offset Match */}
                    <nav className="flex-1 flex items-stretch h-12 overflow-x-auto no-scrollbar">
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
                                    <span className={`flex items-center h-full px-6 font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-all cursor-pointer select-none
                                        ${isActive
                                            ? 'bg-white text-gray-900 border-gray-950 shadow-[inset_0_-2px_0_0_#000]'
                                            : 'text-gray-400 border-transparent hover:text-gray-900 hover:bg-black/5'
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
        </div>
    );
}

