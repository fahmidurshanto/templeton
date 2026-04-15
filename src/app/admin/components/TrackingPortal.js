"use client";
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { getFriendlyErrorMessage } from '@/lib/error-utils';
import DashboardModal from '../../../components/ui/DashboardModal';

const initialStages = [
    {
        id: 1,
        title: "Templeton Ascrow trust fund - London",
        status: "PROCESSED",
        date: "Past, 01, 2026",
        time: "02:56 PM",
        icon: "🛡️",
        remark: "Initial Funding: £2.5M GBP received. Documentation verified. Funds moved to domestic sterling account.",
        remarkLabel: "AML check complete and approved."
    },
    {
        id: 2,
        title: "Fidelity Ascrow Limited - Bristol",
        status: "PROCESSED",
        date: "Past, 30, 2026",
        time: "02:56 PM",
        icon: "🏦",
        remark: "Currency Conversion: Conversion from GBP to CHF initiated. Hedging contract executed. Funds transfer to Swiss bank confirmed.",
        remarkLabel: "Standard conversion rate applied."
    },
    {
        id: 3,
        title: "Ascrow Swiss Limited",
        status: "PROCESSED",
        date: "Past, 30, 2026",
        time: "03:21 PM",
        icon: "📦",
        remark: "CHF Ingestion: Funds arrived in CHF account. Cross-border conversion. Cross-border fees applied. Funds consolidated.",
        remarkLabel: "Swiss-specific reporting form 109 filed."
    },
    {
        id: 4,
        title: "Dominica Republic Ascrow Trust",
        status: "PROCESSED",
        date: "Past, 01, 2026",
        time: "03:21 PM",
        icon: "💰",
        remark: "Onshore to Offshore Transfer: Funds moved to tax-neutral domicile. Legal structure check completed.",
        remarkLabel: "Ascrow agreement amendment #1 applied."
    },
    {
        id: 5,
        title: "Templeton (India)",
        status: "PROCESSED",
        date: "Past, 01, 2026",
        time: "02:56 PM",
        icon: "⚖️",
        remark: "Sub-Project Allocation: Funds allocated for Bangalore tech center expansion. Compliance with Indian FEMA regulations confirmed.",
        remarkLabel: "Local director approval received."
    },
    {
        id: 6,
        title: "Ascrow (UAE) Limited",
        status: "PROCESSED",
        date: "Past, 30, 2026",
        time: "02:56 PM",
        icon: "🏢",
        remark: "Final Allocation: Funds moved to UAE Ascrow for real estate JV project in Dubai. Final stage before BVI consolidation.",
        remarkLabel: "UAE Central Bank clearance obtained."
    },
    {
        id: 7,
        title: "BVI Ascrow Limited",
        status: "ACTIVE",
        label: "LIVE",
        date: "MAR 30, 2026",
        time: "02:56 PM",
        icon: "🏛️",
        current: true,
        remark: "Current Balance: 2.15M AED. Pending allocation for Dubai real estate JV. Final KYC verification for new partners in progress.",
        remarkLabel: "Urgent action needed - Signator update required."
    }
];

