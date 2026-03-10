import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { createOrUpdateBudget, getBudgetStatus, deleteBudget } from '../api/budgetApi';
import { getCategories } from '../api/categoryApi';
import toast from 'react-hot-toast';

const formatINR = (n) =>
    `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const currentMonth = () => new Date().toISOString().slice(0, 7); // YYYY-MM

const BudgetPage = () => {
    const [categories, setCategories] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        category: '', monthlyLimit: '', month: currentMonth()
    });

    useEffect(() => {
        getCategories()
            .then((r) => setCategories(r.data || []))
            .catch(() => { });
    }, []);

    const fetchBudgetStatus = useCallback(async (cat, month) => {
        try {
            const res = await getBudgetStatus(cat, month);
            return res.data;
        } catch {
            return null;
        }
    }, []);

    const loadAllBudgets = useCallback(async () => {
        if (!categories.length) return;
        setLoading(true);
        const month = currentMonth();
        const results = await Promise.allSettled(
            categories.map((c) => fetchBudgetStatus(c.name, month))
        );
        const valid = results
            .map((r, i) => {
                if (r.status === 'fulfilled' && r.value) {
                    const b = r.value;
                    return {
                        ...b,
                        monthlyLimit: b.monthlyLimit ?? b.amount ?? 0,
                        spent: b.spent ?? 0,
                        remaining: b.remaining ?? 0,
                        percentageUsed: b.percentageUsed ?? 0,
                        categoryName: categories[i].name
                    };
                }
                return null;
            })
            .filter(b => b && (b.monthlyLimit > 0 || b.spent > 0));
        setBudgets(valid);
        setLoading(false);
    }, [categories, fetchBudgetStatus]);

    useEffect(() => { loadAllBudgets(); }, [loadAllBudgets]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category || !form.monthlyLimit) {
            toast.error('Category and limit are required');
            return;
        }
        setSubmitting(true);
        try {
            await createOrUpdateBudget({
                category: form.category,
                monthlyLimit: parseFloat(form.monthlyLimit),
                month: form.month,
            });
            toast.success('Budget saved ✅');
            setShowModal(false);
            setForm({ category: '', monthlyLimit: '', month: currentMonth() });
            loadAllBudgets();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save budget');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (catName, month) => {
        if (!window.confirm(`Delete budget for ${catName}?`)) return;
        const monthStr = typeof month === 'string' ? month : (month?.year ? `${month.year}-${month.monthValue < 10 ? '0' : ''}${month.monthValue}` : currentMonth());
        try {
            await deleteBudget(catName, monthStr);
            toast.success('Budget deleted');
            loadAllBudgets();
        } catch {
            toast.error('Failed to delete budget');
        }
    };


    return (
        <div className="page-animate">
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Budgets</h1>
                        <p className="page-subtitle">Set monthly spending limits per category</p>
                    </div>
                    <button className="btn btn-primary gap-8" style={{ marginTop: 8 }} onClick={() => setShowModal(true)}>
                        <Plus size={16} /> Set Budget
                    </button>
                </div>
            </div>

            <div className="page-content">
                {loading ? (
                    <div className="spinner-container"><div className="spinner" /></div>
                ) : budgets.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"></div>
                        <h3>No budgets set</h3>
                        <p>Start by setting a spending limit for a category</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {budgets.map((b) => {
                            const pct = Math.min(b.percentageUsed || 0, 100);
                            const statusClass = pct > 90 ? 'danger' : pct > 70 ? 'warning' : 'safe';

                            return (
                                <div key={b.categoryName || b.category} className="budget-card">
                                    <div className="budget-header">
                                        <div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15, marginBottom: 2 }}>
                                                {b.categoryName || b.category}
                                            </div>
                                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                                {typeof b.month === 'string' ? b.month : (b.month?.year ? `${b.month.year}-${b.month.monthValue < 10 ? '0' : ''}${b.month.monthValue}` : currentMonth())}
                                            </div>
                                        </div>
                                        <button
                                            className="icon-btn danger"
                                            onClick={() => handleDelete(b.categoryName || b.category, b.month || currentMonth())}
                                            title="Delete budget"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>

                                    <div style={{ marginTop: 12, padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 700 }}>
                                            REMAINING BUDGET
                                        </div>
                                        <div style={{
                                            fontSize: 28,
                                            fontWeight: 800,
                                            color: b.remaining < 0 ? 'var(--accent-red)' : 'var(--accent-green)',
                                            textShadow: b.remaining < 0 ? '0 0 15px rgba(239,68,68,0.2)' : '0 0 15px rgba(16,185,129,0.2)'
                                        }}>
                                            {formatINR(b.remaining)}
                                        </div>
                                    </div>

                                    <div style={{ marginTop: 16 }}>
                                        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{pct.toFixed(0)}% Used</span>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                                                Spent: {formatINR(b.spent)} / {formatINR(b.monthlyLimit)}
                                            </span>
                                        </div>
                                        <div className="budget-progress-bar">
                                            <div
                                                className={`budget-progress-fill ${statusClass}`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showModal && (
                <Modal title="Set Budget" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Category *</label>
                            <select
                                className="form-input"
                                value={form.category}
                                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                required
                            >
                                <option value="">Select category</option>
                                {categories
                                    .filter((c) => c.type === 'EXPENSE')
                                    .map((c) => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Monthly Limit (₹) *</label>
                            <input
                                className="form-input"
                                type="number"
                                placeholder="e.g. 5000"
                                min="1"
                                step="1"
                                value={form.monthlyLimit}
                                onChange={(e) => setForm((p) => ({ ...p, monthlyLimit: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Month</label>
                            <input
                                className="form-input"
                                type="month"
                                value={form.month}
                                onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))}
                            />
                        </div>

                        <div className="flex gap-8" style={{ marginTop: 4 }}>
                            <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary flex-1" disabled={submitting}>
                                {submitting ? 'Saving...' : 'Save Budget'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default BudgetPage;
