"use client";
import React from 'react';
import Link from 'next/link';

export default function DesktopTopNav({ user, tabs, activeTab, setActiveTab, logout, pathname }) {
    return (
        <div className="hidden lg:flex flex-col w-full bg-gradient-silver-horizontal shadow-xl">
            {/* CONTAINER 1 — Branding + User Info */}
            <div className="relative w-full flex items-center h-12 bg-white shadow-lg overflow-visible">
                <div className="absolute left-0 top-0 w-[180px] h-[102px] bg-white rounded-br-[2.5rem] flex items-center justify-center shadow-lg z-50">
                    <img
                        src="/templeton-logo.png"
                        alt="Templeton Trust Fund Ltd."
                        className="w-[120px] h-[90px] object-contain"
                    />
                </div>

                <div className="ml-[180px] flex-1 flex items-center justify-end pr-6 gap-3 h-full">
                    {user && (
                        <>
                            <div className="flex items-center gap-2">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0 fill-[#2E5F9E] drop-shadow-sm">
                                    <path d="M12 1L3 5v6.09c0 5.05 3.41 9.76 9 10.91 5.59-1.15 9-5.86 9-10.91V5l-9-4zm0 2.18l7 3.12V11c0 3.94-2.6 7.6-7 8.79-4.4-1.19-7-4.85-7-8.79V6.3l7-3.12z" />
                                </svg>
                                <span className="font-semibold text-sm text-[#3a3a3a]">{user.name}</span>
                            </div>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md shrink-0 bg-gradient-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </>
                    )}
                    {user ? (
                        <button 
                            onClick={logout}
                            className="px-5 cursor-pointer py-1.5 rounded-full bg-gradient-blue text-gray-900 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all mr-2"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link href="/login" className="px-5 cursor-pointer py-1.5 rounded-full bg-gradient-blue text-gray-900 text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all mr-2">
                            Login
                        </Link>
                    )}
                </div>
            </div>

            {/* CONTAINER 2 — Navigation Links */}
            <div className="w-full bg-gradient-to-r from-[#939391] via-[#b7b8b2] to-[#a4a39f]">
                <nav className="flex items-stretch h-11 ml-[180px]">
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
                                className="flex items-stretch focus:outline-none"
                                onClick={() => setActiveTab(tab)}
                            >
                                <span className={`flex items-center h-full px-6 font-bold text-xs tracking-[0.08em] whitespace-nowrap border-b-[3px] transition-colors cursor-pointer select-none
                                    ${isActive
                                        ? 'bg-[linear-gradient(180deg,#1e232d_100%,#2a303c_0%)] text-white border-[#2E5F9E]'
                                        : 'text-[#4a4a4a] border-transparent hover:bg-black/5'
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
