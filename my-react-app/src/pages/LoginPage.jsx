import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleChange = (e) => {
        setError('');
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(form);
            toast.success('Welcome back! 🎉');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="auth-logo-icon">
                        <TrendingUp size={24} color="white" />
                    </div>
                    <h1>SaveMore</h1>
                </div>

                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Sign in to your account to continue</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className="form-input"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group" style={{ position: 'relative' }}>
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={{ paddingRight: 44 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            style={{
                                position: 'absolute', right: 14, top: 38,
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-muted)', display: 'flex'
                            }}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        style={{ marginTop: 8, padding: '14px' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-link">
                    Don&apos;t have an account?{' '}
                    <Link to="/register">Create one</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
