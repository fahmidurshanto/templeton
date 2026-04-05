"use client";
import React, { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Swal from 'sweetalert2';
import UserDocuments from '../../components/UserDocuments';
import api from '@/lib/api';
import logger from '@/lib/logger';
import { getFriendlyErrorMessage } from '@/lib/error-utils';
import NotFound from '@/components/ui/NotFound';

export default function UserDetailPage({ params }) {
    const router = useRouter();
    const { userList, updateUser, deleteUser, user: currentUser } = useAppContext();
    const resolvedParams = use(params);
    const userId = resolvedParams.id;
    const user = userList.find(u => String(u._id || u.id) === String(userId));

    const [schedules, setSchedules] = useState([]);
    const [schedulesLoading, setSchedulesLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!userId || !currentUser) return;
        const fetchSchedules = async () => {
            try {
                const res = await api.get(`/schedule/user/${userId}`);
                if (res.data.success) {
                    setSchedules(res.data.data || []);
                }
            } catch (err) {
                logger.error('Failed to fetch schedules:', err);
            } finally {
                setSchedulesLoading(false);
            }
        };
        fetchSchedules();
    }, [userId, currentUser]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || user?.name?.split(' ')[0] || '',
        lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        status: user?.status || 'active',
        Phone: user?.Phone || '',
        gender: user?.gender || 'male',
        nric: user?.nric || '',
        address: user?.address || '',
        nationality: user?.nationality || '',
        secondaryPhone: user?.secondaryPhone || '',
        secondaryEmail: user?.secondaryEmail || '',
        password: ''
    });

    if (!user) {
        return <NotFound title="User Not Found" message="The individual profile you are seeking is not registered in the Templeton database." />;
    }

    const handleDelete = () => {
        Swal.fire({
            title: 'Remove User?',
            text: `Are you sure you want to delete ${user.firstName || user.name}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#2E5F9E',
            confirmButtonText: 'Yes, Remove User',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(user._id || user.id);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'User has been removed from the portal.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        router.push('/admin/users');
                    });
                } catch (error) {
                    Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
                }
            }
        });
    };

    const handleEdit = () => {
        setFormData({
            firstName: user.firstName || user.name?.split(' ')[0] || '',
            lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
            email: user.email,
            status: user.status,
            Phone: user.Phone || '',
            gender: user.gender || 'male',
            nric: user.nric || '',
            address: user.address || '',
            nationality: user.nationality || '',
            secondaryPhone: user.secondaryPhone || '',
            secondaryEmail: user.secondaryEmail || '',
            password: ''
        });
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => setIsEditModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(user._id || user.id, formData);
            Swal.fire({
                title: 'Profile Updated',
                text: 'User information has been successfully updated.',
                icon: 'success',
                confirmButtonColor: '#2E5F9E'
            });
            handleCloseModal();
        } catch (error) {
            Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
        }
    };


    return (
        <>
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate__animated animate__fadeIn">
                    <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-[#2E5F9E]/30 w-full max-w-2xl overflow-hidden animate__animated animate__zoomIn flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-blue py-5 px-8 flex items-center justify-between shrink-0">
                            <h3 className="text-black font-black uppercase tracking-widest text-sm">
                                Edit User Profile
                            </h3>
                            <button onClick={handleCloseModal} className="text-black hover:scale-110 transition-transform cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-6 sm:p-10">
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                    <div className="space-y-6 sm:space-y-8">
                                        <h4 className="text-[10px] sm:text-[12px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Identity Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">First Name</label>
                                                <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Last Name</label>
                                                <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Gender</label>
                                                <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black cursor-pointer" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Nationality</label>
                                                <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">NRIC / Passport No.</label>
                                            <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.nric} onChange={(e) => setFormData({ ...formData, nric: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Full Address</label>
                                            <textarea required rows="2" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black resize-none" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="space-y-6 sm:space-y-8">
                                        <h4 className="text-[10px] sm:text-[12px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Status & Contact</h4>
                                        <div>
                                            <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Account Status</label>
                                            <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black cursor-pointer" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                                <option value="active">Active</option>
                                                <option value="pending">Pending</option>
                                                <option value="suspended">Suspended</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Email Address</label>
                                            <input required type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Phone Number</label>
                                            <input required type="tel" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.Phone} onChange={(e) => setFormData({ ...formData, Phone: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col space-y-4 sm:space-y-6">
                                            <div>
                                                <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Secondary Email</label>
                                                <input type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.secondaryEmail} onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Secondary Phone</label>
                                                <input type="tel" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.secondaryPhone} onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-[#2E5F9E] mb-1.5 sm:mb-2">Vault Password</label>
                                            <input type="password" underline="true" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="Leave empty to keep current" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 sm:py-5 bg-gradient-blue text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-4 text-xs sm:text-sm"
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-full space-y-8 animate__animated animate__fadeIn">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2 sm:px-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/admin/users')}
                            className="p-2.5 hover:bg-white rounded-2xl shadow-sm border border-gray-100 transition-all text-gray-400 hover:text-[#2E5F9E]"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight leading-none mb-1">User Profile</h1>
                            <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1 opacity-70 truncate max-w-[200px] sm:max-w-none">
                                {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => router.push(`/admin/users/${userId}/reports`)}
                            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-gradient-blue text-black font-black text-[10px] uppercase tracking-widest hover:scale-105 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                            </svg>
                            Reports
                        </button>
                        <button
                            onClick={handleEdit}
                            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-white border border-gray-200 text-black font-black text-[10px] uppercase tracking-widest hover:border-[#2E5F9E] hover:bg-gray-50 shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4 text-[#1A3C61]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-3.5 py-3 rounded-xl bg-red-50 text-red-600 border border-red-100 font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                            title="Delete User"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl flex flex-col items-center text-center">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-blue flex items-center justify-center text-black font-black text-3xl sm:text-4xl shadow-2xl mb-4 sm:mb-6 uppercase">
                                {user.firstName ? (user.firstName[0] + (user.lastName ? user.lastName[0] : '')) : (user.name ? user.name[0] : 'U')}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight">
                                {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                            </h2>
                            <p className="text-gray-400 font-bold mt-1 text-xs sm:text-sm truncate w-full px-2">{user.email}</p>

                            <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 mt-6 sm:mt-8">
                                <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-100 text-center">
                                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className={`text-[10px] sm:text-xs font-black uppercase ${user.status === 'active' ? 'text-green-600' : 'text-blue-500'}`}>{user.status}</span>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 border border-gray-100 text-center">
                                    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Role</p>
                                    <span className="text-[10px] sm:text-xs font-black text-[#1A3C61] uppercase tracking-widest">{user.role || 'Partner'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl">
                            <h3 className="text-[10px] sm:text-xs font-black text-gray-950 uppercase tracking-[0.2em] mb-4 sm:mb-6">Quick Overview</h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-gray-400 font-bold">Member Since</span>
                                    <span className="text-gray-950 font-black">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : user.joined}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-gray-400 font-bold">Last Updates</span>
                                    <span className="text-gray-950 font-black">
                                        {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push(`/admin/users/${userId}/memberships`)}
                                className="w-full px-6 py-4 rounded-2xl bg-gradient-blue text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                                </svg>
                                Memberships
                            </button>
                            <button
                                onClick={() => router.push(`/admin/users/${userId}/services`)}
                                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-[#2E5F9E] text-black font-black text-xs uppercase tracking-widest hover:bg-gray-50 hover:scale-[1.02] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5 text-[#1A3C61]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 18.4V14.15m16.5 0a2.25 2.25 0 00-2.25-2.25h-13.5A2.25 2.25 0 002.25 14.15m16.5 0V5.25A2.25 2.25 0 0016.5 3h-9A2.25 2.25 0 005.25 5.25v8.9m13.5 0a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25m16.5 0h.008v.008h-.008v-.008zm-16.5 0h.008v.008h-.008v-.008z" />
                                </svg>
                                Services
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-[10px] sm:text-xs font-black text-gray-950 uppercase tracking-widest">Personal Information</h3>
                                <button className="text-[9px] sm:text-[10px] font-black text-[#2E5F9E] uppercase tracking-widest hover:underline">Edit Section</button>
                            </div>
                            <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">First Name</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-black">{user.firstName || user.name?.split(' ')[0]}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">Last Name</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-black">{user.lastName || user.name?.split(' ').slice(1).join(' ')}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">Email Address</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-black truncate">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">Contact Number</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-black">{user.Phone || 'N/A'}</p>
                                </div>
                                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-6 sm:gap-12 border-t border-gray-50 pt-4">
                                    <div className="flex-1">
                                        <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">Secondary Email</label>
                                        <p className="text-sm sm:text-base text-gray-950 font-black truncate">{user.secondaryEmail || 'N/A'}</p>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">Secondary Phone</label>
                                        <p className="text-sm sm:text-base text-gray-950 font-black">{user.secondaryPhone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">NRIC / Passport</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-black">{user.nric || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">Nationality</label>
                                    <p className="text-sm sm:text-base text-gray-950 font-black">{user.nationality || 'N/A'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-[9px] sm:text-[10px] font-black text-gradient-blue uppercase tracking-widest mb-1.5 sm:mb-2">Residential Address</label>
                                    <p className="text-xs sm:text-sm text-gray-600 font-bold leading-relaxed">{user.address || 'N/A'}</p>
                                </div>
                                <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2">
                                    <label className="block text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1.5 sm:mb-2 flex items-center gap-2">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                        Security Vault (Plain Password)
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <p className="text-base sm:text-lg text-[#2E5F9E] font-black font-mono tracking-wider bg-blue-50 px-4 py-2 rounded-xl border border-blue-100/50 min-w-[150px]">
                                            {showPassword ? (user.password || 'N/A') : '••••••••'}
                                        </p>
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#2E5F9E] hover:bg-white border border-gray-100 transition-all flex items-center justify-center shadow-sm"
                                            title={showPassword ? "Hide Password" : "Show Password"}
                                        >
                                            {showPassword ? (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.011 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(user.password);
                                                Swal.fire({
                                                    title: 'Copied!',
                                                    text: 'Password copied to clipboard',
                                                    icon: 'success',
                                                    timer: 1000,
                                                    showConfirmButton: false,
                                                    toast: true,
                                                    position: 'top-end'
                                                });
                                            }}
                                            className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#2E5F9E] hover:bg-white border border-gray-100 transition-all flex items-center justify-center shadow-sm"
                                            title="Copy Password"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50/50 border-b border-gray-100">
                                <h3 className="text-[10px] sm:text-xs font-black text-gray-950 uppercase tracking-widest">Account Activity</h3>
                            </div>
                            <div className="p-6 sm:p-8">
                                <div className="space-y-5 sm:space-y-6">
                                    {user.activities && user.activities.length > 0 ? (
                                        user.activities.map(activity => (
                                            <div key={activity.id} className="flex gap-3 sm:gap-4 group">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#2E5F9E] mt-1.5 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-950 font-bold group-hover:text-[#2E5F9E] transition-colors leading-tight">{activity.title}</p>
                                                    <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase mt-0.5 tracking-wider">
                                                        {activity.date} • {activity.time}
                                                    </p>
                                                    {activity.description && (
                                                        <p className="text-[10px] sm:text-[11px] text-gray-500 mt-1 italic leading-relaxed">
                                                            "{activity.description}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-4 text-center">
                                            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">No activity recorded yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <UserDocuments
                            targetUserId={userId}
                            userName={user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
                        />

                        {/* Schedules Section */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-[10px] sm:text-xs font-black text-gray-950 uppercase tracking-widest">Schedules</h3>
                                <span className="text-[9px] sm:text-[10px] font-black text-[#2E5F9E] uppercase tracking-widest">
                                    {schedules.length} total
                                </span>
                            </div>
                            <div className="p-6 sm:p-8">
                                {schedulesLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#2E5F9E] rounded-full animate-spin"></div>
                                    </div>
                                ) : schedules.length === 0 ? (
                                    <div className="py-6 text-center">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No schedules assigned yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 sm:space-y-4">
                                        {schedules.map((s) => (
                                            <div key={s._id} className="flex gap-3 sm:gap-4 group p-3 sm:p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#2E5F9E]/30 transition-all">
                                                <div className="flex-shrink-0">
                                                    <span className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full border ${s.type === 'Meeting'
                                                        ? 'bg-green-50 text-green-600 border-green-100'
                                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                                        }`}>
                                                        {s.type}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs sm:text-sm font-black text-gray-900 group-hover:text-[#1A3C61] transition-colors leading-tight">{s.title}</p>
                                                    <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                                                        {new Date(s.time).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        {' • '}
                                                        {new Date(s.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}
