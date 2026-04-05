"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '../../context/AppContext';

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

export default function DashboardHomePage() {
    const router = useRouter();
    const { user, documents, fetchFinancialSummary, fetchUserDocuments } = useAppContext();
    const [financialData, setFinancialData] = useState([]);
    const [totalDisbursement, setTotalDisbursement] = useState('USD 0');
    const [memberships, setMemberships] = useState([]);
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
                    } catch (err) {
                        console.error('Memberships fetch error:', err);
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
                        Welcome, <span className="text-gradient-blue">{user?.firstName || 'User'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm md:text-lg text-gray-500 font-bold uppercase tracking-[0.3em] opacity-70">Strategic Partnership Overview</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#2E5F9E] rounded-full animate-spin mx-auto mb-4 scale-75 md:scale-100"></div>
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
                                    <span className={`font-medium capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-blue-600'}`}>
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
                                    <span className={`font-medium capitalize ${user?.status === 'active' ? 'text-green-600' : 'text-blue-600'}`}>
                                        {user?.status || 'Active'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Section */}
                {!loading && (
                    <div className="mt-12 md:mt-20 px-2 sm:px-0">
                        <h2 className="text-[10px] md:text-xs font-black text-gray-400 mb-6 text-center md:text-left uppercase tracking-[0.3em]">Quick Strategic Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
