import React, { useEffect, useState } from 'react';
import DashboardModal from '../../../components/ui/DashboardModal';
import { useAppContext } from '@/context/AppContext';

const EntitiesIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
);

export default function EntitiesModal({ isOpen, onClose }) {
    const { user, fetchEntities } = useAppContext();
    const [primaryEntities, setPrimaryEntities] = useState([]);
    const [thirdPartyEntities, setThirdPartyEntities] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user?._id) {
            setLoading(true);
            fetchEntities(user._id)
                .then(res => {
                    setPrimaryEntities(res.primary);
                    setThirdPartyEntities(res.thirdParty);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, user?._id]);

    return (
        <DashboardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Entities"
            icon={EntitiesIcon}
        >
            <div className="space-y-8 py-2">
                {loading ? (
                    <div className="py-10 text-center text-gray-500 font-bold animate-pulse">Loading entities...</div>
                ) : (
                    <>
                        {/* Primary Section */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight uppercase tracking-[0.1em]">Primary</h4>
                            <div className="space-y-3">
                                {primaryEntities.length > 0 ? primaryEntities.map((entity) => (
                                    <div key={entity.name} className="flex items-start justify-between">
                                        <span className="text-sm text-gray-700 font-medium uppercase leading-tight w-2/3">{entity.name}</span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-gray-400 font-medium">:</span>
                                            <span className={`text-sm font-bold ${entity.status === 'Active' ? 'text-emerald-600' : 'text-red-500'}`}>{entity.status}</span>
                                        </div>
                                    </div>
                                )) : <div className="text-xs text-gray-400 italic">No primary entities found.</div>}
                            </div>
                        </div>

                        {/* 3rd Party Section */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-4 tracking-tight uppercase tracking-[0.1em]">3rd Party Entities / Marketing Agents</h4>
                            <div className="space-y-3">
                                {thirdPartyEntities.length > 0 ? thirdPartyEntities.map((entity) => (
                                    <div key={entity.name} className="flex items-start justify-between">
                                        <span className="text-sm text-gray-700 font-medium uppercase leading-tight w-2/3">{entity.name}</span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <span className="text-gray-400 font-medium">:</span>
                                            <span className="text-sm font-bold text-emerald-600">{entity.status}</span>
                                        </div>
                                    </div>
                                )) : <div className="text-xs text-gray-400 italic">No 3rd party entities found.</div>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardModal>
    );
}
