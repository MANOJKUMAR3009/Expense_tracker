import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ArrowLeftRight, Tag, Wallet,
    LogOut, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/categories', icon: Tag, label: 'Categories' },
    { to: '/budgets', icon: Wallet, label: 'Budgets' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const initials = user?.username
        ? user.username.slice(0, 2).toUpperCase()
        : 'SM';

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <TrendingUp size={20} color="white" />
                </div>
                <h2>SaveMore</h2>
            </div>

            <nav className="sidebar-nav">
                <span className="nav-label">Main Menu</span>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">{initials}</div>
                    <div>
                        <div className="user-name">{user?.username || 'User'}</div>
                        <div className="user-role">{user?.email || 'Account'}</div>
                    </div>
                </div>
                <button className="btn btn-secondary btn-full gap-8" onClick={handleLogout}>
                    <LogOut size={15} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
