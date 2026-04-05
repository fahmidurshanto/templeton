"use client";
import React from 'react';
import Link from 'next/link';

export default function AdminTabletTopNav({ user, tabs, logout, pathname }) {
    return (
        <div className="hidden md:flex lg:hidden flex-col w-full bg-gradient-silver-horizontal shadow-xl">
            {/* CONTAINER 1 — Branding + Admin Info */}
            <div className="relative w-full flex items-center h-12 bg-white shadow-lg overflow-visible">
                <div className="absolute left-4 top-0 w-[140px] h-[80px] bg-white rounded-br-[2rem] flex items-center justify-center shadow-md z-40">
                    <img
                        src="/templeton-logo.png"
                        alt="Templeton"
                        className="w-[100px] h-[70px] object-contain"
                    />
                </div>

                <div className="flex-1 flex items-center justify-end pr-4 gap-3 h-full">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-blue text-gray-900 text-[8px] font-black tracking-tighter">
                        ADMIN
                    </span>
                    <span className="font-bold text-xs text-[#3a3a3a]">{user?.name}</span>
                    <button
                        onClick={logout}
                        className="px-4 py-1.5 rounded-full bg-gradient-blue text-gray-900 text-[10px] font-bold shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* CONTAINER 2 — Navigation Links */}
            <div className="w-full bg-gradient-to-r from-[#939391] via-[#b7b8b2] to-[#a4a39f]">
                <nav className="flex items-stretch h-10 ml-[150px] overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;

                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className="flex items-stretch"
                            >
                                <span className={`flex items-center h-full px-5 font-bold text-[10px] tracking-wider whitespace-nowrap border-b-[2px] transition-colors
                                    ${isActive
                                        ? 'bg-[#1e232d] text-white border-[#2E5F9E]'
                                        : 'text-[#4a4a4a] border-transparent'
                                    }`}
                                >
                                    {tab.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
