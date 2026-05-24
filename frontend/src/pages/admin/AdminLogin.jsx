import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
        if (errors[event.target.name]) setErrors((current) => ({ ...current, [event.target.name]: null }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({});
        if (!formData.email || !formData.password) {
            setErrors({
                email: !formData.email ? 'Admin email is required' : null,
                password: !formData.password ? 'Password is required' : null,
            });
            return;
        }

        setLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            if (user.role !== 'admin') {
                setErrors({ api: 'Access denied. Admin accounts only.' });
                return;
            }
            setTimeout(() => navigate('/admin/dashboard'), 650);
        } catch (error) {
            setErrors({ api: error.response?.data?.message || 'Invalid admin credentials.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-screen">
            <section
                className="auth-showcase auth-showcase-admin"
                style={{ '--auth-bg': 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&auto=format&fit=crop")' }}
            >
                <motion.div className="auth-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="auth-brand">
                        <span className="auth-brand-mark"><Shield size={22} /></span>
                        <span>
                            <strong>QuickBite Admin</strong>
                            <small>Operations center</small>
                        </span>
                    </div>
                    <h1>Run the restaurant floor from one place.</h1>
                    <p>Track orders, update menus, manage restaurants, and keep every customer handoff moving.</p>
                    <div className="auth-metrics">
                        <span><strong>Live</strong><small>order queue</small></span>
                        <span><strong>Menu</strong><small>control</small></span>
                        <span><strong>Revenue</strong><small>insights</small></span>
                    </div>
                </motion.div>
            </section>

            <section className="auth-form-zone">
                <motion.div className="auth-form-card auth-form-card-admin" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="auth-eyebrow auth-eyebrow-admin">Restricted access</span>
                    <h2>Admin sign in</h2>
                    <p>Only authorized QuickBite administrators can access this workspace.</p>

                    {errors.api && (
                        <div className="auth-alert">
                            <AlertCircle size={17} />
                            {errors.api}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="email">Admin email</label>
                            <div className="auth-input-wrap">
                                <Mail size={18} />
                                <input className={`auth-input ${errors.email ? 'is-error' : ''}`} id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="admin@quickbite.com" />
                            </div>
                            {errors.email && <p className="auth-error">{errors.email}</p>}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <div className="auth-input-wrap">
                                <Lock size={18} />
                                <input className={`auth-input ${errors.password ? 'is-error' : ''}`} id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Enter admin password" />
                                <button className="auth-icon-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onPointerDown={(event) => {
                                    event.preventDefault();
                                    setShowPassword((current) => !current);
                                }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="auth-error">{errors.password}</p>}
                        </div>

                        <motion.button className="auth-submit auth-submit-admin" type="submit" disabled={loading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                            {loading ? <><Loader2 size={18} className="spin-icon" /> Checking access</> : <><Shield size={18} /> Enter dashboard <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>

                    <div className="auth-divider">Need an account?</div>
                    <Link className="auth-secondary" to="/admin/register">Create admin account</Link>
                    <div className="auth-link-row">
                        <Link to="/login"><ArrowLeft size={14} /> Customer login</Link>
                    </div>
                </motion.div>
            </section>
        </main>
    );
};

export default AdminLogin;
