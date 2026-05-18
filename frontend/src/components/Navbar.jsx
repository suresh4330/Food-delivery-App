import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, MapPin, Menu, Shield, ShoppingCart, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
        <header className={`qb-navbar ${scrolled ? 'is-scrolled' : ''}`}>
            <div className="qb-navbar-inner">
                <NavLink to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="qb-brand">
                    <span className="qb-brand-mark">QB</span>
                    <span>
                        <strong>QuickBite</strong>
                        {user?.role === 'admin' && <small>Admin</small>}
                    </span>
                </NavLink>

                {user?.role === 'user' && (
                    <button type="button" className="qb-location-button">
                        <MapPin size={16} />
                        Home
                        <ChevronDown size={14} />
                    </button>
                )}

                <nav className="qb-nav-links">
                    {navLinks.map((link) => (
                        <NavLink key={link.path} to={link.path}>
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                <div className="qb-nav-actions">
                    {user?.role === 'user' && (
                        <Link to="/cart" className="qb-cart-link">
                            <span>
                                <ShoppingCart size={20} />
                                {cartCount > 0 && <small>{cartCount}</small>}
                            </span>
                            Cart
                        </Link>
                    )}

                    <div className="qb-user-chip">
                        <span>{user?.role === 'admin' ? <Shield size={15} /> : <User size={15} />}</span>
                        <div>
                            <strong>{user?.name?.split(' ')[0] || 'User'}</strong>
                            <small>{user?.role}</small>
                        </div>
                    </div>

                    <button type="button" className="qb-logout-button" onClick={handleLogout}>
                        <LogOut size={15} />
                        Logout
                    </button>
                </div>

                <button
                    type="button"
                    className="qb-mobile-menu"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMenuOpen && (
                <div className="qb-mobile-panel">
                    {navLinks.map((link) => (
                        <NavLink key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </NavLink>
                    ))}
                    {user?.role === 'user' && (
                        <NavLink to="/cart" onClick={() => setIsMenuOpen(false)}>
                            Cart ({cartCount})
                        </NavLink>
                    )}
                    <button type="button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
};

export default Navbar;
