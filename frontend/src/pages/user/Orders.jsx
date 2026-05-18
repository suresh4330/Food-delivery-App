import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Package, Clock, MapPin, CheckCircle2, Truck,
    ChefHat, ClipboardList, CreditCard, Banknote,
    ChevronDown, ChevronUp, RefreshCw, ArrowRight
} from 'lucide-react';
import API from '../../api/axios';

const FOOD_FALLBACKS = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30990466d2e9?w=120&h=120&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=120&h=120&fit=crop',
];

const STATUS_CONFIG = {
    'Pending': { color: '#F59E0B', bg: '#FFFBEB', border: '#FCD34D', label: 'Order Placed', step: 1 },
    'Preparing': { color: '#3B82F6', bg: '#EFF6FF', border: '#93C5FD', label: 'Preparing', step: 2 },
    'Out for Delivery': { color: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD', label: 'On the Way', step: 3 },
    'Delivered': { color: '#48C479', bg: '#F0FBF4', border: '#BBF7D0', label: 'Delivered', step: 4 },
    'Cancelled': { color: '#E23744', bg: '#FFF5F5', border: '#FECACA', label: 'Cancelled', step: 0 },
};

const TABS = ['All', 'Active', 'Delivered', 'Cancelled'];

const Orders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [expandedOrders, setExpandedOrders] = useState({});

    const fetchOrders = async () => {
        setLoading(true); setError(false);
        try {
            const res = await API.get('/orders/user');
            const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
            setOrders(data);
        } catch { setError(true); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchOrders(); }, []);

    const toggleExpand = id => setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));

    const filteredOrders = useMemo(() => orders.filter(o => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Active') return ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status);
        return o.status === activeTab;
    }), [orders, activeTab]);

    const getCount = tab => {
        if (tab === 'All') return orders.length;
        if (tab === 'Active') return orders.filter(o => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status)).length;
        return orders.filter(o => o.status === tab).length;
    };

    const fmtDate = d => {
        const date = new Date(d);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            + ' · '
            + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    const STEPS = [
        { id: 'Pending', Icon: ClipboardList, label: 'Placed' },
        { id: 'Preparing', Icon: ChefHat, label: 'Preparing' },
        { id: 'Out for Delivery', Icon: Truck, label: 'On Way' },
        { id: 'Delivered', Icon: CheckCircle2, label: 'Delivered' },
    ];

    // ── Loading ──
    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="skeleton" style={{ height: '32px', width: '180px', borderRadius: '6px' }} />
                <div className="skeleton" style={{ height: '44px', width: '320px', borderRadius: '22px' }} />
                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '240px', borderRadius: '12px' }} />)}
            </div>
        </div>
    );

    // ── Error ──
    if (error) return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>😕</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#282C3F', marginBottom: '8px' }}>Could not load orders</h2>
            <p style={{ color: '#93959F', fontSize: '0.875rem', marginBottom: '20px' }}>Something went wrong. Please try again.</p>
            <button onClick={fetchOrders} className="swiggy-btn">Retry</button>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', fontFamily: "'Inter', sans-serif", paddingBottom: '40px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '28px 24px' }}>

                {/* Header */}
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#282C3F', letterSpacing: '-0.3px', marginBottom: '2px' }}>
                        My Orders
                    </h1>
                    <p style={{ color: '#93959F', fontSize: '0.8rem' }}>{orders.length} orders placed</p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
                    {TABS.map(tab => {
                        const count = getCount(tab);
                        const active = activeTab === tab;
                        return (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: `1.5px solid ${active ? '#FC8019' : '#E9E9EB'}`,
                                background: active ? '#FC8019' : 'white',
                                color: active ? 'white' : '#686B78',
                                fontSize: '0.82rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', gap: '6px',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s',
                            }}>
                                {tab}
                                <span style={{
                                    background: active ? 'rgba(255,255,255,0.25)' : '#F0F0F0',
                                    color: active ? 'white' : '#93959F',
                                    borderRadius: '10px', padding: '1px 7px',
                                    fontSize: '0.7rem', fontWeight: 800,
                                }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Orders list ── */}
                {filteredOrders.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredOrders.map((order, orderIdx) => {
                            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                            const isExpanded = expandedOrders[order._id];
                            const visibleItems = isExpanded ? order.items : order.items.slice(0, 3);

                            return (
                                <div key={order._id} style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    border: '1px solid #F0F0F0',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                }}>

                                    {/* ─ Card Header ─ */}
                                    <div style={{
                                        padding: '16px 20px',
                                        borderBottom: '1px solid #F5F5F5',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                                    }}>
                                        <div>
                                            <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#282C3F', marginBottom: '3px' }}>
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#93959F', fontSize: '0.75rem' }}>
                                                <Clock size={12} style={{ color: '#FC8019' }} />
                                                {fmtDate(order.createdAt)}
                                            </div>
                                        </div>

                                        {/* Status badge */}
                                        <div style={{
                                            padding: '5px 12px',
                                            borderRadius: '20px',
                                            background: statusCfg.bg,
                                            border: `1.5px solid ${statusCfg.border}`,
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                        }}>
                                            <div style={{
                                                width: '7px', height: '7px', borderRadius: '50%',
                                                background: statusCfg.color,
                                                animation: ['Pending', 'Preparing', 'Out for Delivery'].includes(order.status) ? 'pulse 1.5s ease-in-out infinite' : 'none',
                                            }} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: statusCfg.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                {statusCfg.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ─ Progress Tracker ─ */}
                                    {order.status !== 'Cancelled' && (
                                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F5F5F5' }}>
                                            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                {/* Track line */}
                                                <div style={{
                                                    position: 'absolute', top: '16px', left: '20px', right: '20px', height: '2px',
                                                    background: '#E9E9EB', zIndex: 0,
                                                }}>
                                                    <div style={{
                                                        height: '100%', background: '#FC8019',
                                                        width: `${Math.max(0, ((statusCfg.step - 1) / 3) * 100)}%`,
                                                        transition: 'width 0.6s ease',
                                                    }} />
                                                </div>

                                                {STEPS.map((step, i) => {
                                                    const done = statusCfg.step > i + 1;
                                                    const current = statusCfg.step === i + 1;
                                                    const StepIcon = step.Icon;
                                                    return (
                                                        <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1, flex: 1 }}>
                                                            <div style={{
                                                                width: '34px', height: '34px', borderRadius: '50%',
                                                                background: done || current ? '#FC8019' : '#F0F0F0',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                border: current ? '3px solid #FCD34D' : 'none',
                                                                boxShadow: current ? '0 0 0 4px rgba(252,128,25,0.15)' : 'none',
                                                                transition: 'all 0.3s',
                                                            }}>
                                                                {done
                                                                    ? <CheckCircle2 size={16} style={{ color: 'white' }} />
                                                                    : <StepIcon size={16} style={{ color: done || current ? 'white' : '#CCCCCC' }} />
                                                                }
                                                            </div>
                                                            <span style={{
                                                                fontSize: '0.65rem', fontWeight: 700,
                                                                color: done || current ? '#FC8019' : '#CCCCCC',
                                                                textAlign: 'center', lineHeight: 1.2,
                                                                textTransform: 'uppercase', letterSpacing: '0.03em',
                                                            }}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* ─ Food Items with Images ─ */}
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #F5F5F5' }}>
                                        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#93959F', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                                            Items Ordered
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {visibleItems.map((item, itemIdx) => {
                                                const imgSrc = item.image || FOOD_FALLBACKS[(orderIdx + itemIdx) % FOOD_FALLBACKS.length];
                                                return (
                                                    <div key={itemIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        {/* Food image thumbnail */}
                                                        <div style={{
                                                            width: '52px', height: '52px',
                                                            borderRadius: '8px', overflow: 'hidden',
                                                            background: '#FFF3E8', flexShrink: 0,
                                                            border: '1px solid #F0F0F0',
                                                        }}>
                                                            <img
                                                                src={imgSrc}
                                                                alt={item.name}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={e => { e.target.src = FOOD_FALLBACKS[0]; }}
                                                            />
                                                        </div>

                                                        {/* Item info */}
                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                                <span style={{
                                                                    fontSize: '0.88rem', fontWeight: 700, color: '#282C3F',
                                                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                                }}>
                                                                    {item.name}
                                                                </span>
                                                                <span style={{
                                                                    fontSize: '0.68rem', background: '#FFF3E8',
                                                                    color: '#FC8019', borderRadius: '4px',
                                                                    padding: '1px 6px', fontWeight: 700, flexShrink: 0,
                                                                }}>
                                                                    ×{item.quantity}
                                                                </span>
                                                            </div>
                                                            <span style={{ fontSize: '0.75rem', color: '#93959F', fontWeight: 500 }}>
                                                                ₹{item.price} each
                                                            </span>
                                                        </div>

                                                        {/* Item total */}
                                                        <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#282C3F', flexShrink: 0 }}>
                                                            ₹{item.price * item.quantity}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Show more/less */}
                                        {order.items.length > 3 && (
                                            <button
                                                onClick={() => toggleExpand(order._id)}
                                                style={{
                                                    marginTop: '12px', background: 'none', border: 'none',
                                                    color: '#FC8019', fontSize: '0.78rem', fontWeight: 700,
                                                    cursor: 'pointer', fontFamily: 'inherit',
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                }}
                                            >
                                                {isExpanded
                                                    ? <><ChevronUp size={14} /> Show less</>
                                                    : <><ChevronDown size={14} /> +{order.items.length - 3} more items</>
                                                }
                                            </button>
                                        )}
                                    </div>

                                    {/* ─ Footer ─ */}
                                    <div style={{
                                        padding: '14px 20px',
                                        background: '#FAFAFA',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {/* Address */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#686B78', fontSize: '0.78rem' }}>
                                                <MapPin size={13} style={{ color: '#FC8019', flexShrink: 0 }} />
                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>
                                                    {order.deliveryAddress}
                                                </span>
                                            </div>
                                            {/* Payment */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                {order.paymentMethod === 'COD'
                                                    ? <Banknote size={13} style={{ color: '#48C479' }} />
                                                    : <CreditCard size={13} style={{ color: '#3B82F6' }} />
                                                }
                                                <span style={{ fontSize: '0.72rem', color: '#93959F', fontWeight: 600 }}>
                                                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Total */}
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.65rem', color: '#93959F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                                                Total Paid
                                            </p>
                                            <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#282C3F' }}>
                                                ₹{order.totalAmount}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* ── Empty State ── */
                    <div style={{
                        background: 'white', borderRadius: '12px', border: '1px solid #E9E9EB',
                        padding: '60px 24px', textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '14px' }}>
                            {activeTab === 'All' ? '📦' : '🔍'}
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#282C3F', marginBottom: '8px' }}>
                            {activeTab === 'All' ? 'No orders yet' : `No ${activeTab} orders`}
                        </h3>
                        <p style={{ color: '#93959F', fontSize: '0.85rem', maxWidth: '280px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                            {activeTab === 'All'
                                ? "You haven't placed any orders yet. Order delicious food now!"
                                : `No orders with status "${activeTab}" found.`
                            }
                        </p>
                        {activeTab === 'All' ? (
                            <button onClick={() => navigate('/')} className="swiggy-btn">
                                Start Ordering <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button onClick={() => setActiveTab('All')} style={{
                                background: 'none', border: 'none', color: '#FC8019',
                                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit',
                            }}>
                                View all orders
                            </button>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .swiggy-btn {
                    background: #FC8019; color: white; border: none; border-radius: 6px;
                    padding: 12px 24px; font-size: 0.875rem; font-weight: 800;
                    cursor: pointer; font-family: inherit;
                    display: inline-flex; align-items: center; gap: 8px;
                    text-transform: uppercase; letter-spacing: 0.03em;
                    transition: background 0.2s;
                }
                .swiggy-btn:hover { background: #E37012; }
            `}</style>
        </div>
    );
};

export default Orders;
