import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Eye, EyeOff, Loader2, Lock, Mail, Shield, User } from 'lucide-react';
import API from '../../api/axios';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const strength = (() => {
        const password = formData.password;
        if (!password) return null;
        let score = 0;
        if (password.length >= 6) score += 1;
        if (password.length >= 10) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (score <= 1) return { label: 'Weak password', color: '#e23744', pct: '34%' };
        if (score <= 3) return { label: 'Good password', color: '#fc8019', pct: '68%' };
        return { label: 'Strong password', color: '#48c479', pct: '100%' };
    })();

    const handleChange = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
        if (errors[event.target.name]) setErrors((current) => ({ ...current, [event.target.name]: null }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const nextErrors = {};
        if (!formData.name.trim()) nextErrors.name = 'Admin name is required';
        if (!formData.email.trim()) nextErrors.email = 'Email is required';
        if (!formData.password || formData.password.length < 6) nextErrors.password = 'Use at least 6 characters';
        if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
        if (Object.keys(nextErrors).length) {
            setErrors(nextErrors);
            return;
        }

        setLoading(true);
        try {
            await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'admin',
            });
            setTimeout(() => navigate('/admin/login'), 800);
        } catch (error) {
            setErrors({ api: error.response?.data?.message || 'Admin registration failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-screen">
            <section
                className="auth-showcase auth-showcase-admin"
                style={{ '--auth-bg': 'url("https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&auto=format&fit=crop")' }}
            >
                <motion.div className="auth-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="auth-brand">
                        <span className="auth-brand-mark"><Shield size={22} /></span>
                        <span>
                            <strong>QuickBite Admin</strong>
                            <small>Team access</small>
                        </span>
                    </div>
                    <h1>Build a sharper operations team.</h1>
                    <p>Create admin access for people who manage restaurants, menus, and order status.</p>
                    <div className="auth-metrics">
                        <span><strong>Orders</strong><small>status control</small></span>
                        <span><strong>Food</strong><small>catalog edits</small></span>
                        <span><strong>Stats</strong><small>daily overview</small></span>
                    </div>
                </motion.div>
            </section>

            <section className="auth-form-zone">
                <motion.div className="auth-form-card auth-form-card-admin" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="auth-eyebrow auth-eyebrow-admin">Admin registration</span>
                    <h2>Create admin</h2>
                    <p>Set up a new administrator account for the QuickBite control panel.</p>

                    {errors.api && (
                        <div className="auth-alert">
                            <AlertCircle size={17} />
                            {errors.api}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <AuthField icon={User} id="name" label="Full name" error={errors.name}>
                            <input className={`auth-input ${errors.name ? 'is-error' : ''}`} id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Admin name" />
                        </AuthField>

                        <AuthField icon={Mail} id="email" label="Admin email" error={errors.email}>
                            <input className={`auth-input ${errors.email ? 'is-error' : ''}`} id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="admin@quickbite.com" />
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
                            <input className={`auth-input ${errors.confirmPassword ? 'is-error' : ''}`} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
                            {formData.confirmPassword && formData.confirmPassword === formData.password && (
                                <span className="auth-icon-button" style={{ color: '#48c479' }}><CheckCircle size={18} /></span>
                            )}
                        </AuthField>

                        <motion.button className="auth-submit auth-submit-admin" type="submit" disabled={loading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                            {loading ? <><Loader2 size={18} className="spin-icon" /> Creating</> : <><Shield size={18} /> Create admin <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>

                    <div className="auth-divider">Already have access?</div>
                    <Link className="auth-secondary" to="/admin/login">Admin sign in</Link>
                    <div className="auth-link-row">
                        <Link to="/login"><ArrowLeft size={14} /> Customer login</Link>
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

export default AdminRegister;
