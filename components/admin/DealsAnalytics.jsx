"use client";
import { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function DealsAnalytics({ deals = [], totals = {} }) {
    // 1. Process data for Monthly Revenue Area Chart
    const monthlyData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        const data = months.map(month => ({ name: month, revenue: 0, commission: 0 }));

        deals.forEach(deal => {
            const date = new Date(deal.createdAt || deal.created_at);
            if (date.getFullYear() === currentYear) {
                const monthIdx = date.getMonth();
                const value = parseFloat(deal.dealValue || deal.salePrice || 0);
                const comm = parseFloat(deal.commissionValue || 0);
                data[monthIdx].revenue += value;
                data[monthIdx].commission += comm;
            }
        });

        return data;
    }, [deals]);

    // 2. Process data for Deal Status Pie Chart
    const statusData = useMemo(() => {
        return [
            { name: 'Opened', value: totals.byStatus?.open || 0, color: '#fbbf24' },
            { name: 'Closed', value: totals.byStatus?.closed || 0, color: '#10b981' },
            { name: 'Cancelled', value: totals.byStatus?.cancelled || 0, color: '#ef4444' },
        ].filter(d => d.value > 0);
    }, [totals]);

    // 3. Process data for Portfolio Balance (Sale vs Rent)
    const typeData = useMemo(() => {
        const saleValue = deals.filter(d => d.dealType === 'sale').reduce((acc, d) => acc + parseFloat(d.dealValue || 0), 0);
        const rentValue = deals.filter(d => d.dealType === 'rent').reduce((acc, d) => acc + parseFloat(d.dealValue || 0), 0);
        return [
            { name: 'Sales Portfolio', value: saleValue },
            { name: 'Rent Portfolio', value: rentValue },
        ];
    }, [deals]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-neutral-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex flex-col">
                            <span className="text-white font-bold text-lg">
                                AED {(entry.value / 1000).toFixed(1)}K
                            </span>
                            <span className="text-[10px] font-bold uppercase" style={{ color: entry.color }}>
                                {entry.name}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Revenue Flow Chart */}
                <div className="lg:col-span-2 glass-effect rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-px w-4 bg-accent" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Revenue Intelligence</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tighter">Financial Pulse <span className="text-white/20">{new Date().getFullYear()}</span></h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Commission</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#c5a572" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#c5a572" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#ffffff20', fontSize: 10, fontWeight: 700 }}
                                    tickFormatter={(val) => `${val / 1000}K`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Total Revenue"
                                    stroke="#c5a572"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="commission"
                                    name="Commission"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorComm)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown Pie */}
                <div className="glass-effect rounded-[2rem] p-8 border border-white/5 shadow-2xl flex flex-col items-center">
                    <div className="w-full mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-px w-4 bg-accent" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Deal Lifecycle</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tighter text-left">Conversion <span className="text-white/20">Flow</span></h3>
                    </div>

                    <div className="h-[250px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">Efficiency</span>
                            <span className="text-3xl font-black text-white tracking-tighter">
                                {totals.totalDeals > 0 ? Math.round((totals.byStatus?.closed / totals.totalDeals) * 100) : 0}%
                            </span>
                            <span className="text-green-400 text-[10px] font-black uppercase tracking-widest">Success</span>
                        </div>
                    </div>

                    <div className="w-full mt-8 space-y-4">
                        {statusData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.name}</span>
                                </div>
                                <span className="text-white font-black">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Secondary Performance Bar Chart */}
            <div className="glass-effect rounded-[2rem] p-8 border border-white/5 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-px w-4 bg-accent" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent">Market Distribution</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tighter mb-10">Sales vs Rentals <span className="text-white/20">Portfolio</span></h3>

                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#ffffff60', fontSize: 10, fontWeight: 700 }}
                                width={100}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                            <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={30}>
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#c5a572' : '#3b82f6'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
