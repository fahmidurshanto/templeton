import React, { useEffect, useState } from 'react';
import DashboardModal from '../../../components/ui/DashboardModal';
import { useAppContext } from '@/context/AppContext';

const ServiceIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
);

export default function ServiceAnalysisModal({ isOpen, onClose }) {
    const { user, fetchServiceStatus } = useAppContext();
    const [serviceData, setServiceData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user?._id) {
            setLoading(true);
            fetchServiceStatus(user._id)
                .then(res => setServiceData(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, user?._id]);

    return (
        <DashboardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Service Analysis"
            icon={ServiceIcon}
        >
            <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="py-10 text-center text-gray-500 font-bold animate-pulse">Loading status records...</div>
                ) : (
                    serviceData.length > 0 ? serviceData.map(({ label, value }) => (
                        <div key={label} className="flex items-center justify-between py-3">
                            <span className="text-sm text-gray-600 font-medium tracking-tight">{label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 font-medium">:</span>
                                <span className="text-sm font-bold text-emerald-600 whitespace-nowrap">{value}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="py-10 text-center text-gray-400 text-xs italic">No service status records found.</div>
                    )
                )}
            </div>
        </DashboardModal>
    );
}
