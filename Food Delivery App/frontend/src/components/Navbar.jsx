import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu, X, Shield, ChevronDown, MapPin, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => { logout(); navigate('/login'); };

    const navLinks = user?.role === 'admin'
        ? [
            { name: 'Dashboard', path: '/admin/dashboard' },
            { name: 'Restaurants', path: '/admin/restaurants' },
            { name: 'Orders', path: '/admin/orders' },
        ]
        : [
            { name: 'Home', path: '/' },
            { name: 'My Orders', path: '/orders' },
        ];

    return (
        <header style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
            backgroundColor: 'white',
            borderBottom: '1px solid #E9E9EB',
            boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
            transition: 'box-shadow 0.3s',
            height: '72px',
        }}>
            <div style={{
                maxWidth: '1200px', margin: '0 auto',
                padding: '0 24px',
                height: '100%',
                display: 'flex', alignItems: 'center', gap: '32px',
            }}>

                {/* Logo */}
                <NavLink
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/'}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}
                >
                    <div style={{
                        width: '42px', height: '42px',
                        background: '#FC8019',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: '0 2px 8px rgba(252,128,25,0.3)',
                    }}>
                        🍕
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FC8019', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                            QuickBite
                        </div>
                        {user?.role === 'admin' && (
                            <div style={{ fontSize: '0.6rem', color: '#93959F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Admin
                            </div>
                        )}
                    </div>
                </NavLink>

                {/* Location (user only) */}
                {user?.role === 'user' && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        cursor: 'pointer', padding: '8px 0',
                        borderBottom: '2px solid #282C3F',
                    }} className="location-bar">
                        <MapPin size={16} style={{ color: '#FC8019' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#282C3F', letterSpacing: '0.01em' }}>
                            Home
                        </span>
                        <ChevronDown size={14} style={{ color: '#282C3F' }} />
                    </div>
                )}

                {/* Nav Links */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '28px', marginLeft: 'auto' }} className="desktop-nav">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            style={({ isActive }) => ({
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                                color: isActive ? '#FC8019' : '#686B78',
                                borderBottom: isActive ? '2px solid #FC8019' : '2px solid transparent',
                                paddingBottom: '4px',
                                transition: 'all 0.2s',
                            })}
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Right: Cart + User */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }} className="desktop-right">

                    {/* Cart */}
                    {user?.role === 'user' && (
                        <Link to="/cart" style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            textDecoration: 'none',
                            color: '#282C3F',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            position: 'relative',
                            transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#FC8019'}
                            onMouseLeave={e => e.currentTarget.style.color = '#282C3F'}
                        >
                            <div style={{ position: 'relative' }}>
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span style={{
                                        position: 'absolute', top: '-8px', right: '-8px',
                                        background: '#FC8019', color: 'white',
                                        fontSize: '0.6rem', fontWeight: 800,
                                        minWidth: '17px', height: '17px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            Cart
                        </Link>
                    )}

                    {/* User Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <div style={{
                            width: '34px', height: '34px',
                            background: '#FFF3E8',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#FC8019',
                            border: '1.5px solid #FC8019',
                        }}>
                            {user?.role === 'admin' ? <Shield size={15} /> : <User size={15} />}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', lineHeight: 1.1 }}>
                                {user?.name?.split(' ')[0]}
                            </div>
                            <div style={{ fontSize: '0.65rem', color: '#93959F', fontWeight: 600, textTransform: 'uppercase' }}>
                                {user?.role}
                            </div>
                        </div>
                        <ChevronDown size={14} style={{ color: '#686B78' }} />
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            background: 'none',
                            border: '1.5px solid #E9E9EB',
                            borderRadius: '4px',
                            padding: '7px 14px',
                            fontSize: '0.8rem', fontWeight: 700,
                            color: '#686B78',
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FC8019'; e.currentTarget.style.color = '#FC8019'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E9E9EB'; e.currentTarget.style.color = '#686B78'; }}
                    >
                        <LogOut size={13} />
                        Logout
                    </button>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="mobile-menu-btn"
                    style={{
                        display: 'none',
                        marginLeft: 'auto',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#282C3F',
                        padding: '4px',
                    }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute', top: '72px', left: 0, right: 0,
                    background: 'white',
                    borderTop: '1px solid #E9E9EB',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}>
                    <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                style={({ isActive }) => ({
                                    padding: '12px 16px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    color: isActive ? '#FC8019' : '#282C3F',
                                    background: isActive ? '#FFF3E8' : 'transparent',
                                })}
                            >
                                {link.name}
                            </NavLink>
                        ))}

                        <div style={{ borderTop: '1px solid #E9E9EB', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', background: '#FFF3E8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FC8019' }}>
                                    <User size={16} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user?.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#93959F' }}>{user?.role}</div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                style={{ background: '#FC8019', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav, .desktop-right, .location-bar { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