export default function TrackingPortal() {
    const [viewMode, setViewMode] = useState('detailed'); // 'simple' or 'detailed'
    const [stages, setStages] = useState(initialStages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState(null);
    const [globalStages, setGlobalStages] = useState([]);
    const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
    const [newGlobalName, setNewGlobalName] = useState('');
    const [editingGlobal, setEditingGlobal] = useState(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedUserName, setSelectedUserName] = useState('');
    const [generatingQR, setGeneratingQR] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [transactionInfo, setTransactionInfo] = useState({
        id: "HAF-49382",
        total: "[Confidential]",
        lastUpdate: new Date().toLocaleString()
    });

    useEffect(() => {
        fetchGlobalStages();
        fetchAllUsers();
        fetchLiveTracking();
    }, []);

    const fetchLiveTracking = async () => {
        try {
            const res = await api.get('/stage/live');
            if (res.data.success) {
                setStages(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch live tracking:', err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await api.get('/auth/users');
            if (res.data.success) {
                setAllUsers(res.data.users || []);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        }
    };

    const fetchGlobalStages = async () => {
        try {
            const res = await api.get('/stage/getall');
            if (res.data.success) {
                setGlobalStages(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch global stages:', err);
        }
    };

    const handleGenerateQR = async () => {
        if (!selectedUserId) {
            Swal.fire('Error', 'Please select a user first', 'error');
            return;
        }
        
        setGeneratingQR(true);
        try {
            const res = await api.post(`/stage/generateqrcode/${selectedUserId}`);
            if (res.data.success) {
                setQrCodeData(res.data);
                setIsQRModalOpen(true);
            }
        } catch (error) {
            Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
        } finally {
            setGeneratingQR(false);
        }
    };

    const handleDownloadQR = () => {
        if (!qrCodeData?.qrCodeImage) return;
        const link = document.createElement('a');
        link.href = qrCodeData.qrCodeImage;
        link.download = `verification-qr-${selectedUserName || selectedUserId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const slidesPerView = 5;
    const maxIndex = Math.max(0, stages.length - slidesPerView);

    const handleCarouselDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(stages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state optimistically
        setStages(items);

        try {
            await api.put('/stage/live', { stages: items });
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                title: 'Live tracking order saved'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to save new order', 'error');
            fetchLiveTracking(); // Revert to server state
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const goToSlide = (index) => {
        setCurrentIndex(Math.min(index, maxIndex));
    };

    const handleAddGlobal = async () => {
        try {
            await api.post('/stage/add', { name: newGlobalName });
            Swal.fire('Added', 'Global stage created.', 'success');
            setNewGlobalName('');
            fetchGlobalStages();
        } catch (error) {
            Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
        }
    };

    const handleEditGlobal = async (oldName) => {
        const { value: newName } = await Swal.fire({
            title: 'Edit Global Stage',
            input: 'text',
            inputValue: oldName,
            showCancelButton: true
        });

        if (newName && newName !== oldName) {
            try {
                await api.put('/stage/edit', { oldName, newName });
                Swal.fire('Updated', 'Global stage updated.', 'success');
                fetchGlobalStages();
            } catch (error) {
                Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
            }
        }
    };

    const handleGlobalDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(globalStages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state optimistically
        setGlobalStages(items);

        try {
            await api.put('/stage/reorder', { stages: items });
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                title: 'Master list reordered'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to save new order', 'error');
            fetchGlobalStages(); // Revert to server state
        }
    };

    const handleDeleteGlobal = async (name) => {
        const result = await Swal.fire({
            title: 'Delete Global Stage?',
            text: `Remove "${name}" from the system master list?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            try {
                await api.delete('/stage/delete', { data: { name } });
                Swal.fire('Deleted', 'Global stage removed.', 'success');
                fetchGlobalStages();
            } catch (error) {
                Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
            }
        }
    };

    // Form state for Add/Edit
    const [formData, setFormData] = useState({
        title: '', status: 'PROCESSED', date: '', time: '', icon: '🛡️', remark: '', remarkLabel: '', label: '', current: false
    });

    const handleOpenModal = (stage = null) => {
        if (stage) {
            setEditingStage(stage);
            setFormData({ ...stage });
        } else {
            setEditingStage(null);
            setFormData({ title: '', status: 'PROCESSED', date: '', time: '', icon: '🛡️', remark: '', remarkLabel: '', label: '', current: false });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        let newStages;
        if (editingStage) {
            newStages = stages.map(s => s.id === editingStage.id ? { ...formData, id: s.id } : s);
        } else {
            const newId = stages.length > 0 ? Math.max(...stages.map(s => s.id)) + 1 : 1;
            newStages = [...stages, { ...formData, id: newId }];
        }

        setStages(newStages);
        setIsModalOpen(false);

        try {
            await api.put('/stage/live', { stages: newStages });
        } catch (error) {
            Swal.fire('Error', 'Failed to save stage changes to server', 'error');
            fetchLiveTracking();
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Stage?',
            text: 'Are you sure you want to remove this stage from live tracking?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            const newStages = stages.filter(s => s.id !== id);
            setStages(newStages);
            try {
                await api.put('/stage/live', { stages: newStages });
                Swal.fire('Deleted', 'Stage removed.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete stage from server', 'error');
                fetchLiveTracking();
            }
        }
    };

    return (
        <>
            <div className="w-full space-y-8 animate__animated animate__fadeIn">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase mb-2">
                            Funds Tracking Portal
                        </h1>
                        <p className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-widest opacity-80">
                            Secure & Transparent Fund Flow Management
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <button 
                            onClick={() => setIsGlobalModalOpen(true)}
                            className="bg-white text-black border-2 border-black px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            ⚙️ Master List
                        </button>
                        <button 
                            onClick={() => handleOpenModal()}
                            className="bg-black text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            <span>+</span> Add Stage
                        </button>
                        <button 
                            onClick={() => setIsQRModalOpen(true)}
                            className="flex items-center gap-3 bg-gradient-gold text-black px-5 py-3 rounded-full shadow-lg transition-all hover:brightness-105 active:scale-95"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            <span className="text-sm font-black uppercase tracking-wider">QR Portal</span>
                        </button>
                        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-lg border border-gray-100 transition-all">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse ring-4 ring-green-100"></span>
                            <span className="text-sm font-black text-gray-700 uppercase tracking-wider">System Online</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-gray-50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-bl-full -z-0 opacity-50"></div>
                    
                    <h2 className="text-xs font-black text-gray-950 uppercase tracking-[0.3em] mb-8 relative z-10 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-[#D4AF37]"></span>
                        Live Ascrow Trust Fund Tracking {viewMode === 'detailed' && '& Detailed Activity Log'}
                    </h2>

                    {/* Carousel Container */}
                    <DragDropContext onDragEnd={handleCarouselDragEnd}>
                        <div className="relative z-10">
                            <div className="overflow-hidden">
                                <Droppable droppableId="carousel-stages" direction="horizontal">
                                    {(provided) => (
                                        <div 
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex transition-transform duration-500 ease-out"
                                            style={{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }}
                                        >
                                            {stages.map((stage, idx) => (
                                                <Draggable key={stage.id} draggableId={String(stage.id)} index={idx}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className="w-1/5 flex-shrink-0 px-2"
                                                        >
                                                            <div className={`rounded-2xl border p-4 transition-all duration-300 h-full relative ${
                                                                stage.current 
                                                                    ? 'bg-gradient-to-br from-green-50 to-white border-green-200 shadow-lg' 
                                                                    : 'bg-gray-50 border-gray-100'
                                                            } ${snapshot.isDragging ? 'shadow-2xl scale-105 border-[#D4AF37] z-50 bg-white ring-4 ring-[#D4AF37]/10' : ''}`}>
                                                                <div className="flex flex-col items-center text-center h-full">
                                                                    {/* Drag Handle */}
                                                                    <div 
                                                                        {...provided.dragHandleProps}
                                                                        className="absolute top-2 left-2 text-gray-300 hover:text-[#D4AF37] cursor-grab active:cursor-grabbing p-1"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                                                                        </svg>
                                                                    </div>

                                                                    {/* Icon */}
                                                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-3 transition-all duration-500 shadow-md
                                                                        ${stage.current ? 'bg-gradient-gold text-black animate-pulse ring-4 ring-[#D4AF37]/20' : 'bg-white text-gray-400'}
                                                                    `}>
                                                                        {stage.icon}
                                                                    </div>

                                                                    {/* Title & Status */}
                                                                    <p className={`text-xs font-black uppercase tracking-tight mb-2 leading-tight ${stage.current ? 'text-gray-950' : 'text-gray-600'}`}>
                                                                        {stage.title}
                                                                    </p>
                                                                    
                                                                    <span className={`inline-block text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-widest mb-2
                                                                        ${stage.current ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}
                                                                    `}>
                                                                        {stage.status}
                                                                    </span>
                                                                    {stage.label && (
                                                                        <span className="inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700 tracking-widest mb-2">
                                                                            {stage.label}
                                                                        </span>
                                                                    )}

                                                                    {/* Date/Time */}
                                                                    <p className={`text-[9px] font-black uppercase tracking-wider ${stage.current ? 'text-gray-600' : 'text-gray-400'}`}>
                                                                        {stage.date}
                                                                    </p>
                                                                    <p className={`text-[9px] font-black tracking-wider ${stage.current ? 'text-gray-600' : 'text-gray-400 opacity-60'}`}>
                                                                        {stage.time}
                                                                    </p>

                                                                    {/* Action Buttons */}
                                                                    <div className="flex gap-2 mt-3">
                                                                        <button onClick={() => handleOpenModal(stage)} className="w-7 h-7 rounded-full bg-white shadow border border-gray-100 flex items-center justify-center text-[10px] hover:bg-gray-50 transition-all">✏️</button>
                                                                        <button onClick={() => handleDelete(stage.id)} className="w-7 h-7 rounded-full bg-white shadow border border-red-50 flex items-center justify-center text-[10px] hover:bg-red-50 text-red-500 transition-all">🗑️</button>
                                                                    </div>

                                                                    {/* Detailed Remark Card */}
                                                                    {viewMode === 'detailed' && (
                                                                        <div className={`w-full mt-3 p-2 rounded-lg text-left ${
                                                                            stage.current 
                                                                                ? 'bg-green-100/50' 
                                                                                : 'bg-white/50'}
                                                                        `}>
                                                                            <p className={`text-[9px] leading-relaxed font-bold ${stage.current ? 'text-green-900' : 'text-gray-600'}`}>
                                                                                {stage.remark}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>

                            {/* Navigation Arrows */}
                            {stages.length > slidesPerView && (
                                <>
                                    <button 
                                        onClick={prevSlide}
                                        disabled={currentIndex === 0}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={nextSlide}
                                        disabled={currentIndex >= maxIndex}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </DragDropContext>

                    {/* Dot Indicators */}
                    {stages.length > slidesPerView && (
                        <div className="flex justify-center items-center gap-3 mt-6">
                            <button 
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex gap-2">
                                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => goToSlide(idx)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            idx === currentIndex 
                                                ? 'bg-[#D4AF37] w-8' 
                                                : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                            <button 
                                onClick={nextSlide}
                                disabled={currentIndex >= maxIndex}
                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all disabled:opacity-50"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Footer Section - Transaction Details */}
                    <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
                        {/* Legend */}
                        <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Processed</span>
                            </div>
                            
                            <button 
                                onClick={() => setViewMode(v => v === 'simple' ? 'detailed' : 'simple')}
                                className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
                            >
                                Toggle {viewMode === 'simple' ? 'Detailed' : 'Simple'} View
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-gold text-black px-4 py-2 rounded-full">
                                <span className="text-xs font-black uppercase tracking-widest">
                                    {Math.min(currentIndex * slidesPerView + 1, stages.length)}-{Math.min((currentIndex + 1) * slidesPerView, stages.length)} / {stages.length}
                                </span>
                            </div>
                        </div>

                        {/* Transaction Info Box */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl min-w-full md:min-w-[300px] flex flex-col gap-2 relative overflow-hidden group/info">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -z-0 rounded-bl-full"></div>
                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID:</span>
                                    <input 
                                        className="text-[11px] font-black text-gray-900 uppercase border-none focus:ring-0 p-0 text-right bg-transparent w-32 cursor-pointer"
                                        value={transactionInfo.id}
                                        onChange={(e) => setTransactionInfo({...transactionInfo, id: e.target.value})}
                                    />
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ascrow Total Amount:</span>
                                    <input 
                                        className="text-[11px] font-black text-gray-900 uppercase border-none focus:ring-0 p-0 text-right bg-transparent w-32 cursor-pointer"
                                        value={transactionInfo.total}
                                        onChange={(e) => setTransactionInfo({...transactionInfo, total: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Last Stage Update:</span>
                                    <p className="text-[11px] font-black text-gray-900 uppercase leading-snug">
                                        {stages.find(s => s.current)?.title || 'No Active Stage'} - 
                                        <span className="text-[#D4AF37] ml-1">{transactionInfo.lastUpdate}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stage Form Modal - Using Dynamic DashboardModal Component */}
            <DashboardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStage ? 'Edit Ascrow Stage' : 'Add New Ascrow Stage'}
                icon={<span>📑</span>}
                footer={
                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)} 
                            className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="px-6 py-2 bg-black text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
                        >
                            Save Stage
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Stage Title</label>
                            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-bold text-black placeholder:text-gray-400" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Status</label>
                                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-bold text-black">
                                    <option>PROCESSED</option>
                                    <option>ACTIVE</option>
                                    <option>UPCOMING</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Icon (Emoji)</label>
                                <input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-bold text-black placeholder:text-gray-400" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Date</label>
                                <input placeholder="Past, 01, 2026" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-bold text-black placeholder:text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Time</label>
                                <input placeholder="02:56 PM" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-bold text-black placeholder:text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Main Remark</label>
                            <textarea rows={3} value={formData.remark} onChange={e => setFormData({...formData, remark: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-bold resize-none text-black placeholder:text-gray-400" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Remark Label</label>
                            <input value={formData.remarkLabel} onChange={e => setFormData({...formData, remarkLabel: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm font-bold text-black placeholder:text-gray-400" />
                        </div>
                        <div className="flex items-center gap-4 py-2">
                            <input type="checkbox" id="current" checked={formData.current} onChange={e => setFormData({...formData, current: e.target.checked})} className="w-5 h-5 rounded border-gray-100 text-[#D4AF37] focus:ring-[#D4AF37]/20" />
                            <label htmlFor="current" className="text-[11px] font-black text-gray-600 uppercase tracking-widest cursor-pointer">Set as Current Location</label>
                        </div>
                    </div>
                </div>
            </DashboardModal>

            {/* Global Stage Manager Modal */}
            <DashboardModal
                isOpen={isGlobalModalOpen}
                onClose={() => setIsGlobalModalOpen(false)}
                title="Master Stage List Configuration"
                icon={<span>⚙️</span>}
            >
                <div className="space-y-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                        Define the master global stages that can be assigned to partners. These serve as templates for user journeys.
                    </p>
                    
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 px-4 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm font-bold text-black focus:border-[#D4AF37] outline-none"
                            placeholder="New Stage Name..."
                            value={newGlobalName}
                            onChange={(e) => setNewGlobalName(e.target.value)}
                        />
                        <button 
                            onClick={handleAddGlobal}
                            className="px-4 py-2 bg-gradient-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-md"
                        >
                            Add
                        </button>
                    </div>

                    <div className="space-y-4 mt-6">
                        <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">All Global Stages (Drag to Reorder)</h4>
                        
                        <DragDropContext onDragEnd={handleGlobalDragEnd}>
                            <Droppable droppableId="global-stages">
                                {(provided) => (
                                    <div 
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="max-h-[350px] overflow-y-auto pr-2 custom-scrollbar space-y-2"
                                    >
                                        {globalStages.length === 0 ? (
                                            <p className="text-[10px] text-gray-300 italic py-4 text-center">No global stages defined.</p>
                                        ) : (
                                            globalStages.map((name, i) => (
                                                <Draggable key={name} draggableId={name} index={i}>
                                                    {(provided, snapshot) => (
                                                        <div 
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${
                                                                snapshot.isDragging 
                                                                    ? 'bg-white border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/10' 
                                                                    : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-100'
                                                            }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div 
                                                                    {...provided.dragHandleProps}
                                                                    className="text-gray-300 hover:text-[#D4AF37] cursor-grab active:cursor-grabbing"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                                                                    </svg>
                                                                </div>
                                                                <span className="text-xs font-black text-gray-800">{name}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={() => handleEditGlobal(name)} className="text-gray-400 hover:text-[#D4AF37]">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                </button>
                                                                <button onClick={() => handleDeleteGlobal(name)} className="text-gray-400 hover:text-red-500">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>
            </DashboardModal>

            {/* QR Code Portal Modal */}
            <DashboardModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                title="QR Code Generator"
                icon={<span>📱</span>}
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsQRModalOpen(false)} className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
                            Close
                        </button>
                        {qrCodeData && (
                            <button onClick={handleDownloadQR} className="px-6 py-2 bg-gradient-gold text-black rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download QR
                            </button>
                        )}
                    </div>
                }
            >
                {!qrCodeData ? (
                    <div className="space-y-6">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            Generate a QR code for a user to scan and enable stage visibility access.
                        </p>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Select User</label>
                            <select 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-black focus:ring-2 focus:ring-[#D4AF37]/20 outline-none"
                                value={selectedUserId}
                                onChange={(e) => {
                                    const user = allUsers.find(u => u._id === e.target.value);
                                    setSelectedUserId(e.target.value);
                                    setSelectedUserName(user ? `${user.firstName} ${user.lastName}` : '');
                                }}
                            >
                                <option value="">-- Select a user --</option>
                                {allUsers.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.firstName} {user.lastName} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                onClick={handleGenerateQR}
                                disabled={generatingQR || !selectedUserId}
                                className="flex-1 py-3 bg-gradient-gold text-black rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {generatingQR ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                        </svg>
                                        Generate QR Code
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="text-center mb-6">
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                QR Code for: <span className="text-[#D4AF37]">{selectedUserName}</span>
                            </p>
                            <p className="text-[10px] text-gray-400 mt-1">Scan with user's device to grant stage visibility</p>
                        </div>
                        
                        <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-xl mb-4">
                            <img src={qrCodeData.qrCodeImage} alt="QR Code" className="w-64 h-64" />
                        </div>
                        
                        <div className="w-full p-3 bg-gray-50 rounded-xl mb-4">
                            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Encoded URL:</p>
                            <p className="text-xs text-gray-600 break-all font-mono">{qrCodeData.qrCodeUrl}</p>
                        </div>
                        
                        <button 
                            onClick={() => setQrCodeData(null)}
                            className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider hover:underline"
                        >
                            Generate for another user
                        </button>
                    </div>
                )}
            </DashboardModal>


        </>
    );
}
