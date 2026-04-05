"use client";
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import NotFound from '@/components/ui/NotFound';
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

export default function ReportsPage() {
    const { user, fetchInvestmentReports } = useAppContext();
    const [reportsData, setReportsData] = useState({});
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [years, setYears] = useState([new Date().getFullYear().toString()]);
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'yearly'

    useEffect(() => {
        setIsMounted(true);
        if (user?.id) {
            setLoading(true);
            fetchInvestmentReports(user.id)
                .then(res => {
                    if (res.success && res.data) {
                        setReportsData(res.data);
                        const availableYears = Object.keys(res.data);
                        if (availableYears.length > 0) {
                            setYears(availableYears.sort((a, b) => b - a));
                            if (!availableYears.includes(selectedYear)) {
                                setSelectedYear(availableYears[availableYears.length - 1]);
                            }
                        } else {
                            setYears([new Date().getFullYear().toString()]);
                        }
                    }
                })
                .catch(err => {
                    console.error('Error fetching reports:', err);
                    if (err.response?.status === 404) {
                        setIsNotFound(true);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [user?.id]);

    // Monthly chart data for selected year
    const getMonthlyChartData = () => {
        const yearData = reportsData[selectedYear] || [];
        return MONTHS.map(month => {
            const found = yearData.find(d => d.month === month);
            return {
                label: month,
                amount: found ? found.amount : 0
            };
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
        return <NotFound title="Reports Unavailable" message="We were unable to retrieve your investment reports at this time." backLink="/" backText="Home" />;
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-8 animate__animated animate__fadeIn pb-12">
            {/* Header Section */}
            <div className="w-full text-center py-8 md:py-14 animate__animated animate__fadeIn relative flex flex-col items-center justify-center min-h-[15vh] md:min-h-[25vh]">
                <div className="relative z-10 w-full px-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-4 tracking-tight text-gradient-blue bg-clip-text uppercase leading-none">
                        Reports
                    </h1>
                    <p className="text-[10px] sm:text-xs md:text-base text-gray-400 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto opacity-70">
                        Strategic Investment Analytics • Allocation Performance
                    </p>
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6 md:mb-10">
                <div className="bg-white p-1.5 rounded-2xl border-2 border-gray-100 flex gap-1.5 shadow-xl">
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

            <div className="flex flex-col lg:flex-row gap-6 md:gap-10 mt-4 md:mt-8">

                {/* Left Column: Year Selection - only visible in Monthly mode */}
                {viewMode === 'monthly' && (
                    <div className="w-full lg:w-48 flex flex-row lg:flex-col gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-4 lg:pb-0 px-2 sm:px-0">
                        <h3 className="hidden lg:block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-3">
                            Strategic Period
                        </h3>
                        {years.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-5 sm:px-6 py-2.5 sm:py-3.5 lg:py-4 rounded-xl font-black text-[10px] sm:text-xs tracking-widest transition-all duration-300 shadow-sm whitespace-nowrap border
                                    ${selectedYear === year
                                        ? 'bg-gradient-blue text-black border-[#2E5F9E] scale-105 z-10'
                                        : 'bg-white text-gray-400 hover:bg-gray-50 border-gray-100'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                )}

                {/* Right Column: Chart */}
                <div className="flex-1 bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 sm:p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden mx-2 sm:mx-0">
                    {/* Subtle Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E5F9E]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-950 leading-tight uppercase tracking-tight">
                                    {viewMode === 'monthly'
                                        ? <>Allocation <span className="text-gradient-blue">{selectedYear}</span></>
                                        : <>Yearly <span className="text-gradient-blue">Overview</span></>
                                    }
                                </h2>
                                <p className="text-[10px] md:text-xs text-gray-400 mt-1 uppercase tracking-[0.2em] font-black opacity-70">
                                    {viewMode === 'monthly'
                                        ? 'Metric: Monthly Disbursement ($)'
                                        : 'Metric: Annual Total Disbursement ($)'
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Yearly Summary Stats - only in yearly mode */}
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
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                            dy={10}
                                            interval={0}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                            width={40}
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
        </div>
    );
}
