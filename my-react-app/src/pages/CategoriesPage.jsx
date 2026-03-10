import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import {
    getCategories, createCategory, updateCategory, deleteCategory
} from '../api/categoryApi';
import toast from 'react-hot-toast';

const INITIAL_FORM = { name: '', type: 'EXPENSE' };

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCat, setEditingCat] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [typeFilter, setTypeFilter] = useState('ALL');

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCategories();
            setCategories(res.data || []);
        } catch {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const openCreate = () => {
        setEditingCat(null);
        setForm(INITIAL_FORM);
        setShowModal(true);
    };

    const openEdit = (cat) => {
        setEditingCat(cat);
        setForm({ name: cat.name, type: cat.type });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) { toast.error('Category name is required'); return; }
        setSubmitting(true);
        try {
            if (editingCat) {
                await updateCategory(editingCat.id, form);
                toast.success('Category updated ✅');
            } else {
                await createCategory(form);
                toast.success('Category created ✅');
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category? Existing transactions will be affected.')) return;
        try {
            await deleteCategory(id);
            toast.success('Category deleted');
            fetchCategories();
        } catch {
            toast.error('Failed to delete category');
        }
    };

    const filtered = typeFilter === 'ALL'
        ? categories
        : categories.filter((c) => c.type === typeFilter);


    return (
        <div className="page-animate">
            <div className="page-header">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Categories</h1>
                        <p className="page-subtitle">Organize your income and expenses</p>
                    </div>
                    <button className="btn btn-primary gap-8" style={{ marginTop: 8 }} onClick={openCreate}>
                        <Plus size={16} /> New Category
                    </button>
                </div>
            </div>

            <div className="page-content">
                <div className="flex items-center gap-12 mb-20">
                    <div className="filter-tabs">
                        {['ALL', 'INCOME', 'EXPENSE'].map((t) => (
                            <button
                                key={t}
                                className={`filter-tab${typeFilter === t ? ' active' : ''}`}
                                onClick={() => setTypeFilter(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <span className="text-sm text-muted">
                        {filtered.length} categor{filtered.length === 1 ? 'y' : 'ies'}
                    </span>
                </div>

                {loading ? (
                    <div className="spinner-container"><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"></div>
                        <h3>No categories yet</h3>
                        <p>Create your first category to organise transactions</p>
                    </div>
                ) : (
                    <div className="cards-grid">
                        {filtered.map((cat, idx) => (
                            <div key={cat.id} className="category-card">
                                <div className="category-info">
                                    <div
                                        className="category-icon"
                                        style={{
                                            background: cat.type === 'INCOME'
                                                ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                    </div>
                                    <div>
                                        <div className="category-name" style={{ fontSize: '15px', fontWeight: 600 }}>{cat.name}</div>
                                        <div className="category-type">
                                            <span className={`badge badge-${cat.type.toLowerCase()}`}>{cat.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button className="icon-btn" onClick={() => openEdit(cat)} title="Edit">
                                        <Pencil size={13} />
                                    </button>
                                    <button className="icon-btn danger" onClick={() => handleDelete(cat.id)} title="Delete">
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {
                showModal && (
                    <Modal
                        title={editingCat ? 'Edit Category' : 'New Category'}
                        onClose={() => setShowModal(false)}
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Type</label>
                                <div className="filter-tabs">
                                    {['INCOME', 'EXPENSE'].map((t) => (
                                        <button
                                            key={t}
                                            type="button"
                                            className={`filter-tab${form.type === t ? ' active' : ''}`}
                                            onClick={() => setForm((p) => ({ ...p, type: t }))}
                                        >
                                            {t === 'INCOME' ? 'Income' : 'Expense'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category Name *</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    placeholder="e.g. Groceries, Salary..."
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    required
                                    autoFocus
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
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : editingCat ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )
            }
        </div >
    );
};

export default CategoriesPage;
