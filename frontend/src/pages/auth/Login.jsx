import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
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
                email: !formData.email ? 'Email is required' : null,
                password: !formData.password ? 'Password is required' : null,
            });
            return;
        }

        setLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            showToast('Login successful', 'success');
            setTimeout(() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/'), 700);
        } catch (error) {
            const message = error.response?.data?.message || 'Invalid email or password.';
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
                style={{ '--auth-bg': 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop")' }}
            >
                <motion.div className="auth-copy" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="auth-brand">
                        <span className="auth-brand-mark">QB</span>
                        <span>
                            <strong>QuickBite</strong>
                            <small>Food delivery</small>
                        </span>
                    </div>
                    <h1>Good food, delivered beautifully.</h1>
                    <p>Order from trusted local restaurants with fast delivery, live cart updates, and a smooth checkout.</p>
                    <div className="auth-metrics">
                        <span><strong>500+</strong><small>restaurants</small></span>
                        <span><strong>30 min</strong><small>average delivery</small></span>
                        <span><strong>4.8</strong><small>customer rating</small></span>
                    </div>
                </motion.div>
            </section>

            <section className="auth-form-zone">
                <motion.div className="auth-form-card" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="auth-eyebrow">Welcome back</span>
                    <h2>Sign in</h2>
                    <p>Continue to your restaurants, cart, and order history.</p>

                    {errors.api && (
                        <div className="auth-alert">
                            <AlertCircle size={17} />
                            {errors.api}
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="email">Email address</label>
                            <div className="auth-input-wrap">
                                <Mail size={18} />
                                <input
                                    id="email"
                                    className={`auth-input ${errors.email ? 'is-error' : ''}`}
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@email.com"
                                />
                            </div>
                            {errors.email && <p className="auth-error">{errors.email}</p>}
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <div className="auth-input-wrap">
                                <Lock size={18} />
                                <input
                                    id="password"
                                    className={`auth-input ${errors.password ? 'is-error' : ''}`}
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                />
                                <button className="auth-icon-button" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onPointerDown={(event) => {
                                    event.preventDefault();
                                    setShowPassword((current) => !current);
                                }}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="auth-error">{errors.password}</p>}
                        </div>

                        <motion.button className="auth-submit" type="submit" disabled={loading} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                            {loading ? <><Loader2 size={18} className="spin-icon" /> Signing in</> : <>Sign in <ArrowRight size={18} /></>}
                        </motion.button>
                    </form>

                    <div className="auth-divider">New here?</div>
                    <Link className="auth-secondary" to="/register">Create customer account</Link>

                    <div className="auth-link-row">
                        <span>Managing QuickBite?</span>
                        <Link to="/admin/login">Admin login</Link>
                    </div>
                </motion.div>
            </section>
        </main>
    );
};

export default Login;
