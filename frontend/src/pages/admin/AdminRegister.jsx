import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, User, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import API from '../../api/axios';

const AdminRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const getStrength = (pw) => {
        if (!pw) return { label: '', color: '#E9E9EB', pct: 0 };
        let s = 0;
        if (pw.length >= 6) s++;
        if (pw.length >= 8) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^A-Za-z0-9]/.test(pw)) s++;
        if (s <= 1) return { label: 'Weak', color: '#E23744', pct: 25 };
        if (s <= 3) return { label: 'Medium', color: '#D97706', pct: 55 };
        return { label: 'Strong', color: '#48C479', pct: 100 };
    };
    const strength = getStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name || formData.name.length < 2) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password || formData.password.length < 6) newErrors.password = 'Min 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

        setLoading(true);
        try {
            await API.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'admin',
            });
            showToast('Admin account created! 🎉');
            setTimeout(() => navigate('/admin/login'), 1500);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setErrors({ api: msg });
            showToast(msg, 'error');
        } finally { setLoading(false); }
    };

    const inputStyle = (field) => ({
        width: '100%', padding: '13px 13px 13px 40px',
        border: `1.5px solid ${errors[field] ? '#E23744' : '#E9E9EB'}`,
        borderRadius: '8px', fontSize: '0.875rem',
        fontFamily: 'inherit', color: '#282C3F', outline: 'none',
        transition: 'border-color 0.2s',
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif", background: '#F8F8F8' }}>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 999,
                    background: toast.type === 'success' ? '#48C479' : '#E23744',
                    color: 'white', fontWeight: 700, fontSize: '0.875rem',
                    padding: '12px 20px', borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {toast.msg}
                </div>
            )}

            {/* ── Left Panel ── */}
            <div style={{
                flex: 1, background: 'linear-gradient(150deg, #1C1C1C 0%, #282C3F 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '60px 48px', position: 'relative', overflow: 'hidden',
            }} className="admin-left-panel">
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'rgba(252,128,25,0.06)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'rgba(252,128,25,0.04)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '340px' }}>
                    <div style={{
                        width: '72px', height: '72px', margin: '0 auto 24px',
                        background: 'rgba(252,128,25,0.1)', border: '2px solid rgba(252,128,25,0.2)',
                        borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Shield size={36} style={{ color: '#FC8019' }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '8px' }}>
                        Join as Admin
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '36px', lineHeight: 1.6 }}>
                        Create an admin account to manage orders, restaurants, and food items
                    </p>

                    {[
                        ['✅', 'Approve & manage customer orders'],
                        ['🏪', 'Add restaurants & food items'],
                        ['📊', 'Track revenue & analytics'],
                        ['🔔', 'Real-time order notifications'],
                    ].map(([icon, text], i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
                            padding: '12px 16px', marginBottom: '8px', textAlign: 'left',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 500 }}>{text}</span>
                        </div>
                    ))}

                    <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#FC8019', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🍕</div>
                        <span style={{ color: '#FC8019', fontWeight: 800, fontSize: '1rem' }}>QuickBite Admin</span>
                    </div>
                </div>
            </div>

            {/* ── Right: Form ── */}
            <div style={{
                width: '460px', minWidth: '340px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '40px 44px', background: 'white',
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                        background: '#FFF3E8', borderRadius: '20px', padding: '4px 12px', marginBottom: '12px',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FC8019' }} />
                        <span style={{ fontSize: '0.72rem', color: '#FC8019', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Admin Registration
                        </span>
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#282C3F' }}>Create Admin Account</h2>
                    <p style={{ color: '#93959F', fontSize: '0.82rem', marginTop: '4px' }}>Fill in details to get admin access</p>
                </div>

                {errors.api && (
                    <div style={{ background: '#FFF5F5', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 14px', color: '#E23744', fontSize: '0.83rem', fontWeight: 600, marginBottom: '16px' }}>
                        ⚠ {errors.api}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Name */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                placeholder="Admin Name" style={inputStyle('name')}
                                onFocus={e => e.target.style.borderColor = '#FC8019'}
                                onBlur={e => e.target.style.borderColor = errors.name ? '#E23744' : '#E9E9EB'}
                            />
                        </div>
                        {errors.name && <p style={{ color: '#E23744', fontSize: '0.74rem', marginTop: '3px', fontWeight: 600 }}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>Email</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                placeholder="admin@quickbite.com" style={inputStyle('email')}
                                onFocus={e => e.target.style.borderColor = '#FC8019'}
                                onBlur={e => e.target.style.borderColor = errors.email ? '#E23744' : '#E9E9EB'}
                            />
                        </div>
                        {errors.email && <p style={{ color: '#E23744', fontSize: '0.74rem', marginTop: '3px', fontWeight: 600 }}>{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange}
                                placeholder="Min 6 characters" style={{ ...inputStyle('password'), paddingRight: '40px' }}
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
                        {/* Strength bar */}
                        {formData.password && (
                            <div style={{ marginTop: '6px' }}>
                                <div style={{ height: '4px', background: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, borderRadius: '4px', transition: 'all 0.3s' }} />
                                </div>
                                <p style={{ fontSize: '0.68rem', fontWeight: 700, color: strength.color, marginTop: '3px' }}>{strength.label}</p>
                            </div>
                        )}
                        {errors.password && <p style={{ color: '#E23744', fontSize: '0.74rem', marginTop: '3px', fontWeight: 600 }}>{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                placeholder="Re-enter password" style={inputStyle('confirmPassword')}
                                onFocus={e => e.target.style.borderColor = '#FC8019'}
                                onBlur={e => e.target.style.borderColor = errors.confirmPassword ? '#E23744' : '#E9E9EB'}
                            />
                            {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                <CheckCircle size={16} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', color: '#48C479' }} />
                            )}
                        </div>
                        {errors.confirmPassword && <p style={{ color: '#E23744', fontSize: '0.74rem', marginTop: '3px', fontWeight: 600 }}>{errors.confirmPassword}</p>}
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '14px', marginTop: '4px',
                        background: loading ? '#CCC' : '#282C3F',
                        border: 'none', borderRadius: '8px', color: 'white',
                        fontSize: '0.9rem', fontWeight: 800, fontFamily: 'inherit',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'background 0.2s',
                    }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#FC8019'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#282C3F'; }}
                    >
                        {loading ? (
                            <><span style={{ width: '17px', height: '17px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Creating...</>
                        ) : (
                            <><Shield size={17} /> Create Admin Account <ArrowRight size={17} /></>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #E9E9EB', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.82rem', color: '#93959F' }}>
                        Already have an admin account?{' '}
                        <Link to="/admin/login" style={{ color: '#FC8019', fontWeight: 700, textDecoration: 'none' }}>
                            Sign In →
                        </Link>
                    </p>
                    <Link to="/login" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        color: '#93959F', fontSize: '0.78rem', fontWeight: 600,
                        textDecoration: 'none', marginTop: '10px',
                    }}>
                        <ArrowLeft size={13} /> Back to User Login
                    </Link>
                </div>
            </div>

            <style>{`
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
                @media (max-width: 768px) { .admin-left-panel { display: none !important; } }
            `}</style>
        </div>
    );
};

export default AdminRegister;
