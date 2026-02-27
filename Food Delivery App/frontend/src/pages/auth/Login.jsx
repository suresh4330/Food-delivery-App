import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (msg, type) => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!formData.email || !formData.password) {
            setErrors({ email: !formData.email ? 'Required' : null, password: !formData.password ? 'Required' : null });
            return;
        }
        setLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            showToast('Login successful!', 'success');
            setTimeout(() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/'), 900);
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid email or password.';
            setErrors({ api: msg });
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif", background: 'white' }}>

            {/* ── Toast ── */}
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 999,
                    background: toast.type === 'success' ? '#48C479' : '#E23744',
                    color: 'white', fontWeight: 700, fontSize: '0.875rem',
                    padding: '12px 20px', borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {toast.message}
                </div>
            )}

            {/* ── LEFT: Illustration Panel ── */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(170deg, #FC8019 0%, #E95B0C 100%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '60px 48px', position: 'relative', overflow: 'hidden',
            }} className="auth-left-panel">
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '360px' }}>
                    {/* Logo */}
                    <div style={{
                        width: '70px', height: '70px', background: 'white',
                        borderRadius: '20px', margin: '0 auto 28px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}>
                        🍕
                    </div>

                    <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: '10px' }}>
                        QuickBite
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '44px' }}>
                        Order food from the<br />best restaurants near you
                    </p>

                    {/* Food emojis grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '260px', margin: '0 auto' }}>
                        {['🍕', '🍔', '🌮', '🍜', '🥘', '🍱'].map((e, i) => (
                            <div key={i} style={{
                                background: 'rgba(255,255,255,0.15)',
                                borderRadius: '14px',
                                aspectRatio: '1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.8rem',
                                backdropFilter: 'blur(4px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                animation: `float ${3.5 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
                            }}>
                                {e}
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '24px', marginTop: '40px', justifyContent: 'center' }}>
                        {[['500+', 'Restaurants'], ['30min', 'Avg Delivery'], ['4.8★', 'Rated']].map(([val, label]) => (
                            <div key={label} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'white' }}>{val}</div>
                                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Form Panel ── */}
            <div style={{
                width: '440px', minWidth: '340px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '48px 44px',
                background: 'white',
            }}>
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#93959F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Welcome back!
                    </div>
                    <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#282C3F', letterSpacing: '-0.3px' }}>
                        Sign in to your account
                    </h2>
                </div>

                {errors.api && (
                    <div style={{
                        background: '#FFF5F5', border: '1px solid #FFCCCC',
                        borderRadius: '6px', padding: '11px 14px',
                        color: '#E23744', fontSize: '0.83rem', fontWeight: 600,
                        marginBottom: '20px',
                    }}>
                        ⚠ {errors.api}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>
                            Email address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="you@email.com"
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px',
                                    border: `1.5px solid ${errors.email ? '#E23744' : '#E9E9EB'}`,
                                    borderRadius: '6px', fontSize: '0.875rem',
                                    fontFamily: 'inherit', color: '#282C3F', outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#FC8019'}
                                onBlur={e => e.target.style.borderColor = errors.email ? '#E23744' : '#E9E9EB'}
                            />
                        </div>
                        {errors.email && <p style={{ color: '#E23744', fontSize: '0.74rem', marginTop: '4px', fontWeight: 600 }}>{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#282C3F' }}>Password</label>
                            <button type="button" style={{ fontSize: '0.78rem', color: '#FC8019', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                Forgot password?
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input
                                type={showPassword ? 'text' : 'password'} name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '12px 40px 12px 40px',
                                    border: `1.5px solid ${errors.password ? '#E23744' : '#E9E9EB'}`,
                                    borderRadius: '6px', fontSize: '0.875rem',
                                    fontFamily: 'inherit', color: '#282C3F', outline: 'none',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => e.target.style.borderColor = '#FC8019'}
                                onBlur={e => e.target.style.borderColor = errors.password ? '#E23744' : '#E9E9EB'}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                                position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
                                background: 'none', border: 'none', cursor: 'pointer', color: '#93959F', display: 'flex',
                            }}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && <p style={{ color: '#E23744', fontSize: '0.74rem', marginTop: '4px', fontWeight: 600 }}>{errors.password}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '14px',
                            background: loading ? '#CCCCCC' : '#FC8019',
                            border: 'none', borderRadius: '6px',
                            color: 'white', fontSize: '0.9rem', fontWeight: 800,
                            fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            letterSpacing: '0.3px', textTransform: 'uppercase',
                            transition: 'background 0.2s',
                            marginTop: '6px',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#E37012'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FC8019'; }}
                    >
                        {loading ? (
                            <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</>
                        ) : (
                            <>Login <ArrowRight size={17} /></>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
                    <span style={{ color: '#93959F', fontSize: '0.78rem', fontWeight: 500 }}>New to QuickBite?</span>
                    <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
                </div>

                <Link to="/register" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    width: '100%', padding: '13px',
                    background: 'white',
                    border: '1.5px solid #FC8019',
                    borderRadius: '6px',
                    color: '#FC8019', fontSize: '0.9rem', fontWeight: 800,
                    textDecoration: 'none',
                    letterSpacing: '0.3px', textTransform: 'uppercase',
                    transition: 'all 0.2s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FFF3E8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                >
                    Create Account
                </Link>

                {/* Admin link */}
                <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F0F0F0' }}>
                    <p style={{ fontSize: '0.82rem', color: '#93959F' }}>
                        Are you an admin?{' '}
                        <Link to="/admin/login" style={{ color: '#FC8019', fontWeight: 700, textDecoration: 'none' }}>
                            Admin Login →
                        </Link>
                    </p>
                </div>

                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.75rem', color: '#93959F', lineHeight: 1.6 }}>
                    By continuing, you agree to our{' '}
                    <span style={{ color: '#FC8019', cursor: 'pointer', fontWeight: 600 }}>Terms of Service</span> &{' '}
                    <span style={{ color: '#FC8019', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>
                </p>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
                @media (max-width: 768px) { .auth-left-panel { display: none !important; } }
            `}</style>
        </div>
    );
};

export default Login;
