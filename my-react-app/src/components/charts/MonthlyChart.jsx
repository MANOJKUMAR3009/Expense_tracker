import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'rgba(17,24,39,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
            }}>
                <p style={{ color: '#94a3b8', marginBottom: 6 }}>{label}</p>
                {payload.map((p) => (
                    <p key={p.name} style={{ color: p.color, fontWeight: 600 }}>
                        {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MonthlyChart = ({ data }) => {
    if (!data?.length) {
        return (
            <div className="empty-state" style={{ padding: '40px 0' }}>
                <p>No monthly data available yet.</p>
            </div>
        );
    }

    const chartData = data.map(item => ({
        ...item,
        name: typeof item.month === 'number' ? MONTH_NAMES[item.month - 1] : item.month,
        income: item.totalIncome || 0,
        expense: item.totalExpense || 0
    }));

    return (
        <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barGap={4} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Legend
                    wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 12 }}
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MonthlyChart;
