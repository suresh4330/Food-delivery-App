import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, LogOut, Menu, ShoppingBag, UtensilsCrossed, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title = 'Dashboard' }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Restaurants', icon: UtensilsCrossed, path: '/admin/restaurants' },
        { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const sidebar = (
        <aside className="admin-sidebar">
            <div className="admin-logo">
                <span className="admin-logo-mark">QB</span>
                <span>
                    <strong>QuickBite</strong>
                    <small>Admin workspace</small>
                </span>
            </div>

            <nav className="admin-nav">
                {navItems.map((item) => (
                    <NavLink key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}>
                        <item.icon size={18} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="admin-profile">
                <div className="admin-profile-row">
                    <span className="admin-avatar"><User size={18} /></span>
                    <span style={{ minWidth: 0 }}>
                        <strong>{user?.name || 'Admin'}</strong>
                        <small>{user?.email || 'QuickBite operator'}</small>
                    </span>
                </div>
                <button className="admin-logout" type="button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );

    return (
        <div className="admin-shell">
            <div className="admin-desktop-sidebar">{sidebar}</div>

            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            className="admin-mobile-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.div
                            className="admin-mobile-drawer"
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                        >
                            {sidebar}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <span>Admin / {title}</span>
                        <h2>{title}</h2>
                    </div>
                    <button className="admin-mobile-menu" type="button" onClick={() => setSidebarOpen((current) => !current)}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </header>

                <motion.div className="admin-content" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;
