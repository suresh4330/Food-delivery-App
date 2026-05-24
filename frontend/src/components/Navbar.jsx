import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, MapPin, Menu, Shield, ShoppingCart, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useDeliveryLocation } from '../context/LocationContext';
import LocationPicker from './LocationPicker';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { location } = useDeliveryLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [locationOpen, setLocationOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const role = user?.role?.toLowerCase();
    const isAdmin = role === 'admin';
    const isUser = role === 'user';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = isAdmin
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
        <motion.header
            className={`qb-navbar ${scrolled ? 'is-scrolled' : ''}`}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <div className="qb-navbar-inner">
                <NavLink to={isAdmin ? '/admin/dashboard' : '/'} className="qb-brand">
                    <span className="qb-brand-mark">QB</span>
                    <span>
                        <strong>QuickBite</strong>
                        {isAdmin && <small>Admin</small>}
                    </span>
                </NavLink>

                {isUser && (
                    <button type="button" className="qb-location-button" onClick={() => setLocationOpen(true)} title={location.address}>
                        <MapPin size={16} />
                        {location.label}
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
                    {isUser && (
                        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}>
                        <Link to="/cart" className="qb-cart-link">
                            <span>
                                <ShoppingCart size={20} />
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.small
                                            key={cartCount}
                                            initial={{ scale: 0.4, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.4, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
                                        >
                                            {cartCount}
                                        </motion.small>
                                    )}
                                </AnimatePresence>
                            </span>
                            Cart
                        </Link>
                        </motion.div>
                    )}

                    <div className="qb-user-chip">
                        <span>{isAdmin ? <Shield size={15} /> : <User size={15} />}</span>
                        <div>
                            <strong>{user?.name?.split(' ')[0] || 'User'}</strong>
                            <small>{role || 'user'}</small>
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

            <AnimatePresence>
            {isMenuOpen && (
                <motion.div
                    className="qb-mobile-panel"
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                    {navLinks.map((link) => (
                        <NavLink key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>
                            {link.name}
                        </NavLink>
                    ))}
                    {isUser && (
                        <NavLink to="/cart" onClick={() => setIsMenuOpen(false)}>
                            Cart ({cartCount})
                        </NavLink>
                    )}
                    {isUser && (
                        <button type="button" onClick={() => {
                            setIsMenuOpen(false);
                            setLocationOpen(true);
                        }}>
                            Change location
                        </button>
                    )}
                    <button type="button" onClick={handleLogout}>
                        Logout
                    </button>
                </motion.div>
            )}
            </AnimatePresence>

            {isUser && (
                <LocationPicker open={locationOpen} onClose={() => setLocationOpen(false)} />
            )}
        </motion.header>
    );
};

export default Navbar;
