"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';
import Swal from 'sweetalert2';
import api from '@/lib/api';
import NotFound from '@/components/ui/NotFound';
import { useAppContext } from '@/context/AppContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-sm p-3 border-2 border-[#2E5F9E] rounded-lg shadow-xl">
                <p className="font-bold text-gray-800">{label}</p>
                <p className="text-[#2E5F9E] font-bold">
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

export default function AdminUserReportsPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const userId = resolvedParams.id;
    const { user } = useAppContext();

    const [reportsData, setReportsData] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [years, setYears] = useState([new Date().getFullYear().toString()]);
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'yearly'

    const [editingMonth, setEditingMonth] = useState(null);
    const [editAmount, setEditAmount] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const fetchUserReports = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/user/investment-reports/${userId}`);
            if (res.data.success) {
                const data = res.data.data;
                setReportsData(data);
                
                const availableYears = Object.keys(data);
                if (availableYears.length > 0) {
                    setYears(prev => {
                        const merged = Array.from(new Set([...prev, ...availableYears]));
                        return merged.sort((a, b) => b - a);
                    });
                    if (!availableYears.includes(selectedYear) && !years.includes(selectedYear)) {
                        setSelectedYear(availableYears[0]);
                    }
                } else {
                    setYears([new Date().getFullYear().toString()]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            if (error.response?.status === 404) {
                setIsNotFound(true);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsMounted(true);
        if (userId && user && (user.role === 'admin' || user.role === 'superadmin')) {
            fetchUserReports();
        } else if (!user) {
            // wait for user context to load
        } else {
            setLoading(false);
        }
    }, [userId, user]);

    const handleEditClick = (monthStr, currentAmount) => {
        setEditingMonth(monthStr);
        setEditAmount(currentAmount.toString());
    };

    const handleSaveAmount = async (monthStr) => {
        if (editAmount === "" || isNaN(editAmount)) {
            Swal.fire('Invalid Amount', 'Please enter a valid number.', 'warning');
            return;
        }

        try {
            setIsSaving(true);
            const res = await api.post(`/user/investment-reports/${userId}`, {
                year: Number(selectedYear),
                month: monthStr,
                amount: editAmount
            });

            if (res.data.success) {
                setReportsData(prev => {
                    const yearData = prev[selectedYear] || [];
                    const existingIndex = yearData.findIndex(d => d.month === monthStr);
                    const newData = [...yearData];
                    if (existingIndex >= 0) {
                        newData[existingIndex] = { ...newData[existingIndex], amount: Number(editAmount) };
                    } else {
                        newData.push({ month: monthStr, amount: Number(editAmount) });
                        newData.sort((a, b) => MONTHS.indexOf(a.month) - MONTHS.indexOf(b.month));
                    }
                    return { ...prev, [selectedYear]: newData };
                });
                
                setEditingMonth(null);
                setEditAmount("");
                
                Swal.fire({
                    title: 'Saved!',
                    text: `${monthStr} ${selectedYear} amount has been updated to $${Number(editAmount).toLocaleString()}.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });

                fetchUserReports();
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save investment amount.', 'error');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    // Monthly chart data for selected year
    const getMonthlyChartData = () => {
        const yearData = reportsData[selectedYear] || [];
        return MONTHS.map(month => {
            const found = yearData.find(d => d.month === month);
            return { label: month, amount: found ? found.amount : 0 };
        });
    };

    // Yearly chart data: sum all months per year
    const getYearlyChartData = () => {
        return Object.keys(reportsData)
            .sort((a, b) => a - b)
            .map(year => {
                const total = (reportsData[year] || []).reduce((sum, d) => sum + (d.amount || 0), 0);
                return { label: year, amount: total };
            });
    };

    const displayData = viewMode === 'monthly' ? getMonthlyChartData() : getYearlyChartData();

    if (isNotFound) {
        return <NotFound title="User Not Found" message="The user you are looking for does not exist in our records." />;
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 animate__animated animate__fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <button 
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Investment Reports</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and edit monthly investment reporting data.</p>
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-start">
                <div className="bg-white p-1.5 rounded-2xl border-2 border-gray-100 flex gap-1.5 shadow-lg">
                    <button
                        onClick={() => setViewMode('monthly')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2
                            ${viewMode === 'monthly'
                                ? 'bg-gradient-blue text-black shadow-md scale-[1.03]'
                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        Monthly View
                    </button>
                    <button
                        onClick={() => setViewMode('yearly')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2
                            ${viewMode === 'yearly'
                                ? 'bg-gradient-blue text-black shadow-md scale-[1.03]'
                                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                        Yearly View
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 min-h-[500px]">
                {/* Left Column: Year Selection - only in Monthly mode */}
                {viewMode === 'monthly' && (
                    <div className="w-full md:w-48 flex flex-col gap-3">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 border-b-2 border-[#2E5F9E]/20 pb-2 flex justify-between items-center">
                            Select Year
                            <button 
                                className="text-[#2E5F9E] hover:text-[#1E3F66] p-1 rounded-full hover:bg-[#2E5F9E]/10 transition-colors"
                                onClick={async () => {
                                    const { value: newYear } = await Swal.fire({
                                        title: 'Add Strategic Year',
                                        text: 'Enter a new year to track investment disbursements (e.g., 2026):',
                                        input: 'number',
                                        inputPlaceholder: 'YYYY',
                                        showCancelButton: true,
                                        confirmButtonColor: '#2E5F9E',
                                        cancelButtonColor: '#d33',
                                        confirmButtonText: 'Add Year',
                                        background: '#ffffff',
                                        customClass: {
                                            title: 'text-black font-black uppercase tracking-widest text-lg',
                                            confirmButton: 'px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs',
                                            cancelButton: 'px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs'
                                        },
                                        inputValidator: (value) => {
                                            if (!value || value.length !== 4 || isNaN(value)) {
                                                return 'Please enter a valid 4-digit year.';
                                            }
                                            if (years.includes(value.toString())) {
                                                return 'Year already exists in the records.';
                                            }
                                        }
                                    });

                                    if (newYear) {
                                        const yearStr = newYear.toString();
                                        setYears(prev => [...prev, yearStr].sort((a, b) => b - a));
                                        setSelectedYear(yearStr);
                                    }
                                }}
                                title="Add Year"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </button>
                        </h3>
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-6 py-4 rounded-xl font-bold text-sm tracking-widest transition-all duration-300 shadow-sm
                                    ${selectedYear === year 
                                        ? 'bg-gradient-blue text-white scale-105' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 hover:border-[#2E5F9E]/30'
                                    }`}
                                    style={{
                                        background: selectedYear === year ? 'linear-gradient(135deg, #2E5F9E 0%, #2E5F9E 50%, #1E3F66 100%)' : ''
                                    }}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                )}

                {/* Right Column: Chart */}
                <div className="flex-1 bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E5F9E]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    
                    <div className="relative z-10 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                    {viewMode === 'monthly'
                                        ? <>Investment Analysis <span className="text-[#2E5F9E]">{selectedYear}</span></>
                                        : <>Yearly <span className="text-[#2E5F9E]">Overview</span></>
                                    }
                                </h2>
                                <p className="text-gray-500 mt-1">
                                    {viewMode === 'monthly'
                                        ? 'Review the charted performance below.'
                                        : 'Annual total disbursements across all tracked years.'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Yearly summary stats cards - yearly mode only */}
                        {viewMode === 'yearly' && !loading && displayData.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                                {displayData.map(d => (
                                    <div key={d.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center hover:border-[#2E5F9E]/40 transition-all">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{d.label}</p>
                                        <p className="text-sm font-black text-[#2E5F9E] tracking-tight">
                                            ${d.amount.toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="w-full h-[350px] md:h-[450px]">
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2E5F9E] rounded-full animate-spin"></div>
                                </div>
                            ) : isMounted && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={displayData}
                                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#2E5F9E" />
                                                <stop offset="100%" stopColor="#1E3F66" />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis 
                                            dataKey="label" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                                            dy={10}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }}
                                            tickFormatter={(value) => `$${value/1000}k`}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                                        <Bar 
                                            dataKey="amount" 
                                            radius={[10, 10, 0, 0]}
                                            animationDuration={1500}
                                        >
                                            {displayData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Editor Grid - only visible in Monthly mode */}
            {viewMode === 'monthly' && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Edit Monthly Data — {selectedYear}</h2>
                        <p className="text-gray-500 text-sm mt-1">Set the specific investment values for each month. The chart will update automatically.</p>
                    </div>
                    
                    {loading ? (
                        <div className="w-full py-12 flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-gray-200 border-t-[#2E5F9E] rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {displayData.map((data) => (
                                <div key={data.label} className="p-5 border border-gray-100 rounded-2xl bg-gray-50 hover:bg-gray-100/50 hover:border-[#2E5F9E]/30 transition-all flex flex-col justify-between group">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-lg font-black text-gray-900 uppercase tracking-widest">{data.label}</span>
                                        {editingMonth !== data.label && (
                                            <button 
                                                onClick={() => handleEditClick(data.label, data.amount)}
                                                className="text-gray-400 hover:text-[#2E5F9E] transition-colors p-1"
                                                title="Edit Amount"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    
                                    {editingMonth === data.label ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                                <input 
                                                    type="number"
                                                    value={editAmount}
                                                    onChange={(e) => setEditAmount(e.target.value)}
                                                    className="w-full pl-7 pr-3 py-2 rounded-xl border-2 border-[#2E5F9E] focus:outline-none focus:ring-0 text-sm font-bold text-gray-900 shadow-inner"
                                                    placeholder="Amount"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveAmount(data.label);
                                                        if (e.key === 'Escape') setEditingMonth(null);
                                                    }}
                                                />
                                            </div>
                                            <div className="flex gap-2 mt-1">
                                                <button 
                                                    onClick={() => handleSaveAmount(data.label)}
                                                    disabled={isSaving}
                                                    className="flex-1 bg-[#2E5F9E] text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#1E3F66] transition-colors disabled:opacity-50"
                                                >
                                                    {isSaving ? 'Saving...' : 'Save'}
                                                </button>
                                                <button 
                                                    onClick={() => setEditingMonth(null)}
                                                    disabled={isSaving}
                                                    className="flex-1 bg-white border border-gray-200 text-gray-600 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-end gap-1">
                                            <span className="text-xs text-gray-500 font-bold mb-1">$</span>
                                            <span className={`text-2xl font-black tracking-tight ${data.amount > 0 ? 'text-[#2E5F9E]' : 'text-gray-300'}`}>
                                                {data.amount.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Yearly Summary Table - visible in Yearly mode */}
            {viewMode === 'yearly' && (
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">Annual Summary</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Overview of total investment disbursements per year. To edit, switch to Monthly View and select the year.
                        </p>
                    </div>

                    {loading ? (
                        <div className="w-full py-12 flex items-center justify-center">
                            <div className="w-6 h-6 border-4 border-gray-200 border-t-[#2E5F9E] rounded-full animate-spin"></div>
                        </div>
                    ) : displayData.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-2xl">
                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No yearly data available</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Year</th>
                                        <th className="text-right py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Disbursement</th>
                                        <th className="text-right py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Months With Data</th>
                                        <th className="text-right py-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayData.map((d) => {
                                        const monthsWithData = (reportsData[d.label] || []).filter(m => m.amount > 0).length;
                                        return (
                                            <tr key={d.label} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <span className="text-base font-black text-gray-900">{d.label}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="text-base font-black text-[#2E5F9E]">${d.amount.toLocaleString()}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <span className="text-sm font-bold text-gray-500">{monthsWithData} / 12</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedYear(d.label);
                                                            setViewMode('monthly');
                                                        }}
                                                        className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border border-[#2E5F9E]/40 text-[#1A3C61] hover:bg-gradient-blue hover:text-black transition-all"
                                                    >
                                                        Edit Months
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
