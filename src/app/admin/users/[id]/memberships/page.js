"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import api from '@/lib/api';
import NotFound from '@/components/ui/NotFound';
import { useAppContext } from '@/context/AppContext';

const AVAILABLE_MEMBERSHIPS = [
    {
        name: 'AMIHAN DEL SOL',
        type: 'primary',
        status: 'active',
        benefits: ['Dedicated Asset Management', 'Direct Private Equity Access', 'Exclusive Concierge Services']
    },
    {
        name: 'MTF (IAC)',
        type: 'primary',
        status: 'inactive',
        benefits: ['Institutional Advisory', 'Trade Compliance Support', 'Risk Allocation Reports']
    },
    {
        name: 'VACATION DOWN UNDER',
        type: 'primary',
        status: 'inactive',
        benefits: ['Luxury Travel Desk', 'Global Resort Access', 'Premium Leisure Planning']
    },
    {
        name: 'NIXDORF - AX VENTURES LIMITED',
        type: 'primary',
        status: 'inactive',
        benefits: ['Venture Capital Insight', 'Seed Phase Opportunities', 'Strategic Tech Integration']
    },
    {
        name: 'ASIAN TRAVEL CLUB',
        type: 'primary',
        status: 'inactive',
        benefits: ['Regional Network Perks', 'Exclusive Gateway Access', 'Bespoke Itinerary Curation']
    },
    {
        name: 'TEMPLETON TRUSTEE',
        type: 'third_party',
        status: 'inactive',
        benefits: ['Asset Liquidation Planning', 'Trustee Oversight', 'Fiduciary Compliance']
    },
    {
        name: 'AX HOLDINGS LIMITED',
        type: 'third_party',
        status: 'inactive',
        benefits: ['Portfolio Management', 'Holding Optimization', 'Group Strategy Access']
    },
    {
        name: 'ASIALINX PTE LTD',
        type: 'third_party',
        status: 'inactive',
        benefits: ['Cross-Border Facilitation', 'Logistics Optimization', 'Regional Trade Advisory']
    },
    {
        name: 'AX VENTURES LIMITED',
        type: 'third_party',
        status: 'inactive',
        benefits: ['Emerging Market Access', 'Direct Investment Rounds', 'Innovation Mentorship']
    },
    {
        name: 'NIXDORF PTE LTD',
        type: 'third_party',
        status: 'inactive',
        benefits: ['Market Intelligence', 'Operations Consulting', 'Local Implementation Support']
    },
    {
        name: 'NIXDAX PTE LTD',
        type: 'third_party',
        status: 'inactive',
        benefits: ['Digital Asset Strategy', 'Platform Synergies', 'Next-Gen FinTech Access']
    }
];

// Edit Status Popup Modal
function EditStatusModal({ tier, globalIdx, onClose, onConfirm }) {
    const newStatus = tier.status === 'active' ? 'inactive' : 'active';
    const groupLabel = tier.type === 'primary' ? 'Primary' : 'Marketing Agent';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal card */}
            <div
                className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm mx-4 p-7 flex flex-col gap-5 animate-fadeInScale"
                onClick={e => e.stopPropagation()}
            >
                {/* Icon + title */}
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${newStatus === 'active' ? 'bg-green-50' : 'bg-gray-100'}`}>
                        {newStatus === 'active' ? (
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{groupLabel}</p>
                        <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase leading-tight">{tier.name}</h3>
                    </div>
                </div>

                {/* Message */}
                <p className="text-sm text-gray-600 leading-relaxed">
                    Change membership status from{' '}
                    <span className={`font-bold capitalize ${tier.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                        {tier.status}
                    </span>{' '}
                    to{' '}
                    <span className={`font-bold capitalize ${newStatus === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
                        {newStatus}
                    </span>
                    ?
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(newStatus)}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all duration-200 shadow-sm ${newStatus === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                    >
                        Set <span className="capitalize">{newStatus}</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
                .animate-fadeInScale {
                    animation: fadeInScale 0.18s ease-out both;
                }
            `}</style>
        </div>
    );
}

