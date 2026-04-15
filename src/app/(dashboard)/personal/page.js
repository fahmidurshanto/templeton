"use client";
import { useAppContext } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import UserDocuments from '../../admin/components/UserDocuments';
import { useRouter } from 'next/navigation';

export default function PersonalPage() {
    const router = useRouter();
    const { user } = useAppContext();
    const [isRequestingUpdate, setIsRequestingUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        phone: '',
        email: '',
        nric: '',
        nationality: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setUpdateData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                gender: user.gender || '',
                phone: user.phone || '',
                email: user.email || '',
                nric: user.nric || '',
                nationality: user.nationality || '',
                address: user.address || ''
            });
        }
    }, [user]);



    const handleRequestSubmit = async (e) => {
        e.preventDefault();

        // Dynamic loading state for premium feel
        Swal.fire({
            title: 'Verifying Identity...',
            text: 'Preparing your update request for strategic review.',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        // Simulate API call to send request to admin
        setTimeout(() => {
            Swal.fire({
                title: 'Request Transmitted',
                text: 'Your profile update request has been successfully transmitted to the Strategic Administrator. You will be notified once the changes are verified and applied.',
                icon: 'success',
                confirmButtonColor: '#D4AF37'
            });
            setIsRequestingUpdate(false);
        }, 2000);
    };

    if (!user) return <div className="p-20 text-center font-bold text-gradient-gold">Loading Profile...</div>;

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible">
            {/* Global Watermark - hidden on mobile/tablet to avoid overflow and prioritize performance */}
            <div className="hidden xl:block absolute left-0 top-1/2 -translate-x-[35%] -translate-y-1/2 w-[1400px] h-[1400px] opacity-[0.25] pointer-events-none z-0 flex items-center justify-center">
                <img
                    src="/lion.png"
                    alt=""
                    className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]"
                />
            </div>

            {/* Header Section */}
            <div className="w-full text-center py-6 md:py-10 mb-2 animate__animated animate__fadeIn relative flex flex-col items-center justify-center">
                <div className="relative z-10 w-full px-4">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-black mb-2 tracking-tight text-gradient-gold bg-clip-text uppercase">
                        Personal Profile
                    </h1>
                    <p className="text-[10px] md:text-base text-gray-500 font-bold uppercase tracking-widest opacity-70">
                        Strategic Identity Management • Precision & Trust
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="w-full animate__animated animate__fadeInUp relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                    {/* Left Column - Summary & Overview */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl flex flex-col items-center text-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-gold flex items-center justify-center text-black font-black text-2xl sm:text-4xl shadow-2xl mb-6 uppercase border-4 border-white">
                                {user.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')) : (user.name ? user.name[0] : 'U')}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight">
                                {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                            </h2>
                            <p className="text-gray-400 font-bold mt-1 text-xs sm:text-sm">{user.email}</p>

                            <div className="w-full flex justify-center mt-6 sm:mt-8">
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 min-w-[120px] sm:min-w-[140px]">
                                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className="text-xs font-black text-green-600 uppercase border-b border-green-100">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl">
                            <h3 className="text-[10px] sm:text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4 sm:mb-6 border-b border-gray-50 pb-2">Quick Overview</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-bold">Member Since</span>
                                    <span className="text-gray-950 font-black">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (user.joined || 'Jan 2025')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-bold">Last Updates</span>
                                    <span className="text-gray-950 font-black">
                                        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Detailed Info & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-[10px] sm:text-[11px] font-black text-gray-900 uppercase tracking-widest">Personal Information</h3>
                                <button
                                    onClick={() => setIsRequestingUpdate(true)}
                                    className="text-[9px] sm:text-[10px] font-black text-[#D4AF37] border-b border-[#D4AF37]/30 uppercase tracking-widest hover:text-[#A67C00] transition-colors"
                                >
                                    Request Update
                                </button>
                            </div>
                            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">First Name</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-bold border-b border-gray-50 pb-1">{user.firstName || user.name?.split(' ')[0]}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Last Name</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-bold border-b border-gray-50 pb-1">{user.lastName || user.name?.split(' ').slice(1).join(' ')}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Email Address</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-bold border-b border-gray-50 pb-1 truncate">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Contact Number</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-bold border-b border-gray-50 pb-1">{user.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">NRIC / Passport</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-bold border-b border-gray-50 pb-1">{user.nric || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Nationality</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-bold border-b border-gray-50 pb-1">{user.nationality || 'N/A'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Residential Address</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-bold border-b border-gray-50 pb-1">{user.address || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50/50 border-b border-gray-100">
                                <h3 className="text-[10px] sm:text-[11px] font-black text-gray-900 uppercase tracking-widest">Account Activity</h3>
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    {user.activities && user.activities.length > 0 ? (
                                        user.activities.map(activity => (
                                            <div key={activity.id} className="flex gap-4 group">
                                                <div className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-all shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
                                                <div>
                                                    <p className="text-sm text-gray-950 font-bold group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">{activity.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-widest">
                                                        {activity.date} • {activity.time}
                                                    </p>
                                                    {activity.description && (
                                                        <p className="text-[11px] text-gray-500 mt-1 italic leading-relaxed border-l-2 border-gray-50 pl-2">
                                                            {activity.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No activity recorded for this period</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <UserDocuments
                            targetUserId={user._id || user.id}
                            userName={user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                        />
                    </div>
                </div>
            </div>



            {/* Information Update Request Modal - Moved outside to prevent stacking context traps */}
            {isRequestingUpdate && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate__animated animate__fadeIn">
                    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-2 border-[#D4AF37]/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate__animated animate__zoomIn">
                        <div className="bg-gradient-gold px-6 sm:px-8 py-4 sm:py-6 flex items-center justify-between border-b border-[#b38b22]/30">
                            <div>
                                <h2 className="text-black font-black text-sm sm:text-base md:text-lg tracking-widest uppercase">Request Update</h2>
                                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-black/60 font-black uppercase tracking-widest mt-0.5 md:mt-1">Strategic verification active</p>
                            </div>
                            <button onClick={() => setIsRequestingUpdate(false)} className="bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors group">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:rotate-90 transition-transform">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleRequestSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8 md:space-y-10 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-4 sm:gap-y-6 md:gap-y-8">
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black"
                                        value={updateData.firstName}
                                        onChange={(e) => setUpdateData({ ...updateData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black"
                                        value={updateData.lastName}
                                        onChange={(e) => setUpdateData({ ...updateData, lastName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">Gender</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black appearance-none"
                                            value={updateData.gender}
                                            onChange={(e) => setUpdateData({ ...updateData, gender: e.target.value })}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                            <option value="Prefer not to say">Prefer not to say</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">Contact Number</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black"
                                        value={updateData.phone}
                                        onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black"
                                        value={updateData.email}
                                        onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">NRIC</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black"
                                        value={updateData.nric}
                                        onChange={(e) => setUpdateData({ ...updateData, nric: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">Nationality</label>
                                    <input
                                        type="text"
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black"
                                        value={updateData.nationality}
                                        onChange={(e) => setUpdateData({ ...updateData, nationality: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-[#A67C00] uppercase tracking-widest">Registered Address</label>
                                    <textarea
                                        rows={2}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm focus:border-[#D4AF37] outline-none transition-all font-bold text-black resize-none"
                                        value={updateData.address}
                                        onChange={(e) => setUpdateData({ ...updateData, address: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 sm:py-5 bg-gradient-gold text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-gold-500/40 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer text-[10px] sm:text-xs md:text-sm"
                                >
                                    Submit Profile Update Request
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsRequestingUpdate(false)}
                                    className="px-6 md:px-12 py-4 sm:py-5 bg-gray-100 text-gray-500 font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all cursor-pointer text-[10px] sm:text-xs md:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
