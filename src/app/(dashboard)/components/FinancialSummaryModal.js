import React, { useEffect, useState } from 'react';
import DashboardModal from '../../../components/ui/DashboardModal';
import { useAppContext } from '@/context/AppContext';

const FinancialIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default function FinancialSummaryModal({ isOpen, onClose }) {
    const { user, fetchFinancialSummary } = useAppContext();
    const [financialData, setFinancialData] = useState([]);
    const [totalDisbursement, setTotalDisbursement] = useState('USD 0');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user?._id) {
            setLoading(true);
            fetchFinancialSummary(user._id)
                .then(res => {
                    setFinancialData(res.data);
                    setTotalDisbursement(res.totalDisbursement);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, user?._id]);

    return (
        <DashboardModal
            isOpen={isOpen}
            onClose={onClose}
            title="Financial Summary"
            icon={FinancialIcon}
        >
            <div className="space-y-4">
                {loading ? (
                    <div className="py-10 text-center text-gray-500 font-bold animate-pulse">Loading financial records...</div>
                ) : (
                    <>
                        <div className="divide-y divide-gray-100">
                            {financialData.length > 0 ? financialData.map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between py-4">
                                    <span className="text-sm text-gray-600 font-medium tracking-tight uppercase">{label}</span>
                                    <span className="text-sm text-gray-900 font-bold">{value}</span>
                                </div>
                            )) : (
                                <div className="py-4 text-center text-gray-400 text-xs italic">No investment records found.</div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t-2 border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                    Accumulated Total Disbursement
                                </span>
                                <span className="text-lg font-black text-black">
                                    {totalDisbursement}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardModal>
    );
}
