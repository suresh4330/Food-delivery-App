import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';

const Register = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const strength = (() => {
        const password = formData.password;
        if (!password) return null;
        if (password.length < 6) return { label: 'Weak password', color: '#e23744', pct: '34%' };
        if (password.length < 10 || !/[A-Z]/.test(password)) return { label: 'Good password', color: '#fc8019', pct: '68%' };
        return { label: 'Strong password', color: '#48c479', pct: '100%' };
    })();

    const validate = () => {
        const nextErrors = {};
        if (!formData.name.trim()) nextErrors.name = 'Full name is required';
        if (!formData.email.trim()) nextErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Enter a valid email';
        if (!formData.password) nextErrors.password = 'Password is required';
        else if (formData.password.length < 6) nextErrors.password = 'Use at least 6 characters';
        if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
        if (errors[event.target.name]) setErrors((current) => ({ ...current, [event.target.name]: null }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            showToast('Account created successfully', 'success');
            setTimeout(() => navigate('/login'), 900);
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            setErrors({ api: message });
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-screen">
            <section
                className="auth-showcase"
                style={{ '--auth-bg': 'url("https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=1600&auto=format&fit=crop")' }}
            >
                <motion.div className="auth-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="auth-brand">
                        <span className="auth-brand-mark">QB</span>
                        <span>
                            <strong>QuickBite</strong>
                            <small>Customer account</small>
                        </span>
                    </div>
                    <h1>Create your taste profile.</h1>
                    <p>Save addresses, reorder favorites, unlock offers, and keep every meal one tap away.</p>
                    <div className="auth-metrics">
                        <span><strong>First</strong><small>order offers</small></span>
                        <span><strong>Live</strong><small>cart sync</small></span>
                        <span><strong>Fast</strong><small>checkout</small></span>
                    </div>
                </motion.div>
            </section>

            <section className="auth-form-zone">
                <motion.div className="auth-form-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="auth-eyebrow">Join QuickBite</span>
                    <h2>Create account</h2>
                    <p>Fresh restaurants, personalized cart, and quick checkout.</p>

                    {errors.api && (
                        <div className="auth-alert">
                            <AlertCircle size={17} />
                            {errors.api}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <AuthField icon={User} id="name" label="Full name" error={errors.name}>
                            <input className={`auth-input ${errors.name ? 'is-error' : ''}`} id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                        </AuthField>

                        <AuthField icon={Mail} id="email" label="Email address" error={errors.email}>
                            <input className={`auth-input ${errors.email ? 'is-error' : ''}`} id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@email.com" />
                        </AuthField>

                        <AuthField icon={Lock} id="password" label="Password" error={errors.password}>
                            <input className={`auth-input ${errors.password ? 'is-error' : ''}`} id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="At least 6 characters" />
                            <button className="auth-icon-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onPointerDown={(event) => {
                                event.preventDefault();
                                setShowPassword((current) => !current);
                            }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </AuthField>

                        {strength && (
                            <div className="auth-strength">
                                <div className="auth-strength-track">
                                    <div className="auth-strength-bar" style={{ width: strength.pct, background: strength.color }} />
                                </div>
                                <p className="auth-error" style={{ color: strength.color }}>{strength.label}</p>
                            </div>
                        )}

                        <AuthField icon={Lock} id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
                            <input className={`auth-input ${errors.confirmPassword ? 'is-error' : ''}`} id="confirmPassword" name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
                            <button className="auth-icon-button" type="button" aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'} onPointerDown={(event) => {
                                event.preventDefault();
                                setShowConfirm((current) => !current);
                            }}>
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </AuthField>

                        <motion.button className="auth-submit" type="submit" disabled={loading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                            {loading ? <><Loader2 size={18} className="spin-icon" /> Creating</> : <>Create account <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>

                    <div className="auth-divider">Already joined?</div>
                    <Link className="auth-secondary" to="/login">Sign in instead</Link>
                    <div className="auth-link-row">
                        <span>Need admin access?</span>
                        <Link to="/admin/register">Admin registration</Link>
                    </div>
                </motion.div>
            </section>
        </main>
    );
};

const AuthField = ({ icon: Icon, id, label, error, children }) => (
    <div className="auth-field">
        <label htmlFor={id}>{label}</label>
        <div className="auth-input-wrap">
            <Icon size={18} />
            {children}
        </div>
        {error && <p className="auth-error">{error}</p>}
    </div>
);

export default Register;
