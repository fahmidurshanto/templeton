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
        <div className="w-full h-full flex flex-col items-center relative overflow-visible">
            {/* Global Watermark - hidden on mobile/tablet to avoid overflow and prioritize performance */}
            <div className="hidden xl:block absolute left-0 top-1/2 -translate-x-[35%] -translate-y-1/2 w-[1400px] h-[1400px] opacity-[0.25] pointer-events-none z-0">
                <img
                    src="/lion.png"
                    alt=""
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]"
                />
            </div>

            <div className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10">
                {/* Welcome Header */}
                <div className="mb-8 md:mb-12 text-center animate__animated animate__fadeIn">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-950 mb-3 tracking-tight leading-[1.1]">
                        Welcome, <span className="text-gradient-gold">{user?.firstName || 'User'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm md:text-lg text-gray-500 font-bold uppercase tracking-[0.3em] opacity-70">Strategic Partnership Overview</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D4AF37] rounded-full animate-spin mx-auto mb-4 scale-75 md:scale-100"></div>
                            <p className="text-[10px] md:text-sm text-gray-400 font-black uppercase tracking-widest">Initializing Secure Dashboard...</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 sm:px-0">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                    {UserIcon}
                                </div>
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Profile</span>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 mb-1">
                                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'N/A'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">{user?.email || 'N/A'}</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Phone:</span>
                                    <span className="text-gray-700 font-medium">{user?.Phone || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Nationality:</span>
                                    <span className="text-gray-700 font-medium">{user?.nationality || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                    {FinancialIcon}
                                </div>
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Financial</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-1">{totalDisbursement}</h3>
                            <p className="text-sm text-gray-600 mb-3">Total Investment</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Investments:</span>
                                    <span className="text-gray-700 font-medium">{financialData.length} records</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`font-medium capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {user?.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Memberships Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                    {MembershipIcon}
                                </div>
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Memberships</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-1">
                                {totalMemberships}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">Total Memberships</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Primary:</span>
                                    <span className="text-gray-700 font-medium">{activePrimary} active</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">3rd Party:</span>
                                    <span className="text-gray-700 font-medium">{activeThirdParty} active</span>
                                </div>
                            </div>
                        </div>

                        {/* Documents Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                    {DocumentIcon}
                                </div>
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Documents</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-1">{userDocs.length}</h3>
                            <p className="text-sm text-gray-600 mb-3">Total Documents</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Recent:</span>
                                    <span className="text-gray-700 font-medium">{recentDocs.length} this week</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Vault:</span>
                                    <span className={`font-medium capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                                        {user?.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Journey Progress Section */}
                {!loading && stageVisibility && stages.length > 0 && (
                    <div className="mt-12 md:mt-16 animate__animated animate__fadeIn">
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-50 relative overflow-y-hidden">
                            <h2 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.3em] mb-12 flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-[#D4AF37]"></span>
                                Your Partnership Journey
                            </h2>

                            <div className="overflow-x-auto pb-12">
                                <div className="min-w-[1000px] flex items-start relative px-4 gap-8">
                                    {/* Line */}
                                    <div className="absolute top-[35px] left-0 w-full h-[2px] bg-gray-100 rounded-full"></div>
                                    <div
                                        className="absolute top-[35px] left-0 h-[3px] bg-gradient-to-r from-[#D4AF37]/40 to-[#D4AF37] rounded-full z-0 transition-all duration-1000"
                                        style={{ width: `${Math.min(((stages.filter(s => s.status === 'processed').length + 1) / stages.length) * 100, 100)}%` }}
                                    ></div>

                                    {stages.sort((a, b) => {
                                        const statusOrder = { 'processed': 0, 'active': 1, 'upcoming': 2 };
                                        const weightA = statusOrder[a.status] ?? 3;
                                        const weightB = statusOrder[b.status] ?? 3;
                                        if (weightA !== weightB) return weightA - weightB;
                                        return a.sequence - b.sequence;
                                    }).map((stage, idx) => (
                                        <div key={stage._id} className="flex flex-col items-center flex-1 relative z-10 max-w-[250px]">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-4 transition-all duration-500 shadow-md border flex-shrink-0
                                                ${stage.status === 'active' ? 'bg-gradient-gold text-black animate-pulse ring-4 ring-[#D4AF37]/20 scale-105 border-transparent' :
                                                    stage.status === 'processed' ? 'bg-black text-white border-transparent' : 'bg-white text-gray-300 border-gray-100'}
                                            `}>
                                                {stage.status === 'processed' ? '✓' : (idx + 1)}
                                            </div>
                                            <div className="text-center w-full px-2">
                                                <p className={`text-[11px] font-black uppercase tracking-tight leading-tight mb-1 ${stage.status === 'active' ? 'text-gray-950' : 'text-gray-400'}`}>
                                                    {stage.name}
                                                </p>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest ${stage.status === 'active' ? 'bg-amber-100 text-amber-700' :
                                                        stage.status === 'processed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {stage.status}
                                                    </span>
                                                    {stage.time && (
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            {new Date(stage.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                </div>

                                                {stage.description && (
                                                    <p className="mt-4 text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-3">
                                                        {stage.description}
                                                    </p>
                                                )}

                                                {(stage.remark || stage.remarkLabel) && (
                                                    <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100 text-left w-full transition-all hover:shadow-sm">
                                                        <p className="text-[9px] font-black text-[#D4AF37] uppercase mb-1">{stage.remarkLabel || 'Update'}:</p>
                                                        <p className="text-[10px] font-bold text-gray-600 leading-relaxed italic">"{stage.remark || 'No remarks provided'}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Section */}
                {!loading && (
                    <div className="mt-12 md:mt-20 px-2 sm:px-0">
                        <h2 className="text-[10px] md:text-xs font-black text-gray-400 mb-6 text-center md:text-left uppercase tracking-[0.3em]">Quick Strategic Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
                            <button
                                onClick={() => router.push('/personal')}
                                className="p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    {UserIcon}
                                </div>
                                <span className="text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-widest">Personal</span>
                            </button>
                            <button
                                onClick={() => router.push('/reports')}
                                className="p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    {FinancialIcon}
                                </div>
                                <span className="text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-widest">Reports</span>
                            </button>
                            <button
                                onClick={() => router.push('/memberships')}
                                className="p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    {MembershipIcon}
                                </div>
                                <span className="text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-widest">Memberships</span>
                            </button>
                            <button
                                onClick={() => router.push('/documents')}
                                className="p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    {DocumentIcon}
                                </div>
                                <span className="text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-widest">Documents</span>
                            </button>
                            <button
                                onClick={() => router.push('/tracking')}
                                className="p-4 sm:p-6 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all duration-300 text-center group cursor-pointer shadow-sm hover:shadow-md"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                    {TrackingIcon}
                                </div>
                                <span className="text-[10px] sm:text-xs font-black text-gray-700 uppercase tracking-widest">Journey</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
