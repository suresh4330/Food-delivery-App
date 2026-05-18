import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import API from '../../api/axios';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (msg, type) => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    const validate = () => {
        const e = {};
        if (!formData.name) e.name = 'Full name is required';
        if (!formData.email) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email';
        if (!formData.password) e.password = 'Password is required';
        else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
        if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await API.post('/auth/register', { name: formData.name, email: formData.email, password: formData.password });
            showToast('Account created successfully! 🎉', 'success');
            setTimeout(() => navigate('/login'), 1400);
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            setErrors({ api: msg });
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const getStrength = () => {
        const p = formData.password;
        if (!p) return null;
        if (p.length < 6) return { label: 'Weak', color: '#E23744', pct: '33%' };
        if (p.length < 10 || !/[A-Z]/.test(p)) return { label: 'Medium', color: '#FC8019', pct: '66%' };
        return { label: 'Strong', color: '#48C479', pct: '100%' };
    };
    const strength = getStrength();

    const field = (name, label, type, Icon, showToggle, setShow) => (
        <div key={name}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#282C3F', marginBottom: '6px' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <Icon size={16} style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                <input
                    type={showToggle !== undefined ? (showToggle ? 'text' : 'password') : type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={
                        name === 'name' ? 'John Doe'
                            : name === 'email' ? 'you@email.com'
                                : name === 'password' ? 'Min 6 characters'
                                    : 'Repeat your password'
                    }
                    style={{
                        width: '100%',
                        padding: `12px ${setShow ? '40px' : '12px'} 12px 40px`,
                        border: `1.5px solid ${errors[name] ? '#E23744' : '#E9E9EB'}`,
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        color: '#282C3F',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#FC8019'}
                    onBlur={e => e.target.style.borderColor = errors[name] ? '#E23744' : '#E9E9EB'}
                />
                {setShow && (
                    <button type="button" onClick={() => setShow(!showToggle)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#93959F', display: 'flex' }}>
                        {showToggle ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}
            </div>
            {name === 'password' && strength && (
                <div style={{ marginTop: '7px' }}>
                    <div style={{ height: '3px', background: '#E9E9EB', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: strength.pct, background: strength.color, borderRadius: '3px', transition: 'width 0.3s, background 0.3s' }} />
                    </div>
                    <span style={{ fontSize: '0.71rem', color: strength.color, fontWeight: 700, marginTop: '3px', display: 'block' }}>{strength.label} password</span>
                </div>
            )}
            {errors[name] && <p style={{ color: '#E23744', fontSize: '0.74rem', marginTop: '4px', fontWeight: 600 }}>{errors[name]}</p>}
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif", background: 'white' }}>

            {/* Toast */}
            {toast.show && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 999,
                    background: toast.type === 'success' ? '#48C479' : '#E23744',
                    color: 'white', fontWeight: 700, fontSize: '0.875rem',
                    padding: '12px 20px', borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                }}>
                    {toast.message}
                </div>
            )}

            {/* ── LEFT: Orange Branding Panel ── */}
            <div
                className="auth-left-panel"
                style={{
                    flex: 1,
                    background: 'linear-gradient(170deg, #FC8019 0%, #E95B0C 100%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '60px 48px',
                    position: 'relative', overflow: 'hidden',
                }}
            >
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '320px', height: '320px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '360px', textAlign: 'center' }}>
                    <div style={{
                        width: '68px', height: '68px', background: 'white', borderRadius: '20px',
                        margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    }}>
                        🍕
                    </div>

                    <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                        Join QuickBite
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '40px' }}>
                        Create your free account and discover<br />the best food near you
                    </p>

                    {/* Benefits */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                        {[
                            '🎁 Free delivery on your first order',
                            '🍔 500+ restaurants to choose from',
                            '⚡ Real-time order tracking',
                            '💰 Exclusive deals & discounts',
                            '⭐ Earn rewards on every order',
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(255,255,255,0.12)',
                                borderRadius: '10px', padding: '11px 14px',
                                backdropFilter: 'blur(4px)',
                            }}>
                                <span style={{ fontSize: '1rem' }}>{item.split(' ')[0]}</span>
                                <span style={{ color: 'rgba(255,255,255,0.92)', fontSize: '0.82rem', fontWeight: 600 }}>
                                    {item.split(' ').slice(1).join(' ')}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Social proof */}
                    <div style={{
                        marginTop: '28px', padding: '14px 18px',
                        background: 'rgba(255,255,255,0.12)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', gap: '12px',
                    }}>
                        <div style={{ display: 'flex' }}>
                            {['😊', '🙂', '😄', '😁'].map((e, i) => (
                                <div key={i} style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: `hsl(${20 + i * 12}, 85%, 58%)`,
                                    border: '2px solid rgba(255,255,255,0.4)',
                                    marginLeft: i ? '-8px' : 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '14px',
                                }}>
                                    {e}
                                </div>
                            ))}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.4 }}>
                            <strong style={{ color: 'white' }}>50,000+</strong> customers<br />trust QuickBite daily
                        </p>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Form Panel ── */}
            <div style={{
                width: '440px', minWidth: '340px',
                display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: '40px 44px',
                background: 'white', overflowY: 'auto',
            }}>
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#93959F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        Get started — it's free!
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#282C3F', letterSpacing: '-0.3px' }}>
                        Create your account
                    </h2>
                </div>

                {errors.api && (
                    <div style={{
                        background: '#FFF5F5', border: '1px solid #FFCCCC',
                        borderRadius: '6px', padding: '11px 14px',
                        color: '#E23744', fontSize: '0.83rem', fontWeight: 600, marginBottom: '18px',
                    }}>
                        ⚠ {errors.api}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {field('name', 'Full Name', 'text', User, undefined, undefined)}
                    {field('email', 'Email Address', 'email', Mail, undefined, undefined)}
                    {field('password', 'Password', 'password', Lock, showPass, setShowPass)}
                    {field('confirmPassword', 'Confirm Password', 'password', Lock, showConfirm, setShowConfirm)}

                    <button
                        type="submit" disabled={loading}
                        style={{
                            width: '100%', padding: '14px',
                            background: loading ? '#CCC' : '#FC8019',
                            border: 'none', borderRadius: '6px',
                            color: 'white', fontSize: '0.9rem', fontWeight: 800,
                            fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            letterSpacing: '0.3px', textTransform: 'uppercase',
                            transition: 'background 0.2s', marginTop: '6px',
                        }}
                        onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#E37012'; }}
                        onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#FC8019'; }}
                    >
                        {loading
                            ? <><Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> Creating Account...</>
                            : <>Create Account <ArrowRight size={17} /></>
                        }
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.73rem', color: '#93959F', lineHeight: 1.6 }}>
                        By registering, you agree to our{' '}
                        <span style={{ color: '#FC8019', cursor: 'pointer', fontWeight: 600 }}>Terms</span> &{' '}
                        <span style={{ color: '#FC8019', cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>
                    </p>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '22px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
                    <span style={{ color: '#93959F', fontSize: '0.78rem' }}>Already have an account?</span>
                    <div style={{ flex: 1, height: '1px', background: '#E9E9EB' }} />
                </div>

                <Link to="/login" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    padding: '13px',
                    background: 'white', border: '1.5px solid #FC8019',
                    borderRadius: '6px', color: '#FC8019',
                    fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none',
                    letterSpacing: '0.3px', textTransform: 'uppercase',
                    transition: 'background 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF3E8'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                    Sign In Instead
                </Link>

                {/* Admin link */}
                <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F0F0F0' }}>
                    <p style={{ fontSize: '0.82rem', color: '#93959F' }}>
                        Want to register as admin?{' '}
                        <Link to="/admin/register" style={{ color: '#FC8019', fontWeight: 700, textDecoration: 'none' }}>
                            Admin Register →
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 768px) { .auth-left-panel { display: none !important; } }
            `}</style>
        </div>
    );
};

export default Register;
