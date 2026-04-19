"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';
import api from '@/lib/api';

const UserIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const FinancialIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MembershipIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);

const DocumentIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);

const TrackingIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-900">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
);

export default function DashboardHomePage() {
    const router = useRouter();
    const { user, documents, fetchFinancialSummary, fetchUserDocuments } = useAppContext();
    const [financialData, setFinancialData] = useState([]);
    const [totalDisbursement, setTotalDisbursement] = useState('USD 0');
    const [memberships, setMemberships] = useState([]);
    const [stages, setStages] = useState([]);
    const [stageVisibility, setStageVisibility] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            if (user?.id || user?._id) {
                const userId = user._id || user.id;
                try {
                    // Fetch financial data
                    const financialRes = await fetchFinancialSummary(userId);
                    if (financialRes) {
                        setFinancialData(financialRes.data || []);
                        setTotalDisbursement(financialRes.totalDisbursement || 'USD 0');
                    }

                    // Fetch real memberships from backend
                    try {
                        const { default: api } = await import('@/lib/api');
                        const membershipRes = await api.get(`/user/memberships/${userId}`);
                        if (membershipRes.data.success) {
                            setMemberships(membershipRes.data.data || []);
                        }

                        // Fetch stages only if user has verified via QR
                        const meRes = await api.get('/auth/me');
                        if (meRes.data.success && meRes.data.user.stageVisibility) {
                            setStageVisibility(true);
                            const stageRes = await api.get(`/stage/user/${userId}`);
                            if (stageRes.data.success) {
                                setStages(stageRes.data.stage || []);
                            }
                        }
                    } catch (err) {
                        console.error('Data fetch error:', err);
                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        loadUserData();
    }, [user?.id, user?._id]);

    // Filter documents belonging to current user
    const userId = user?._id || user?.id;
    const userDocs = documents.filter(doc =>
        !doc.userId || String(doc.userId) === String(userId)
    );

    const recentDocs = userDocs.filter(doc => {
        const docDate = new Date(doc.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return docDate > weekAgo;
    });

    // Compute real membership counts
    const totalMemberships = memberships.length;
    const activePrimary = memberships.filter(m => m.type === 'primary' && m.status === 'active').length;
    const activeThirdParty = memberships.filter(m => m.type === 'third_party' && m.status === 'active').length;
    const totalActive = activePrimary + activeThirdParty;

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center relative overflow-hidden bg-[#F9FAFB]">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-gray-200/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-gray-300/10 rounded-full blur-[100px]"></div>
            </div>



            <div className="w-full max-w-7xl mx-auto px-6 py-12 relative z-10">
                {/* Welcome Header — Statement Design */}
                <div className="mb-16 md:mb-24 text-center animate__animated animate__fadeInDown">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/50 border border-white/20 backdrop-blur-sm shadow-sm mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Official Partnership Portal</p>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-950 mb-4 tracking-tighter leading-[1] italic">
                        Welcome, <span className="text-gradient-premium tracking-tight not-italic">{user?.firstName || 'User'}</span>
                    </h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gray-300"></div>
                        <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-[0.5em] opacity-80">Strategic Journey Overview</p>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gray-300"></div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#4A4A4A] rounded-full animate-spin mx-auto mb-4 scale-75 md:scale-100"></div>
                            <p className="text-[10px] md:text-sm text-gray-400 font-black uppercase tracking-widest">Securing Connection...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2 sm:px-0">
                        {/* Personal Information Card — Glassmorphic */}
                        <div className="group bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 hover:border-white hover:shadow-[0_20px_48px_rgba(0,0,0,0.06)] transition-all duration-500 animate__animated animate__fadeInUp animate__delay-1s">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                                    {UserIcon}
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Portfolio Holder</p>
                                <h3 className="text-xl font-black text-gray-950 truncate">
                                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'N/A'}
                                </h3>
                                <p className="text-sm font-medium text-gray-500 truncate pb-4 border-b border-gray-100/50">{user?.email || 'N/A'}</p>
                            </div>
                            <div className="pt-4 space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Phone</span>
                                    <span className="text-gray-900 font-black">{user?.Phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Origin</span>
                                    <span className="text-gray-900 font-black">{user?.nationality || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary Card — Glassmorphic */}
                        <div className="group bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 hover:border-white hover:shadow-[0_20px_48px_rgba(0,0,0,0.06)] transition-all duration-500 animate__animated animate__fadeInUp animate__delay-2s">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 -rotate-3 group-hover:rotate-0">
                                    {FinancialIcon}
                                </div>
                                <span className="px-3 py-1 bg-gray-950 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Secure</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Valuation</p>
                                <h3 className="text-2xl font-black text-gray-950 tracking-tight">{totalDisbursement}</h3>
                                <p className="text-sm font-medium text-gray-500 truncate pb-4 border-b border-gray-100/50">Cumulative Holdings</p>
                            </div>
                            <div className="pt-4 space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Registry</span>
                                    <span className="text-gray-900 font-black">{financialData.length} Entries</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Standing</span>
                                    <span className={`font-black uppercase tracking-widest ${user?.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {user?.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Memberships Card — Glassmorphic */}
                        <div className="group bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 hover:border-white hover:shadow-[0_20px_48px_rgba(0,0,0,0.06)] transition-all duration-500 animate__animated animate__fadeInUp animate__delay-3s">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 rotate-6 group-hover:rotate-0">
                                    {MembershipIcon}
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] animate-ping"></div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Corporate Access</p>
                                <h3 className="text-3xl font-black text-gray-950">{totalMemberships}</h3>
                                <p className="text-sm font-medium text-gray-500 truncate pb-4 border-b border-gray-100/50">Active Registrations</p>
                            </div>
                            <div className="pt-4 space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Primary</span>
                                    <span className="text-gray-900 font-black">{activePrimary} Active</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">External</span>
                                    <span className="text-gray-900 font-black">{activeThirdParty} Active</span>
                                </div>
                            </div>
                        </div>

                        {/* Documents Card — Glassmorphic */}
                        <div className="group bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 hover:border-white hover:shadow-[0_20px_48px_rgba(0,0,0,0.06)] transition-all duration-500 animate__animated animate__fadeInUp animate__delay-4s">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 -rotate-3 group-hover:rotate-0">
                                    {DocumentIcon}
                                </div>
                                <span className="w-8 h-[1px] bg-gray-200"></span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vault Status</p>
                                <h3 className="text-3xl font-black text-gray-950">{userDocs.length}</h3>
                                <p className="text-sm font-medium text-gray-500 truncate pb-4 border-b border-gray-100/50">Compliance Files</p>
                            </div>
                            <div className="pt-4 space-y-3">
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Weekly Update</span>
                                    <span className="text-gray-900 font-black">+{recentDocs.length} New</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-tighter">Integrity</span>
                                    <span className="text-gray-900 font-black">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Service Hub — Redesigned Quick Actions */}
                {!loading && (
                    <div className="mt-24 md:mt-32 px-4 sm:px-0 animate__animated animate__fadeInUp animate__delay-5s">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-[11px] md:text-xs font-black text-gray-950 uppercase tracking-[0.4em]">Strategic Resource Hub</h2>
                            <div className="h-[1px] flex-1 bg-gray-100 mx-8"></div>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 text-white">
                            {[
                                { link: '/personal', label: 'Identity', icon: UserIcon },
                                { link: '/reports', label: 'Financials', icon: FinancialIcon },
                                { link: '/memberships', label: 'Access', icon: MembershipIcon },
                                { link: '/documents', label: 'The Vault', icon: DocumentIcon },
                                { link: '/tracking', label: 'The Journey', icon: TrackingIcon }
                            ].map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => router.push(action.link)}
                                    className="relative overflow-hidden p-8 bg-white rounded-[2rem] border border-gray-100 hover:border-gray-900 transition-all duration-500 text-center group cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-2"
                                >
                                    {/* Subtle Gradient Background on Hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="w-16 h-16 bg-gradient-premium rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-950 group-hover:text-white transition-all duration-500 group-hover:shadow-xl">
                                            {React.cloneElement(action.icon, { className: "w-8 h-8 group-hover:text-white transition-colors duration-500" })}
                                        </div>
                                        <span className="text-[11px] font-black text-gray-900 group-hover:text-gray-950 uppercase tracking-[0.2em] transition-all duration-500">{action.label}</span>
                                        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                                            <div className="w-8 h-1 bg-gray-950 mx-auto rounded-full"></div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

