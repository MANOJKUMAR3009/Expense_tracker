import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => (
    <div className="app-layout">
        <Sidebar />
        <main className="main-content">
            <Outlet />
        </main>
    </div>
);

export default Layout;
