import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, LogOut, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Restaurants', icon: UtensilsCrossed, path: '/admin/restaurants' },
        { label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    ];

    const handleLogout = () => { logout(); navigate('/admin/login'); };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif", background: '#F8F8F8' }}>

            {/* Sidebar overlay (mobile) */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
                    zIndex: 40, display: 'none',
                }} className="sidebar-overlay" />
            )}

            {/* Sidebar */}
            <aside style={{
                width: '240px', background: 'white', borderRight: '1px solid #F0F0F0',
                display: 'flex', flexDirection: 'column', position: 'fixed',
                top: 0, bottom: 0, left: 0, zIndex: 50,
                boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
            }}>
                {/* Logo */}
                <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #F5F5F5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', background: '#FC8019', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>🍕</div>
                        <div>
                            <div style={{ fontWeight: 800, color: '#282C3F', fontSize: '1rem' }}>QuickBite</div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#93959F', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Panel</div>
                        </div>
                    </div>
                </div>

                {/* Nav Items */}
                <nav style={{ padding: '12px 10px', flex: 1 }}>
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            style={({ isActive }) => ({
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '11px 14px', borderRadius: '10px',
                                marginBottom: '4px', textDecoration: 'none',
                                fontSize: '0.85rem', fontWeight: 700,
                                transition: 'all 0.15s',
                                background: isActive ? '#FFF3E8' : 'transparent',
                                color: isActive ? '#FC8019' : '#686B78',
                                borderLeft: isActive ? '3px solid #FC8019' : '3px solid transparent',
                            })}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Profile */}
                <div style={{ padding: '14px', borderTop: '1px solid #F5F5F5' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '10px', borderRadius: '10px', background: '#FAFAFA',
                        marginBottom: '8px',
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: '#FFF3E8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <User size={16} style={{ color: '#FC8019' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#282C3F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || 'Admin'}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#93959F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.email}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '9px 12px', borderRadius: '8px',
                        background: 'none', border: '1px solid #F0F0F0',
                        color: '#93959F', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#E23744'; e.currentTarget.style.borderColor = '#FECACA'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#93959F'; e.currentTarget.style.borderColor = '#F0F0F0'; }}
                    >
                        <LogOut size={15} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Top bar */}
                <header style={{
                    height: '56px', background: 'white', borderBottom: '1px solid #F0F0F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 24px', position: 'sticky', top: 0, zIndex: 30,
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#282C3F' }}>{title}</h2>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#93959F' }}>
                            Admin / {title}
                        </div>
                    </div>
                </header>

                <div style={{ padding: '24px', flex: 1 }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
