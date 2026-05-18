import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote, ShoppingBag, ShieldCheck, Info, CheckCircle } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

const FOOD_FALLBACKS = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop',
];

const Checkout = () => {
    const navigate = useNavigate();
    const { updateCartCount } = useCart();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [progress, setProgress] = useState(0);
    const [formData, setFormData] = useState({ deliveryAddress: '', paymentMethod: 'COD' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await API.get('/cart');
                if (!data.items || data.items.length === 0) { navigate('/cart'); return; }
                setCartItems(data.items);
            } catch { navigate('/cart'); }
            finally { setLoading(false); }
        })();
    }, [navigate]);

    const subtotal = useMemo(() => cartItems.reduce((a, i) => a + i.foodId.price * i.quantity, 0), [cartItems]);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const grandTotal = subtotal + deliveryFee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.deliveryAddress || formData.deliveryAddress.length < 10) {
            setErrors({ deliveryAddress: 'Please enter a full delivery address (min 10 chars).' });
            return;
        }
        setPlacingOrder(true);
        try {
            await API.post('/order', formData);
            updateCartCount(0);
            setShowSuccess(true);
            const iv = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(iv); return 100; } return p + 1; }), 30);
            setTimeout(() => navigate('/orders'), 3500);
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Failed to place order.' });
        } finally { setPlacingOrder(false); }
    };

    /* ── Loading ── */
    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #FC8019', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 14px' }} />
                <p style={{ color: '#93959F', fontWeight: 600, fontSize: '0.85rem' }}>Loading checkout...</p>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', fontFamily: "'Inter', -apple-system, sans-serif" }}>

            {/* ═══ SUCCESS MODAL ═══ */}
            {showSuccess && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} />
                    <div style={{
                        background: 'white', borderRadius: '20px', padding: '48px 36px', maxWidth: '380px', width: '100%',
                        textAlign: 'center', position: 'relative', zIndex: 1, boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        animation: 'popIn 0.4s ease',
                    }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: '#F0FBF4', border: '3px solid #48C479',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                        }}>
                            <CheckCircle size={40} style={{ color: '#48C479' }} />
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#282C3F', marginBottom: '8px' }}>Order Placed! 🎉</h2>
                        <p style={{ color: '#93959F', fontSize: '0.85rem', marginBottom: '24px', lineHeight: 1.6 }}>
                            Your delicious meal is being prepared with love.
                        </p>
                        <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#93959F', fontWeight: 700 }}>
                            <span>Redirecting to orders...</span>
                            <span>{progress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#F0F0F0', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #48C479, #FC8019)', borderRadius: '10px', transition: 'width 0.1s' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* ═══ HEADER ═══ */}
            <div style={{ background: 'white', borderBottom: '1px solid #E9E9EB', padding: '20px 24px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <button onClick={() => navigate('/cart')} style={{
                            background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                            alignItems: 'center', gap: '6px', color: '#93959F', fontSize: '0.82rem',
                            fontWeight: 600, fontFamily: 'inherit', marginBottom: '6px', padding: 0,
                        }}>
                            <ArrowLeft size={15} /> Back to cart
                        </button>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#282C3F', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Checkout <span style={{ fontSize: '1.2rem' }}>⚡</span>
                        </h1>
                    </div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: '#F0FBF4', border: '1px solid #C6F0D4', borderRadius: '8px',
                        padding: '6px 12px',
                    }}>
                        <ShieldCheck size={15} style={{ color: '#48C479' }} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#48C479' }}>Secure Checkout</span>
                    </div>
                </div>
            </div>

            {/* ═══ MAIN CONTENT ═══ */}
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }} className="checkout-grid">
                {/* ── LEFT: Form ── */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Delivery Address */}
                    <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#282C3F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#FFF3E8', borderRadius: '8px', padding: '6px', display: 'flex' }}>
                                <MapPin size={18} style={{ color: '#FC8019' }} />
                            </div>
                            Delivery Address
                        </h3>
                        <textarea
                            value={formData.deliveryAddress}
                            onChange={e => { setFormData({ ...formData, deliveryAddress: e.target.value }); setErrors({}); }}
                            placeholder="Flat No, Street Name, Landmark, Area, City - Pincode"
                            rows={3}
                            style={{
                                width: '100%', border: `1.5px solid ${errors.deliveryAddress ? '#E23744' : '#E9E9EB'}`,
                                borderRadius: '10px', padding: '14px', fontSize: '0.875rem',
                                fontFamily: 'inherit', color: '#282C3F', outline: 'none',
                                resize: 'vertical', transition: 'border-color 0.2s', background: '#FAFAFA',
                            }}
                            onFocus={e => e.target.style.borderColor = '#FC8019'}
                            onBlur={e => e.target.style.borderColor = errors.deliveryAddress ? '#E23744' : '#E9E9EB'}
                        />
                        {errors.deliveryAddress && (
                            <p style={{ color: '#E23744', fontSize: '0.75rem', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Info size={12} /> {errors.deliveryAddress}
                            </p>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#282C3F', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ background: '#EFF6FF', borderRadius: '8px', padding: '6px', display: 'flex' }}>
                                <CreditCard size={18} style={{ color: '#3B82F6' }} />
                            </div>
                            Payment Method
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {/* COD */}
                            <PaymentOption
                                selected={formData.paymentMethod === 'COD'}
                                onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                                icon={<Banknote size={22} />}
                                title="Cash on Delivery"
                                desc="Pay when your order arrives"
                                color="#FC8019"
                            />
                            {/* Online */}
                            <PaymentOption
                                selected={formData.paymentMethod === 'Online'}
                                onClick={() => setFormData({ ...formData, paymentMethod: 'Online' })}
                                icon={<CreditCard size={22} />}
                                title="Online Payment"
                                desc="Cards, UPI, Netbanking"
                                color="#3B82F6"
                            />
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <button type="submit" disabled={placingOrder} style={{
                        width: '100%', padding: '16px',
                        background: placingOrder ? '#CCC' : '#FC8019',
                        border: 'none', borderRadius: '12px', color: 'white',
                        fontSize: '1rem', fontWeight: 800, fontFamily: 'inherit',
                        cursor: placingOrder ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        boxShadow: '0 4px 16px rgba(252,128,25,0.3)',
                        transition: 'all 0.2s', letterSpacing: '0.02em',
                    }}
                        onMouseEnter={e => { if (!placingOrder) e.currentTarget.style.background = '#E37012'; }}
                        onMouseLeave={e => { if (!placingOrder) e.currentTarget.style.background = '#FC8019'; }}
                    >
                        {placingOrder ? (
                            <><span style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Placing Order...</>
                        ) : (
                            <><ShoppingBag size={20} /> Place Order — ₹{grandTotal}</>
                        )}
                    </button>
                    {errors.api && <p style={{ color: '#E23744', textAlign: 'center', fontWeight: 600, fontSize: '0.85rem' }}>{errors.api}</p>}
                </form>

                {/* ── RIGHT: Order Summary ── */}
                <div style={{ position: 'sticky', top: '96px', alignSelf: 'start' }}>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '24px', border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#282C3F', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #F5F5F5' }}>
                            Order Summary
                        </h3>

                        {/* Items */}
                        <div style={{ maxHeight: '280px', overflowY: 'auto', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                            {cartItems.map((item, idx) => {
                                const img = item.foodId.image || FOOD_FALLBACKS[idx % FOOD_FALLBACKS.length];
                                return (
                                    <div key={item.foodId._id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#FFF3E8' }}>
                                            <img src={img} alt={item.foodId.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={e => { e.target.src = FOOD_FALLBACKS[0]; }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#282C3F', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.foodId.name}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                                <span style={{ background: '#FFF3E8', color: '#FC8019', borderRadius: '4px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 700 }}>
                                                    ×{item.quantity}
                                                </span>
                                                <span style={{ fontSize: '0.72rem', color: '#93959F' }}>₹{item.foodId.price} each</span>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#282C3F' }}>₹{item.foodId.price * item.quantity}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bill Details */}
                        <div style={{ borderTop: '1px solid #F5F5F5', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                <span style={{ color: '#686B78' }}>Subtotal</span>
                                <span style={{ fontWeight: 700, color: '#282C3F' }}>₹{subtotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                                <span style={{ color: '#686B78' }}>Delivery Fee</span>
                                <span style={{ fontWeight: 700, color: deliveryFee === 0 ? '#48C479' : '#282C3F' }}>
                                    {deliveryFee === 0 ? 'FREE ✓' : `₹${deliveryFee}`}
                                </span>
                            </div>
                            {deliveryFee > 0 && (
                                <div style={{ background: '#FFF3E8', borderRadius: '8px', padding: '8px 12px', fontSize: '0.72rem', color: '#FC8019', fontWeight: 600 }}>
                                    💡 Add ₹{500 - subtotal} more for FREE delivery!
                                </div>
                            )}
                            <div style={{ borderTop: '1px dashed #E9E9EB', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', color: '#93959F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grand Total</div>
                                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#282C3F' }}>₹{grandTotal}</div>
                                </div>
                                <div style={{ background: '#FFF3E8', border: '1px solid #FFE0C0', borderRadius: '8px', padding: '4px 10px' }}>
                                    <span style={{ color: '#FC8019', fontSize: '0.72rem', fontWeight: 800 }}>+{Math.floor(grandTotal / 10)} pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
                @keyframes popIn { from{transform:scale(0.85);opacity:0} to{transform:scale(1);opacity:1} }
                @media (max-width: 850px) { .checkout-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </div>
    );
};

/* ── Payment Option Component ── */
const PaymentOption = ({ selected, onClick, icon, title, desc, color }) => (
    <div onClick={onClick} style={{
        padding: '16px', borderRadius: '12px',
        border: `2px solid ${selected ? color : '#E9E9EB'}`,
        background: selected ? `${color}08` : 'white',
        cursor: 'pointer', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', transition: 'all 0.2s',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                padding: '10px', borderRadius: '10px',
                background: selected ? color : '#F0F0F0',
                color: selected ? 'white' : '#93959F',
                display: 'flex', transition: 'all 0.2s',
            }}>
                {icon}
            </div>
            <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#282C3F' }}>{title}</div>
                <div style={{ fontSize: '0.72rem', color: '#93959F', marginTop: '2px' }}>{desc}</div>
            </div>
        </div>
        {/* Radio circle */}
        <div style={{
            width: '20px', height: '20px', borderRadius: '50%',
            border: `2px solid ${selected ? color : '#D4D4D4'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
        }}>
            {selected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color }} />}
        </div>
    </div>
);

export default Checkout;