// Add Membership Modal
function AddMembershipModal({ available, currentTiers, onClose, onAdd }) {
    const [mode, setMode] = useState('select'); // 'select' | 'custom'
    const [selectedMembership, setSelectedMembership] = useState('');
    const [customName, setCustomName] = useState('');
    const [customType, setCustomType] = useState('primary');

    const unusedTiers = available.filter(avail => !currentTiers.find(curr => curr.name === avail.name));

    const handleConfirm = () => {
        if (mode === 'select') {
            const membership = available.find(m => m.name === selectedMembership);
            if (membership) {
                onAdd(membership);
            }
        } else {
            if (customName.trim()) {
                onAdd({
                    name: customName.trim(),
                    type: customType,
                    status: 'active',
                    benefits: []
                });
            }
        }
    };

    const isAddDisabled = mode === 'select' ? !selectedMembership : !customName.trim();

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md mx-4 p-8 flex flex-col gap-6 animate-fadeInScale" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase">Add Membership</h3>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mt-1">Select or create a new partnership</p>
                    </div>
                </div>

                {/* Mode toggle tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                    <button
                        onClick={() => setMode('select')}
                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-lg transition-all ${mode === 'select' ? 'bg-white shadow-sm text-[#D4AF37]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        From List
                    </button>
                    <button
                        onClick={() => setMode('custom')}
                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-lg transition-all ${mode === 'custom' ? 'bg-white shadow-sm text-[#D4AF37]' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Custom
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {mode === 'select' ? (
                        <div className="flex flex-col gap-2 animate__animated animate__fadeIn animate__faster">
                            <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Available Partnerships</label>
                            <select
                                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#D4AF37] outline-none transition-all cursor-pointer appearance-none"
                                value={selectedMembership}
                                onChange={e => setSelectedMembership(e.target.value)}
                            >
                                <option value="" disabled>Select a membership tier</option>
                                {unusedTiers.map(t => (
                                    <option key={t.name} value={t.name}>{t.name} ({t.type === 'primary' ? 'Primary' : 'Marketing Agent'})</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 animate__animated animate__fadeIn animate__faster">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Custom Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter membership name"
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#D4AF37] outline-none transition-all"
                                    value={customName}
                                    onChange={e => setCustomName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Partnership Type</label>
                                <select
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-[#D4AF37] outline-none transition-all cursor-pointer appearance-none"
                                    value={customType}
                                    onChange={e => setCustomType(e.target.value)}
                                >
                                    <option value="primary">Primary</option>
                                    <option value="third_party">Marketing Agent</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-3 mt-2">
                    <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all duration-200">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isAddDisabled}
                        className="flex-1 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-white bg-[#D4AF37] hover:bg-[#C5A030] shadow-md shadow-[#D4AF37]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95) translateY(8px); }
                    to   { opacity: 1; transform: scale(1)    translateY(0); }
                }
                .animate-fadeInScale {
                    animation: fadeInScale 0.18s ease-out both;
                }
            `}</style>
        </div>
    );
}

export default function MembershipsPage() {
    const params = useParams();
    const userId = params.id;
    const { user } = useAppContext();
    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [editTarget, setEditTarget] = useState(null); // { tier, globalIdx }
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchTiers = async () => {
            try {
                const response = await api.get(`/user/memberships/${userId}`);
                if (response.data.success) {
                    setTiers(response.data.data);
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    setIsNotFound(true);
                } else {
                    Swal.fire({
                        title: 'Error Loading Data',
                        text: error.response?.data?.message || error.message || 'Could not fetch memberships',
                        icon: 'error',
                        confirmButtonColor: '#D33'
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        if (userId && user && (user.role === 'admin' || user.role === 'superadmin')) {
            fetchTiers();
        } else if (!user) {
            // wait for user to load
        } else {
            setLoading(false);
        }
    }, [userId, user]);

    // Called when user confirms the status change in the popup
    const handleStatusChange = async (newStatus) => {
        const { tier } = editTarget;
        try {
            const response = await api.patch(`/user/memberships/${userId}`, {
                tierName: tier.name,
                status: newStatus
            });

            if (response.data.success) {
                setTiers(response.data.data);
                Swal.fire({
                    title: 'Status Updated',
                    text: 'The membership status has been changed successfully.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Status Update Failed',
                text: error.response?.data?.message || 'An error occurred while changing the status.',
                icon: 'error',
                confirmButtonColor: '#D33'
            });
        } finally {
            setEditTarget(null);
        }
    };

    const handleAddMembership = async (membership) => {
        try {
            const membershipWithActiveStatus = { ...membership, status: 'active' };
            const response = await api.post(`/user/memberships/${userId}`, {
                membership: membershipWithActiveStatus
            });

            if (response.data.success) {
                setTiers(response.data.data);
                Swal.fire({
                    title: 'Membership Added!',
                    text: `${membership.name} has been added to this profile.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Failed to Add',
                text: error.response?.data?.message || 'An error occurred while adding the membership.',
                icon: 'error',
                confirmButtonColor: '#D33'
            });
        } finally {
            setIsAddModalOpen(false);
        }
    };

    const handleRemoveMembership = async (tierName) => {
        Swal.fire({
            title: 'Remove Partnership?',
            text: `Are you sure you want to completely remove ${tierName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#D4AF37',
            confirmButtonText: 'Yes, Remove It',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await api.delete(`/user/memberships/${userId}/${encodeURIComponent(tierName)}`);
                    if (response.data.success) {
                        setTiers(response.data.data);
                        Swal.fire({
                            title: 'Removed!',
                            text: 'The membership ties have been severed.',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Removal Failed',
                        text: error.response?.data?.message || 'An error occurred while attempting removal.',
                        icon: 'error',
                        confirmButtonColor: '#D33'
                    });
                }
            }
        });
    };

    const renderTierCard = (tier, globalIdx) => (
        <div key={globalIdx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex items-center justify-between px-6 py-5 w-full mb-4 hover:shadow-md hover:border-gray-200 transition-all duration-300 group">
            <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase leading-tight">{tier.name}</h3>

            {/* Status badge + edit icon */}
            <div className="flex items-center gap-2 shrink-0">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${tier.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    {tier.status}
                </span>

                {/* Edit pencil icon */}
                <button
                    onClick={() => setEditTarget({ tier, globalIdx })}
                    title="Change status"
                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-[#D4AF37] hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-all duration-200"
                >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l-4 1 1-4 9.293-9.293a1 1 0 011.414 0l2.586 2.586a1 1 0 010 1.414L9 13z" />
                    </svg>
                </button>

                {/* Delete trash icon */}
                <button
                    onClick={() => handleRemoveMembership(tier.name)}
                    title="Remove membership"
                    className="w-7 h-7 ml-1 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all duration-200"
                >
                    <svg className="w-3.5 h-3.5 cursor-pointer text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );

    const primaryTiers = tiers.map((t, i) => ({ t, i })).filter(({ t }) => t.type === 'primary');
    const thirdPartyTiers = tiers.map((t, i) => ({ t, i })).filter(({ t }) => t.type === 'third_party');

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isNotFound) {
        return <NotFound title="User Not Found" message="The user you are looking for does not exist in our records." />;
    }

    return (
        <div className="w-full h-full flex flex-col items-center relative overflow-visible pb-20">
            {/* Header Section */}
            <div className="w-full text-center py-8 md:py-14 mb-10 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[30vh]">
                <div className="relative z-10 w-full px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter text-gradient-gold bg-clip-text uppercase">
                        Partnerships
                    </h1>
                    <p className="text-gray-500 text-base md:text-xl font-medium max-w-2xl mx-auto">
                        A dual-categorized overview of your primary entities and strategic third-party alliances.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-gold text-black font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-gold-500/30 hover:scale-[1.02] transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Membership
                        </button>
                    </div>
                </div>
            </div>

            {/* Side-by-Side Content Section */}
            <div className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 animate__animated animate__fadeInUp relative z-10">

                {/* Primary Column */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-[3px] w-12 bg-[#D4AF37] rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-[0.2em] uppercase">
                            Primary
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    <div className="flex flex-col">
                        {primaryTiers.map(({ t, i }) => renderTierCard(t, i))}
                    </div>
                </div>

                {/* Marketing Agents Column */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="h-[3px] w-12 bg-gray-400 rounded-full"></div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-[0.2em] uppercase">
                            Marketing Agents
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                    </div>
                    <div className="flex flex-col">
                        {thirdPartyTiers.map(({ t, i }) => renderTierCard(t, i))}
                    </div>
                </div>
            </div>

            <div className="w-full text-center py-20 mt-10">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.4em] opacity-60">Hutchinson APAC Limited • Privilege Redefined • Since 2025</p>
            </div>

            {/* Edit Status Modal */}
            {editTarget && (
                <EditStatusModal
                    tier={editTarget.tier}
                    globalIdx={editTarget.globalIdx}
                    onClose={() => setEditTarget(null)}
                    onConfirm={handleStatusChange}
                />
            )}

            {/* Add Membership Modal */}
            {isAddModalOpen && (
                <AddMembershipModal
                    available={AVAILABLE_MEMBERSHIPS}
                    currentTiers={tiers}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddMembership}
                />
            )}
        </div>
    );
}
