import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import MonthlyChart from '../components/charts/MonthlyChart';
import CategoryChart from '../components/charts/CategoryChart';
import { getSummary, getMonthlyOverview, getCategoryBreakdown } from '../api/dashboardApi';
import { useAuth } from '../context/AuthContext';

const formatINR = (n) =>
    `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

const DashboardPage = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [monthly, setMonthly] = useState([]);
    const [breakdown, setBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAll = async () => {
            try {
                const [s, m, b] = await Promise.all([
                    getSummary(),
                    getMonthlyOverview(),
                    getCategoryBreakdown(),
                ]);
                setSummary(s.data);
                setMonthly(m.data);
                setBreakdown(b.data);
            } catch (e) {
                console.error('Dashboard load error', e);
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const balance = summary?.totalBalance || 0;

    return (
        <div className="page-animate">
            <div className="page-header">
                <h1 className="page-title">
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
                    {user?.username}
                </h1>
                <p className="page-subtitle">Here&apos;s your financial overview</p>
            </div>

            <div className="page-content">
                {loading ? (
                    <div className="spinner-container"><div className="spinner" /></div>
                ) : (
                    <>
                        <div className="stats-grid">
                            <StatCard
                                icon={TrendingUp}
                                iconClass="income"
                                label="Total Income"
                                value={formatINR(summary?.totalIncome)}
                            />
                            <StatCard
                                icon={TrendingDown}
                                iconClass="expense"
                                label="Total Expenses"
                                value={formatINR(summary?.totalExpense)}
                            />
                            <StatCard
                                icon={DollarSign}
                                iconClass="balance"
                                label="Net Balance"
                                value={formatINR(balance)}
                                badge={balance >= 0
                                    ? { type: 'up', label: '↑ Positive' }
                                    : { type: 'down', label: '↓ Negative' }}
                            />
                            <StatCard
                                icon={Wallet}
                                iconClass="budget"
                                label="Transactions"
                                value="Active"
                            />
                        </div>

                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3 className="chart-title">Monthly Overview</h3>
                                <p className="chart-subtitle">Income vs Expenses per month</p>
                                <MonthlyChart data={monthly} />
                            </div>
                            <div className="chart-card">
                                <h3 className="chart-title">Spending by Category</h3>
                                <p className="chart-subtitle">Where your money goes</p>
                                <CategoryChart data={breakdown} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
