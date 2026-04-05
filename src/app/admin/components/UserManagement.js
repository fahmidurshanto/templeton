"use client";
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';


import { useAppContext } from '@/context/AppContext';
import { getFriendlyErrorMessage } from '@/lib/error-utils';



export default function UserManagement() {
    const router = useRouter();
    const { userList, setUserList, registerUser, updateUser, deleteUser, isLoadingUsers } = useAppContext();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        Phone: '',
        gender: 'male',
        nric: '',
        address: '',
        nationality: '',
        status: 'active',
        secondaryEmail: '',
        secondaryPhone: ''
    });

    const filtered = userList.filter(u =>
        (u.firstName + ' ' + u.lastName).toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
        const nameA = (a.firstName + ' ' + a.lastName).toLowerCase();
        const nameB = (b.firstName + ' ' + b.lastName).toLowerCase();
        return nameA.localeCompare(nameB);
    });

    const handleOpenModal = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            Phone: '',
            gender: 'male',
            nric: '',
            address: '',
            nationality: '',
            status: 'active',
            secondaryEmail: '',
            secondaryPhone: ''
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser(formData);
            // fetchAllUsers is called in AppContext via useEffect on userList change or manually
            Swal.fire({
                title: 'User Registered',
                text: 'A new partner has been registered successfully in the backend.',
                icon: 'success',
                confirmButtonColor: '#2E5F9E'
            });
        } catch (error) {
            Swal.fire({
                title: 'Registration Failed',
                text: getFriendlyErrorMessage(error),
                icon: 'error',
                confirmButtonColor: '#D33'
            });
        }
        handleCloseModal();
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: 'Remove Partner?',
            text: `Are you sure you want to delete ${name}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#2E5F9E',
            confirmButtonText: 'Yes, Remove Partner',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteUser(id);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'User has been removed from the server.',
                        icon: 'success',
                        timer: 1500,
                        showConfirmButton: false
                    });
                } catch (error) {
                    Swal.fire({
                        title: 'Delete Failed',
                        text: error.message,
                        icon: 'error',
                        confirmButtonColor: '#D33'
                    });
                }
            }
        });
    };



    return (
        <>
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate__animated animate__fadeIn">
                    <div className="bg-white rounded-[2rem] shadow-2xl border-2 border-[#2E5F9E]/30 w-full max-w-2xl overflow-hidden animate__animated animate__zoomIn flex flex-col max-h-[90vh]">
                        <div className="bg-gradient-blue py-4 sm:py-5 px-6 sm:px-8 flex items-center justify-between shrink-0">
                            <h3 className="text-black font-black uppercase tracking-widest text-[10px] sm:text-xs">
                                Partner Registration
                            </h3>
                            <button onClick={handleCloseModal} className="text-black hover:scale-110 transition-transform cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-6 sm:p-10">
                            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                                    {/* Personal Info */}
                                    <div className="space-y-6 sm:space-y-8">
                                        <h4 className="text-[10px] sm:text-[12px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Identity Details</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">First Name</label>
                                                <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Last Name</label>
                                                <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Gender</label>
                                                <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black cursor-pointer" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Nationality</label>
                                                <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="Singaporean" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">NRIC / Passport No.</label>
                                            <input required type="text" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="S1234567A" value={formData.nric} onChange={(e) => setFormData({ ...formData, nric: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Full Address</label>
                                            <textarea required rows={2} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black resize-none" placeholder="Enter full address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                    </div>

                                    {/* Contact & Security */}
                                    <div className="space-y-6 sm:space-y-8">
                                        <h4 className="text-[10px] sm:text-[12px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Account Credentials</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Account Status</label>
                                                <select className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black cursor-pointer" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                                    <option value="active">Active</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Security Key</label>
                                                <input required type="password" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="Min. 6 chars" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Corporate Email</label>
                                                <input required type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="partner@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Phone Number</label>
                                                <input required type="tel" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="+65 8888 8888" value={formData.Phone} onChange={(e) => setFormData({ ...formData, Phone: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-4">
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Secondary Email</label>
                                                <input type="email" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="Optional" value={formData.secondaryEmail} onChange={(e) => setFormData({ ...formData, secondaryEmail: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-gradient-blue mb-1.5 sm:mb-2">Secondary Phone</label>
                                                <input type="tel" className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-[#2E5F9E] outline-none transition-all font-bold text-black" placeholder="Optional" value={formData.secondaryPhone} onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 sm:py-5 bg-gradient-blue text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:shadow-blue-500/40 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer mt-2 sm:mt-4 text-xs sm:text-sm"
                                >
                                    Finalize Registration
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full animate__animated animate__fadeIn relative overflow-hidden">
                <div className="relative z-10 w-full space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 sm:px-0">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight leading-none mb-1">Partners</h1>
                            <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1 opacity-70">Privilege & Access Management</p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="cursor-pointer w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-gradient-blue text-black font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Register Partner
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative group px-1 sm:px-0">
                        <svg className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400 group-focus-within:text-[#2E5F9E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search partners..."
                            className="w-full pl-12 sm:pl-16 pr-6 py-3.5 sm:py-5 rounded-2xl bg-white border-2 border-gray-50 text-gray-950 font-bold text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#2E5F9E] transition-all shadow-xl"
                        />
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-gray-50/50">
                                        <th className="text-left px-4 sm:px-6 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Partner</th>

                                        <th className="text-left px-4 sm:px-6 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:table-cell">Joined</th>
                                        <th className="text-left px-4 sm:px-6 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden lg:table-cell">Passcode</th>
                                        <th className="text-right px-4 sm:px-6 py-4 sm:py-5 text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 relative">
                                    {isLoadingUsers ? (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4">
                                                    <div className="w-12 h-12 border-4 border-[#2E5F9E] border-t-transparent rounded-full animate-spin"></div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Syncing with Vault...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filtered.length > 0 ? (
                                        filtered.map((u) => (
                                            <tr
                                                key={u._id || u.id}
                                                onClick={() => router.push(`/admin/users/${u._id || u.id}`)}
                                                className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-4 sm:px-6 py-4 sm:py-5">
                                                    <div className="flex items-center gap-3 sm:gap-4">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-silver text-gray-700 flex items-center justify-center font-black text-[10px] sm:text-xs flex-shrink-0 shadow-sm border border-gray-100 uppercase">
                                                            {u.firstName ? (u.firstName[0] + (u.lastName ? u.lastName[0] : '')) : (u.name ? u.name[0] : 'U')}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs sm:text-sm text-gray-950 font-bold group-hover:text-[#1A3C61] transition-colors truncate">{u.firstName ? `${u.firstName} ${u.lastName}` : u.name}</p>
                                                            <p className="text-gray-400 text-[10px] sm:text-[11px] font-medium truncate">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 sm:px-6 py-4 text-gray-500 font-bold text-xs sm:text-sm hidden md:table-cell">{u.joined || new Date(u.createdAt).toLocaleDateString()}</td>
                                                <td className="px-4 sm:px-6 py-4 text-[#2E5F9E] font-black text-[10px] sm:text-xs hidden lg:table-cell font-mono truncate max-w-[120px]" title={u.password}>
                                                    {u.password || '••••••'}
                                                </td>
                                                <td className="px-4 sm:px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(u._id || u.id, u.firstName || u.name);
                                                            }}
                                                            className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-100 shadow-sm hover:shadow"
                                                            title="Delete User"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                                                    <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
                                                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-2.533-4.653 13.858 13.858 0 00-5.453-1.146 4.125 4.125 0 00-2.533 4.653 9.337 9.337 0 004.121.952 9.38 9.38 0 002.625-.372zm-7.243-7.243a4.125 4.125 0 015.656 0M9 10a1 1 0 112 0 1 1 0 01-2 0zm3.757-2.001a1 1 0 112 0 1 1 0 01-2 0zm-3-3a1 1 0 112 0 1 1 0 01-2 0z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em]">No Partners Found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
