"use client";
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '@/lib/api';
import Swal from 'sweetalert2';
import { getFriendlyErrorMessage } from '@/lib/error-utils';
import DashboardModal from '@/components/ui/DashboardModal';

export default function UserStageManagement({ userId, userName }) {
    const [stages, setStages] = useState([]);
    const [globalStages, setGlobalStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState(null);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [generatingQR, setGeneratingQR] = useState(false);

    const [formData, setFormData] = useState({
        stage: '',
        sequence: 1,
        description: '',
        remark: '',
        remarkLabel: '',
        status: 'upcoming',
        time: new Date().toISOString()
    });

    const handleGenerateQR = async () => {
        setGeneratingQR(true);
        try {
            const res = await api.post(`/stage/generateqrcode/${userId}`);
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
        link.download = `verification-qr-${userName || userId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (userId) {
            fetchUserStages();
            fetchGlobalStages();
        }
    }, [userId]);

    const fetchUserStages = async () => {
        try {
            const res = await api.get(`/stage/user/${userId}`);
            if (res.data.success) {
                const fetchedStages = res.data.stage || [];
                setStages(fetchedStages.sort((a, b) => a.sequence - b.sequence));
            }
        } catch (err) {
            console.error('Failed to fetch user stages:', err);
        } finally {
            setLoading(false);
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

    const handleOpenModal = (stage = null) => {
        if (stage) {
            setEditingStage(stage);
            setFormData({
                stage: stage.name || '',
                sequence: stage.sequence || 1,
                description: stage.description || '',
                remark: stage.remark || '',
                remarkLabel: stage.remarkLabel || '',
                status: stage.status || 'upcoming',
                time: stage.time ? new Date(stage.time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
            });
        } else {
            setEditingStage(null);
            setFormData({
                stage: globalStages[0] || '',
                sequence: stages.length + 1,
                description: '',
                remark: '',
                remarkLabel: '',
                status: 'upcoming',
                time: new Date().toISOString().slice(0, 16)
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingStage) {
                // Edit existing stage
                await api.put(`/stage/user/${userId}?stage=${editingStage._id}`, formData);
                Swal.fire('Updated', 'User stage has been updated.', 'success');
            } else {
                // Add new stage
                await api.post(`/stage/user/${userId}`, formData);
                Swal.fire('Added', 'New stage assigned to user.', 'success');
            }
            fetchUserStages();
            setIsModalOpen(false);
        } catch (error) {
            Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(stages);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Update local state optimistically
        const updatedStages = items.map((s, idx) => ({ ...s, sequence: idx + 1 }));
        setStages(updatedStages);

        try {
            await api.put(`/stage/user/${userId}/reorder`, {
                stages: updatedStages.map(s => s._id)
            });
            Swal.fire({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                icon: 'success',
                title: 'Order updated'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to save new order', 'error');
            fetchUserStages(); // Revert to server state
        }
    };

    const handleDelete = async (stageId) => {
        const result = await Swal.fire({
            title: 'Delete Stage?',
            text: 'Are you sure you want to remove this stage from the user?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/stage/user/${userId}?stage=${stageId}`);
                Swal.fire('Deleted', 'Stage removed.', 'success');
                fetchUserStages();
            } catch (error) {
                Swal.fire('Error', getFriendlyErrorMessage(error), 'error');
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 className="text-[10px] sm:text-xs font-black text-gray-950 uppercase tracking-widest">User Journey Stages</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Manage lifecycle for {userName}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleGenerateQR}
                        disabled={generatingQR}
                        className="px-4 py-2 bg-gradient-gold text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                        {generatingQR ? 'Generating...' : 'Generate QR'}
                    </button>
                    <button
                        onClick={() => handleOpenModal()}
                        className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md"
                    >
                        + Assign Stage
                    </button>
                </div>
            </div>

            <div className="p-6 sm:p-8">
                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin"></div>
                    </div>
                ) : stages.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No stages assigned yet</p>
                        <button onClick={() => handleOpenModal()} className="mt-4 text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline">
                            Assign your first stage
                        </button>
                    </div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="stages">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-4"
                                >
                                    {[...stages].sort((a, b) => a.sequence - b.sequence).map((s, index) => (
                                        <Draggable key={s._id} draggableId={s._id} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border transition-all gap-4 ${
                                                        snapshot.isDragging ? 'shadow-2xl border-[#D4AF37] bg-white ring-2 ring-[#D4AF37]/10' : 'border-gray-100 hover:border-[#D4AF37]/30'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        {/* Drag Handle */}
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className="text-gray-300 hover:text-[#D4AF37] cursor-grab active:cursor-grabbing p-1"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                                                            </svg>
                                                        </div>
                                                        <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-black text-[10px] text-gray-400">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs sm:text-sm font-black text-gray-950 group-hover:text-[#A67C00] transition-colors">{s.name}</p>
                                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                                                    s.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                    s.status === 'processed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                    'bg-gray-100 text-gray-400 border-gray-200'
                                                                }`}>
                                                                    {s.status}
                                                                </span>
                                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                                                                    {new Date(s.time).toLocaleDateString()} {new Date(s.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 self-end sm:self-center">
                                                        <button onClick={() => handleOpenModal(s)} className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                        </button>
                                                        <button onClick={() => handleDelete(s._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all">
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                )}
            </div>

            <DashboardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingStage ? 'Edit Journey Stage' : 'Assign New Stage'}
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-200">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-black text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 shadow-lg">Save Stage</button>
                    </div>
                }
            >
                <form className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Stage Name</label>
                        <select 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-black"
                            value={formData.stage}
                            onChange={e => setFormData({...formData, stage: e.target.value})}
                        >
                            {globalStages.map(gs => <option key={gs} value={gs}>{gs}</option>)}
                            {!globalStages.includes(formData.stage) && formData.stage && <option value={formData.stage}>{formData.stage}</option>}
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Sequence</label>
                            <input 
                                type="number" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-black" 
                                value={formData.sequence} 
                                min={1}
                                max={editingStage ? stages.length : stages.length + 1}
                                onChange={e => {
                                    let val = parseInt(e.target.value);
                                    if (isNaN(val)) {
                                        setFormData({...formData, sequence: ''});
                                        return;
                                    }
                                    const maxVal = editingStage ? stages.length : stages.length + 1;
                                    if (val > maxVal) {
                                        val = maxVal;
                                        Swal.fire({
                                            toast: true,
                                            position: 'top-end',
                                            showConfirmButton: false,
                                            timer: 3000,
                                            timerProgressBar: true,
                                            icon: 'warning',
                                            title: `Sequence cannot exceed ${maxVal}`
                                        });
                                    }
                                    if (val < 1) val = 1;
                                    setFormData({...formData, sequence: val});
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Status</label>
                            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-black" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option value="upcoming">Upcoming</option>
                                <option value="active">Active</option>
                                <option value="processed">Processed</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Date & Time</label>
                        <input type="datetime-local" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-black" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Description</label>
                        <textarea rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-black resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Main details about this stage..." />
                    </div>
                </form>
            </DashboardModal>

            <DashboardModal
                isOpen={isQRModalOpen}
                onClose={() => setIsQRModalOpen(false)}
                title="Verification QR Code"
                footer={
                    <div className="flex gap-3">
                        <button onClick={() => setIsQRModalOpen(false)} className="px-6 py-2 bg-gray-100 text-gray-500 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-200">Close</button>
                        <button onClick={handleDownloadQR} className="px-6 py-2 bg-gradient-gold text-black rounded-lg text-xs font-black uppercase tracking-widest hover:brightness-110 shadow-lg flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download QR
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col items-center">
                    <p className="text-[10px] text-gray-500 mb-4 text-center uppercase tracking-wider">Scan this QR code with {userName}'s device to enable stage visibility</p>
                    {qrCodeData?.qrCodeImage && (
                        <div className="p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-lg">
                            <img src={qrCodeData.qrCodeImage} alt="QR Code" className="w-64 h-64" />
                        </div>
                    )}
                    <div className="w-full mt-4 p-3 bg-gray-50 rounded-xl">
                        <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Encoded URL:</p>
                        <p className="text-xs text-gray-600 break-all font-mono">{qrCodeData?.qrCodeUrl}</p>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-4 uppercase tracking-wider">Share this QR code with the user to grant stage visibility access</p>
                </div>
            </DashboardModal>
        </div >
    );
}
