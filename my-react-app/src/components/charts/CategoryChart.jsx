import {
    PieChart, Pie, Cell, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#7c3aed', '#0d9488', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#f97316'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: 'rgba(17,24,39,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: 13,
            }}>
                <p style={{ color: '#f1f5f9', fontWeight: 600 }}>{payload[0].name}</p>
                <p style={{ color: COLORS[0] }}>₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
            </div>
        );
    }
    return null;
};

const CategoryChart = ({ data }) => {
    if (!data?.length) {
        return (
            <div className="empty-state" style={{ padding: '40px 0' }}>
                <p>No category data available yet.</p>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        name: item.category || 'Other',
        value: item.total || 0,
    }));

    return (
        <ResponsiveContainer width="100%" height={240}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {chartData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CategoryChart;
