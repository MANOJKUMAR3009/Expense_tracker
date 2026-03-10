import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { getTransactions, createTransaction, deleteTransaction } from '../api/transactionApi';
import { getCategories } from '../api/categoryApi';
import toast from 'react-hot-toast';

const formatINR = (n) =>
    `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
}) : '—';

const INITIAL_FORM = {
    amount: '', description: '', categoryId: '',
    type: 'EXPENSE', date: new Date().toISOString().split('T')[0],
};

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);

    const fetchTransactions = useCallback(async (p) => {
        setLoading(true);
        try {
            const res = await getTransactions(p, 8);
            setTransactions(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch {
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchTransactions(page); }, [page, fetchTransactions]);

    useEffect(() => {
        if (showModal) {
            getCategories().then((r) => setCategories(r.data || [])).catch(() => { });
        }
    }, [showModal]);

    const handleFormChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!form.amount || !form.categoryId) {
            toast.error('Please fill in all required fields');
            return;
        }
        setSubmitting(true);
        try {
            await createTransaction({
                ...form,
                amount: parseFloat(form.amount),
                categoryId: parseInt(form.categoryId),
            });
            toast.success('Transaction added! ✅');
            setShowModal(false);
            setForm(INITIAL_FORM);
            fetchTransactions(0);
            setPage(0);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create transaction');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            await deleteTransaction(id);
            toast.success('Transaction deleted');
            fetchTransactions(page);
        } catch {
            toast.error('Failed to delete');
        }
    };

    const filteredCategories = categories.filter(
        (c) => !form.type || (c.type && c.type.toUpperCase() === form.type.toUpperCase())
    );

    return (
        <div className="page-animate">
            <div className="page-header">
                <div className="flex items-center justify-between" style={{ paddingBottom: 0 }}>
                    <div>
                        <h1 className="page-title">Transactions</h1>
                        <p className="page-subtitle">Track your income and expenses</p>
                    </div>
                    <button
                        className="btn btn-primary gap-8"
                        style={{ marginTop: 8 }}
                        onClick={() => setShowModal(true)}
                    >
                        <Plus size={16} /> Add Transaction
                    </button>
                </div>
            </div>

            <div className="page-content">
                <div className="table-card">
                    {loading ? (
                        <div className="spinner-container"><div className="spinner" /></div>
                    ) : transactions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon"></div>
                            <h3>No transactions yet</h3>
                            <p>Click &quot;Add Transaction&quot; to record your first one</p>
                        </div>
                    ) : (
                        <>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th>Category</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => (
                                        <tr key={tx.id}>
                                            <td>{formatDate(tx.date)}</td>
                                            <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                                {tx.description || tx.note || '—'}
                                            </td>
                                            <td>{tx.categoryName || tx.category?.name || '—'}</td>
                                            <td>
                                                <span className={`badge badge-${(tx.type || 'expense').toLowerCase()}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={tx.type === 'INCOME' ? 'amount-income' : 'amount-expense'}>
                                                {tx.type === 'INCOME' ? '+' : '-'}{formatINR(tx.amount)}
                                            </td>
                                            <td>
                                                <button
                                                    className="icon-btn danger"
                                                    onClick={() => handleDelete(tx.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        className="page-btn"
                                        disabled={page === 0}
                                        onClick={() => setPage((p) => p - 1)}
                                    >
                                        ‹
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i}
                                            className={`page-btn${page === i ? ' active' : ''}`}
                                            onClick={() => setPage(i)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        className="page-btn"
                                        disabled={page === totalPages - 1}
                                        onClick={() => setPage((p) => p + 1)}
                                    >
                                        ›
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {showModal && (
                <Modal title="Add Transaction" onClose={() => setShowModal(false)}>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label className="form-label">Transaction Type</label>
                            <div className="filter-tabs">
                                {['INCOME', 'EXPENSE'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={`filter-tab${form.type === t ? ' active' : ''}`}
                                        onClick={() => setForm((p) => ({ ...p, type: t, categoryId: '' }))}
                                    >
                                        {t === 'INCOME' ? 'Income' : 'Expense'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount (₹) *</label>
                            <input
                                className="form-input"
                                type="number"
                                name="amount"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                value={form.amount}
                                onChange={handleFormChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Select Category *</label>
                            {filteredCategories.length === 0 ? (
                                <div style={{
                                    padding: '12px', background: 'rgba(239,68,68,0.1)',
                                    borderRadius: 'var(--radius-md)', border: '1px solid rgba(239,68,68,0.2)',
                                    fontSize: '13px', color: 'var(--accent-red)', textAlign: 'center'
                                }}>
                                    No {form.type.toLowerCase()} categories found.<br />
                                    <a href="/categories" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}>
                                        Create one in Categories
                                    </a>
                                </div>
                            ) : (
                                <select
                                    className="form-input"
                                    name="categoryId"
                                    value={form.categoryId}
                                    onChange={handleFormChange}
                                    required
                                >
                                    <option value="">Choose Category</option>
                                    {filteredCategories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date</label>
                            <input
                                className="form-input"
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleFormChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <input
                                className="form-input"
                                type="text"
                                name="description"
                                placeholder="What was this for?"
                                value={form.description}
                                onChange={handleFormChange}
                            />
                        </div>

                        <div className="flex gap-8" style={{ marginTop: 4 }}>
                            <button
                                type="button"
                                className="btn btn-secondary flex-1"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-1"
                                disabled={submitting || filteredCategories.length === 0}
                            >
                                {submitting ? 'Saving...' : 'Add Transaction'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default TransactionsPage;
