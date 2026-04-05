"use client";
import React from 'react';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-gray-100 mt-20">
            {/* Top Section — Silver Bar Accents */}
            <div className="w-full h-1 bg-gradient-silver-horizontal opacity-30"></div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16">
                    
                    {/* Brand & Identity Section */}
                    <div className="space-y-8 flex-1">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/templeton-logo.png" 
                                alt="Templeton Trust Fund Ltd." 
                                className="h-40 w-auto object-contain"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                            <p className="text-gray-500 text-[10px] font-bold leading-relaxed tracking-wide uppercase max-w-sm">
                                Providing secure and premium partnership solutions across the APAC region. Empowering businesses through technical excellence.
                            </p>
                            <div className="hidden md:block w-px h-8 bg-gray-100 flex-shrink-0"></div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                © {currentYear} TEMPLETON TRUST FUND LTD. ALL RIGHTS RESERVED.
                            </p>
                        </div>
                    </div>

                    {/* Contact Info (Right Aligned) */}
                    <div className="space-y-6 md:text-right pt-4">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-50 pb-3 inline-block">Support & Contact</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-400">
                                <svg className="w-4 h-4 text-[#2E5F9E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="text-[10px] font-black tracking-widest">PORTAL@TEMPLETON.APAC</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <svg className="w-4 h-4 text-[#2E5F9E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-[10px] font-black tracking-widest uppercase">Singapore Headquarters</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
}
