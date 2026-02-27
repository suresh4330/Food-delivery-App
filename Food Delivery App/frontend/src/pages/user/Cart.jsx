import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, ArrowLeft, Tag } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

const FOOD_FALLBACKS = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30990466d2e9?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop',
];

const Cart = () => {
    const navigate = useNavigate();
    const { cartCount, updateCartCount } = useCart();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingItems, setUpdatingItems] = useState({});
    const [toasts, setToasts] = useState([]);
    const [coupon, setCoupon] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    const fetchCart = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/cart');
            setCartItems(data.items || []);
            updateCartCount(data.items?.length || 0);
        } catch {
            addToast('Failed to load cart', 'error');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchCart(); }, []);

    const subtotal = useMemo(() => cartItems.reduce((a, i) => a + i.foodId.price * i.quantity, 0), [cartItems]);
    const discount = couponApplied ? Math.min(100, Math.round(subtotal * 0.1)) : 0;
    const deliveryFee = subtotal > 0 ? (subtotal > 500 ? 0 : 40) : 0;
    const grandTotal = subtotal - discount + deliveryFee;

    const handleUpdateQty = async (foodId, delta) => {
        const cur = cartItems.find(i => i.foodId._id === foodId);
        if (!cur) return;
        const newQty = cur.quantity + delta;
        if (newQty < 1) { handleRemove(foodId); return; }
        setUpdatingItems(prev => ({ ...prev, [foodId]: true }));
        try {
            await API.post('/cart/add', { foodId, quantity: delta });
            setCartItems(prev => prev.map(i => i.foodId._id === foodId ? { ...i, quantity: newQty } : i));
        } catch { addToast('Failed to update', 'error'); }
        finally { setUpdatingItems(prev => ({ ...prev, [foodId]: false })); }
    };

    const handleRemove = async (foodId) => {
        setUpdatingItems(prev => ({ ...prev, [foodId]: true }));
        try {
            await API.delete(`/cart/remove/${foodId}`);
            setCartItems(prev => prev.filter(i => i.foodId._id !== foodId));
            updateCartCount(cartCount - 1);
            addToast('Item removed');
        } catch { addToast('Failed to remove', 'error'); }
        finally { setUpdatingItems(prev => ({ ...prev, [foodId]: false })); }
    };

    const applyCoupon = () => {
        if (coupon.toUpperCase() === 'QUICKFIRST') {
            setCouponApplied(true);
            addToast('Coupon applied! 10% off up to ₹100 🎉');
        } else {
            addToast('Invalid coupon code', 'error');
        }
    };

    // ── Loading ──
    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '12px' }} />)}
                </div>
                <div className="skeleton" style={{ height: '360px', borderRadius: '12px' }} />
            </div>
        </div>
    );

    // ── Empty ──
    if (cartItems.length === 0) return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '5rem', marginBottom: '16px' }}>🛒</div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#282C3F', marginBottom: '8px' }}>Your cart is empty</h2>
                <p style={{ color: '#93959F', fontSize: '0.875rem', marginBottom: '24px', maxWidth: '300px', margin: '0 auto 24px' }}>
                    You have not added any items to your cart yet. Explore our restaurants!
                </p>
                <button onClick={() => navigate('/')} className="swiggy-btn">
                    Browse Restaurants
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', fontFamily: "'Inter', sans-serif" }}>

            {/* Toast */}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {toasts.map(t => (
                    <div key={t.id} style={{
                        background: t.type === 'success' ? '#48C479' : '#E23744',
                        color: 'white', fontWeight: 700, fontSize: '0.85rem',
                        padding: '11px 18px', borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}>
                        {t.message}
                    </div>
                ))}
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#282C3F', letterSpacing: '-0.3px' }}>
                            My Cart
                        </h1>
                        <p style={{ color: '#93959F', fontSize: '0.8rem', marginTop: '2px' }}>
                            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                        </p>
                    </div>
                    <button onClick={() => navigate('/')} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: 'none', border: '1px solid #E9E9EB',
                        borderRadius: '6px', padding: '8px 14px',
                        color: '#FC8019', fontSize: '0.82rem', fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                        <Plus size={14} /> Add more
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }} className="cart-grid">

                    {/* ── Left: Items ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {/* Offer banner */}
                        {subtotal < 500 && (
                            <div style={{
                                background: '#FFF3E8', border: '1px dashed #FC8019',
                                borderRadius: '10px', padding: '12px 16px',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                fontSize: '0.82rem', color: '#FC8019', fontWeight: 600,
                            }}>
                                <Tag size={16} />
                                Add ₹{500 - subtotal} more for <strong>FREE delivery!</strong>
                            </div>
                        )}
                        {subtotal >= 500 && (
                            <div style={{
                                background: '#F0FBF4', border: '1px solid #48C479',
                                borderRadius: '10px', padding: '12px 16px',
                                display: 'flex', alignItems: 'center', gap: '10px',
                                fontSize: '0.82rem', color: '#48C479', fontWeight: 700,
                            }}>
                                🎉 You've unlocked FREE delivery!
                            </div>
                        )}

                        {/* Cart items */}
                        {cartItems.map((item, idx) => {
                            const imgSrc = item.foodId.image || FOOD_FALLBACKS[idx % FOOD_FALLBACKS.length];
                            return (
                                <div key={item.foodId._id} style={{
                                    background: 'white',
                                    border: '1px solid #F0F0F0',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                                    transition: 'box-shadow 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'}
                                >
                                    {/* Food Image */}
                                    <div style={{ width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#FFF3E8' }}>
                                        <img
                                            src={imgSrc}
                                            alt={item.foodId.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={e => { e.target.src = FOOD_FALLBACKS[0]; }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* Veg indicator */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                            <div style={{
                                                width: '14px', height: '14px',
                                                border: '1.5px solid #48C479', borderRadius: '2px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#48C479' }} />
                                            </div>
                                        </div>
                                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#282C3F', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.foodId.name}
                                        </h3>
                                        <p style={{ fontSize: '0.72rem', color: '#93959F', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                                            {item.foodId.category}
                                        </p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#282C3F' }}>
                                            ₹{item.foodId.price}
                                            <span style={{ fontSize: '0.72rem', color: '#93959F', fontWeight: 500 }}> each</span>
                                        </p>
                                    </div>

                                    {/* Quantity controls */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', border: '1.5px solid #FC8019', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                                        <button
                                            onClick={() => handleUpdateQty(item.foodId._id, -1)}
                                            disabled={updatingItems[item.foodId._id]}
                                            style={{
                                                width: '34px', height: '34px',
                                                background: 'none', border: 'none',
                                                color: '#FC8019', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: 'inherit', fontWeight: 900, fontSize: '1.1rem',
                                            }}
                                        >
                                            −
                                        </button>
                                        <div style={{ width: '32px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#FC8019' }}>
                                            {updatingItems[item.foodId._id]
                                                ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                                                : item.quantity
                                            }
                                        </div>
                                        <button
                                            onClick={() => handleUpdateQty(item.foodId._id, 1)}
                                            disabled={updatingItems[item.foodId._id]}
                                            style={{
                                                width: '34px', height: '34px',
                                                background: 'none', border: 'none',
                                                color: '#FC8019', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: 'inherit', fontWeight: 900, fontSize: '1.1rem',
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Item total */}
                                    <div style={{ minWidth: '60px', textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#282C3F' }}>₹{item.foodId.price * item.quantity}</div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => handleRemove(item.foodId._id)}
                                        style={{
                                            width: '32px', height: '32px',
                                            border: 'none', borderRadius: '6px',
                                            background: 'none', cursor: 'pointer',
                                            color: '#93959F', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s', flexShrink: 0,
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#FFF5F5'; e.currentTarget.style.color = '#E23744'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#93959F'; }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}

                        {/* Coupon */}
                        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #F0F0F0' }}>
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#282C3F', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Tag size={15} style={{ color: '#FC8019' }} /> Apply Coupon
                            </h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter coupon code  (try QUICKFIRST)"
                                    value={coupon}
                                    onChange={e => setCoupon(e.target.value.toUpperCase())}
                                    disabled={couponApplied}
                                    style={{
                                        flex: 1, padding: '10px 14px',
                                        border: '1px solid #E9E9EB', borderRadius: '6px',
                                        fontSize: '0.82rem', fontFamily: 'inherit',
                                        color: '#282C3F', outline: 'none',
                                        background: couponApplied ? '#F8F8F8' : 'white',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#FC8019'}
                                    onBlur={e => e.target.style.borderColor = '#E9E9EB'}
                                />
                                <button
                                    onClick={couponApplied ? () => { setCouponApplied(false); setCoupon(''); } : applyCoupon}
                                    style={{
                                        padding: '10px 16px',
                                        border: 'none', borderRadius: '6px',
                                        background: couponApplied ? '#E23744' : '#FC8019',
                                        color: 'white', fontSize: '0.82rem', fontWeight: 800,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                    }}
                                >
                                    {couponApplied ? 'Remove' : 'Apply'}
                                </button>
                            </div>
                            {couponApplied && (
                                <p style={{ color: '#48C479', fontSize: '0.78rem', fontWeight: 700, marginTop: '8px' }}>
                                    ✓ Coupon applied — you save ₹{discount}!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Bill Summary ── */}
                    <div style={{ position: 'sticky', top: '88px' }}>
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                            <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#282C3F', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Bill Details
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#686B78' }}>Item Total</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#282C3F' }}>₹{subtotal}</span>
                                </div>
                                {couponApplied && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#48C479' }}>Coupon Discount</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#48C479' }}>− ₹{discount}</span>
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.85rem', color: '#686B78' }}>Delivery Fee</span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: deliveryFee === 0 ? '#48C479' : '#282C3F' }}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div style={{ height: '1px', background: '#E9E9EB', margin: '4px 0' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#282C3F' }}>To Pay</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#282C3F' }}>₹{grandTotal}</span>
                                </div>
                            </div>

                            {subtotal > 500 && (
                                <div style={{ background: '#F0FBF4', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px', fontSize: '0.78rem', color: '#48C479', fontWeight: 600 }}>
                                    🎉 You're saving ₹40 on delivery!
                                </div>
                            )}

                            <button
                                onClick={() => navigate('/checkout')}
                                style={{
                                    width: '100%', padding: '15px',
                                    background: '#FC8019', border: 'none', borderRadius: '8px',
                                    color: 'white', fontSize: '0.95rem', fontWeight: 800,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    textTransform: 'uppercase', letterSpacing: '0.03em',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#E37012'}
                                onMouseLeave={e => e.currentTarget.style.background = '#FC8019'}
                            >
                                Proceed to Checkout <ArrowRight size={18} />
                            </button>

                            <button onClick={() => navigate('/')} style={{
                                width: '100%', marginTop: '10px',
                                background: 'none', border: 'none',
                                color: '#93959F', fontSize: '0.82rem', fontWeight: 600,
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                            }}>
                                <ArrowLeft size={14} /> Continue Shopping
                            </button>
                        </div>

                        {/* Safety tags */}
                        <div style={{ marginTop: '14px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {['🔒 100% Secure', '🚀 Fast Delivery', '💯 Quality Assured'].map(tag => (
                                <span key={tag} style={{ fontSize: '0.72rem', color: '#93959F', fontWeight: 600 }}>{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @media (max-width: 700px) {
                    .cart-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default Cart;
