import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
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
            setErrors({
                email: !formData.email ? 'Email is required' : null,
                password: !formData.password ? 'Password is required' : null,
            });
            return;
        }
        setLoading(true);
        try {
            const user = await login(formData.email, formData.password);
            if (user.role !== 'admin') {
                const msg = 'Access denied. Admin accounts only.';
                setErrors({ api: msg });
                showToast(msg, 'error');
                return;
            }
            showToast('Welcome back, Admin! 👋', 'success');
            setTimeout(() => navigate('/admin/dashboard'), 900);
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid credentials.';
            setErrors({ api: msg });
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            fontFamily: "'Inter', -apple-system, sans-serif",
            background: '#F8F8F8',
        }}>
            {/* Toast */}
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

            {/* ── Left Panel ── */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(150deg, #1C1C1C 0%, #282C3F 100%)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '60px 48px',
                position: 'relative', overflow: 'hidden',
            }} className="admin-left-panel">
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(252,128,25,0.06)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'rgba(252,128,25,0.04)', borderRadius: '50%' }} />
                {/* Dot grid */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
                    {/* Shield icon */}
                    <div style={{
                        width: '72px', height: '72px', margin: '0 auto 24px',
                        background: 'rgba(252,128,25,0.1)',
                        border: '2px solid rgba(252,128,25,0.2)',
                        borderRadius: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Shield size={36} style={{ color: '#FC8019' }} />
                    </div>

                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.3px', marginBottom: '8px' }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '40px', lineHeight: 1.6 }}>
                        Manage orders, restaurants, and food items from the control panel
                    </p>

                    {/* Feature list */}
                    {[
                        ['📋', 'Manage all incoming orders'],
                        ['🏪', 'Add & edit restaurants'],
                        ['🍔', 'Manage food items & prices'],
                        ['📊', 'Track revenue & stats'],
                        ['✅', 'Approve & update order status'],
                    ].map(([icon, text], i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            background: 'rgba(255,255,255,0.04)',
                            borderRadius: '10px', padding: '12px 16px',
                            marginBottom: '8px', textAlign: 'left',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 500 }}>{text}</span>
                        </div>
                    ))}

                    {/* QuickBite brand */}
                    <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#FC8019', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
                            🍕
                        </div>
                        <span style={{ color: '#FC8019', fontWeight: 800, fontSize: '1rem' }}>QuickBite Admin</span>
                    </div>
                </div>
            </div>

            {/* ── Right: Form Panel ── */}
            <div style={{
                width: '440px', minWidth: '340px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '48px 44px',
                background: 'white',
            }}>
                <div style={{ marginBottom: '28px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: '#FFF3E8', borderRadius: '20px', padding: '4px 12px',
                        marginBottom: '14px',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FC8019' }} />
                        <span style={{ fontSize: '0.72rem', color: '#FC8019', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Restricted Access
                        </span>
                    </div>
                    <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#282C3F', letterSpacing: '-0.3px' }}>
                        Sign in as Admin
                    </h2>
                    <p style={{ color: '#93959F', fontSize: '0.82rem', marginTop: '4px' }}>
                        Authorized personnel only
                    </p>
                </div>

                {errors.api && (
                    <div style={{
                        background: '#FFF5F5', border: '1px solid #FECACA',
                        borderRadius: '8px', padding: '12px 14px',
                        color: '#E23744', fontSize: '0.83rem', fontWeight: 600,
                        marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                        ⚠ {errors.api}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>
                            Admin Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input
                                type="email" name="email"
                                value={formData.email} onChange={handleChange}
                                placeholder="admin@quickbite.com"
                                style={{
                                    width: '100%', padding: '13px 13px 13px 40px',
                                    border: `1.5px solid ${errors.email ? '#E23744' : '#E9E9EB'}`,
                                    borderRadius: '8px', fontSize: '0.875rem',
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
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input
                                type={showPassword ? 'text' : 'password'} name="password"
                                value={formData.password} onChange={handleChange}
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '13px 40px 13px 40px',
                                    border: `1.5px solid ${errors.password ? '#E23744' : '#E9E9EB'}`,
                                    borderRadius: '8px', fontSize: '0.875rem',
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
                            background: loading ? '#CCC' : '#282C3F',
                            border: 'none', borderRadius: '8px',
                            color: 'white', fontSize: '0.9rem', fontWeight: 800,
                            fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            letterSpacing: '0.04em', textTransform: 'uppercase',
                            transition: 'background 0.2s', marginTop: '4px',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#FC8019'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#282C3F'; }}
                    >
                        {loading ? (
                            <><span style={{ width: '17px', height: '17px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Signing In...</>
                        ) : (
                            <><Shield size={17} /> Admin Login <ArrowRight size={17} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E9E9EB', textAlign: 'center' }}>
                    <Link to="/login" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        color: '#93959F', fontSize: '0.82rem', fontWeight: 600,
                        textDecoration: 'none', transition: 'color 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = '#FC8019'}
                        onMouseLeave={e => e.currentTarget.style.color = '#93959F'}
                    >
                        <ArrowLeft size={14} /> Back to User Login
                    </Link>
                    <p style={{ fontSize: '0.82rem', color: '#93959F', marginTop: '10px' }}>
                        Don't have an admin account?{' '}
                        <Link to="/admin/register" style={{ color: '#FC8019', fontWeight: 700, textDecoration: 'none' }}>
                            Register →
                        </Link>
                    </p>
                </div>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.7rem', color: '#C9C9C9', lineHeight: 1.5 }}>
                    🔒 This area is for authorized administrators only.<br />All access attempts are logged.
                </p>
            </div>

            <style>{`
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
                @media (max-width: 768px) { .admin-left-panel { display: none !important; } }
            `}</style>
        </div>
    );
};

export default AdminLogin;
