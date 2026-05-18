import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, CheckCircle, XCircle, Truck, ChefHat, RefreshCw, User, MapPin, Package } from 'lucide-react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const STATUS_FLOW = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
const STATUS_CONFIG = {
    'Pending': { color: '#D97706', bg: '#FEF3C7', icon: '⏳', label: 'Pending' },
    'Preparing': { color: '#3B82F6', bg: '#DBEAFE', icon: '👨‍🍳', label: 'Preparing' },
    'Out for Delivery': { color: '#8B5CF6', bg: '#EDE9FE', icon: '🛵', label: 'On the Way' },
    'Delivered': { color: '#48C479', bg: '#F0FBF4', icon: '✅', label: 'Delivered' },
    'Cancelled': { color: '#E23744', bg: '#FFF5F5', icon: '❌', label: 'Cancelled' },
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [expandedId, setExpandedId] = useState(null);
    const [toast, setToast] = useState(null);
    const [updating, setUpdating] = useState(null);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

    const fetchOrders = async () => {
        setLoading(true); setError(false);
        try {
            const { data } = await API.get('/order/admin');
            setOrders(data || []);
        } catch { setError(true); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchOrders(); }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(orderId);
        try {
            await API.put(`/order/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            showToast(`Order updated to "${newStatus}" ✓`);
        } catch { showToast('Failed to update order'); }
        finally { setUpdating(null); }
    };

    const tabs = ['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const filtered = activeTab === 'All' ? orders : orders.filter(o => o.status === activeTab);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        active: orders.filter(o => ['Preparing', 'Out for Delivery'].includes(o.status)).length,
        revenue: orders.reduce((a, o) => a + (o.totalAmount || 0), 0),
    };

    return (
        <AdminLayout title="Orders">
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', zIndex: 999,
                    background: '#282C3F', color: 'white', fontWeight: 700, fontSize: '0.85rem',
                    padding: '12px 20px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    animation: 'fadeIn 0.3s ease',
                }}>
                    {toast}
                </div>
            )}

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Orders', value: stats.total, color: '#3B82F6', emoji: '📦' },
                    { label: 'Pending', value: stats.pending, color: '#D97706', emoji: '⏳' },
                    { label: 'Active', value: stats.active, color: '#8B5CF6', emoji: '🔥' },
                    { label: 'Revenue', value: `₹${stats.revenue}`, color: '#48C479', emoji: '💰' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'white', borderRadius: '14px', padding: '18px',
                        border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.3rem' }}>{s.emoji}</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#282C3F' }}>{s.value}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#93959F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs + Refresh */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {tabs.map(tab => {
                        const isActive = activeTab === tab;
                        const cfg = STATUS_CONFIG[tab];
                        return (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                padding: '7px 16px', borderRadius: '20px',
                                border: `1.5px solid ${isActive ? (cfg?.color || '#FC8019') : '#E9E9EB'}`,
                                background: isActive ? (cfg?.bg || '#FFF3E8') : 'white',
                                color: isActive ? (cfg?.color || '#FC8019') : '#686B78',
                                fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                                fontFamily: 'inherit', transition: 'all 0.15s',
                            }}>
                                {cfg?.icon || '📋'} {tab === 'All' ? `All (${orders.length})` : `${cfg?.label || tab} (${orders.filter(o => o.status === tab).length})`}
                            </button>
                        );
                    })}
                </div>
                <button onClick={fetchOrders} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px',
                    background: 'white', border: '1px solid #E9E9EB',
                    color: '#686B78', fontSize: '0.82rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                }}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Orders List */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ height: '80px', background: 'white', borderRadius: '12px', border: '1px solid #F0F0F0' }} />
                    ))}
                </div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '14px', border: '1px solid #F0F0F0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>😕</div>
                    <p style={{ fontWeight: 700, color: '#282C3F', marginBottom: '12px' }}>Failed to load orders</p>
                    <button onClick={fetchOrders} style={{ background: '#FC8019', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Retry
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '14px', border: '1px solid #F0F0F0' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📭</div>
                    <p style={{ fontWeight: 700, color: '#282C3F' }}>No orders in "{activeTab}"</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filtered.map(order => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Pending'];
                        const isExpanded = expandedId === order._id;
                        const currentIdx = STATUS_FLOW.indexOf(order.status);

                        return (
                            <div key={order._id} style={{
                                background: 'white', borderRadius: '14px', border: '1px solid #F0F0F0',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.03)', overflow: 'hidden', transition: 'box-shadow 0.2s',
                            }}>
                                {/* Order Row (clickable) */}
                                <div onClick={() => setExpandedId(isExpanded ? null : order._id)} style={{
                                    padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px',
                                    cursor: 'pointer', transition: 'background 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                >
                                    {/* Order ID */}
                                    <div style={{
                                        background: '#F5F5F5', padding: '6px 10px', borderRadius: '6px',
                                        fontSize: '0.75rem', fontWeight: 800, color: '#282C3F', fontFamily: 'monospace',
                                    }}>
                                        #{order._id.slice(-6).toUpperCase()}
                                    </div>

                                    {/* Customer */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#282C3F' }}>
                                            {order.userId?.name || 'Customer'}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#93959F' }}>
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''} • {order.userId?.email || ''}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#282C3F' }}>₹{order.totalAmount}</div>

                                    {/* Status badge */}
                                    <div style={{
                                        padding: '5px 12px', borderRadius: '20px',
                                        background: cfg.bg, color: cfg.color,
                                        fontSize: '0.72rem', fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: '5px',
                                    }}>
                                        {cfg.icon} {cfg.label}
                                    </div>

                                    {/* Time */}
                                    <div style={{ fontSize: '0.72rem', color: '#93959F', fontWeight: 600, minWidth: '70px', textAlign: 'right' }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </div>

                                    {/* Expand arrow */}
                                    <div style={{ fontSize: '0.8rem', color: '#93959F', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                                        ▼
                                    </div>
                                </div>

                                {/* Expanded Section */}
                                {isExpanded && (
                                    <div style={{ borderTop: '1px solid #F0F0F0', padding: '20px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                            {/* Left: Items */}
                                            <div>
                                                <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#93959F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                                                    Order Items
                                                </h4>
                                                {order.items.map((item, i) => (
                                                    <div key={i} style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '8px 0', borderBottom: i < order.items.length - 1 ? '1px solid #F5F5F5' : 'none',
                                                    }}>
                                                        <div>
                                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#282C3F' }}>{item.name}</span>
                                                            <span style={{
                                                                marginLeft: '8px', background: '#FFF3E8', color: '#FC8019',
                                                                fontSize: '0.68rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                                                            }}>×{item.quantity}</span>
                                                        </div>
                                                        <span style={{ fontWeight: 700, color: '#282C3F', fontSize: '0.85rem' }}>₹{item.price * item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Right: Details */}
                                            <div>
                                                <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#93959F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                                                    Delivery Info
                                                </h4>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
                                                    <MapPin size={14} style={{ color: '#FC8019', marginTop: '2px', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '0.82rem', color: '#282C3F', lineHeight: 1.5 }}>
                                                        {order.deliveryAddress || 'Address not provided'}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                                    <Package size={14} style={{ color: '#3B82F6' }} />
                                                    <span style={{ fontSize: '0.82rem', color: '#686B78' }}>
                                                        Payment: {order.paymentMethod || 'COD'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ═══ ACTION BUTTONS ═══ */}
                                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #F0F0F0' }}>
                                            <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: '#93959F', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                                                Update Status
                                            </h4>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {/* Status progression buttons */}
                                                {STATUS_FLOW.map((status, i) => {
                                                    const sCfg = STATUS_CONFIG[status];
                                                    const isCurrent = order.status === status;
                                                    const isPast = currentIdx >= i;
                                                    const isNext = i === currentIdx + 1;
                                                    const isDisabled = order.status === 'Delivered' || order.status === 'Cancelled';

                                                    return (
                                                        <button key={status}
                                                            onClick={(e) => { e.stopPropagation(); if (!isCurrent && !isDisabled) handleUpdateStatus(order._id, status); }}
                                                            disabled={isCurrent || isDisabled || updating === order._id}
                                                            style={{
                                                                padding: '8px 16px', borderRadius: '8px',
                                                                display: 'flex', alignItems: 'center', gap: '6px',
                                                                fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 700,
                                                                cursor: (isCurrent || isDisabled) ? 'default' : 'pointer',
                                                                transition: 'all 0.15s',
                                                                border: isCurrent ? `2px solid ${sCfg.color}` : '1.5px solid #E9E9EB',
                                                                background: isCurrent ? sCfg.bg : isNext ? '#FAFAFA' : 'white',
                                                                color: isCurrent ? sCfg.color : isNext ? '#282C3F' : '#93959F',
                                                                opacity: isDisabled && !isCurrent ? 0.4 : 1,
                                                                boxShadow: isNext ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                                                            }}
                                                        >
                                                            {sCfg.icon} {sCfg.label}
                                                            {isCurrent && <span style={{ fontSize: '0.65rem' }}>✓ Current</span>}
                                                        </button>
                                                    );
                                                })}

                                                {/* Cancel button */}
                                                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, 'Cancelled'); }}
                                                        disabled={updating === order._id}
                                                        style={{
                                                            padding: '8px 16px', borderRadius: '8px',
                                                            display: 'flex', alignItems: 'center', gap: '6px',
                                                            fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 700,
                                                            cursor: 'pointer', border: '1.5px solid #FECACA',
                                                            background: 'white', color: '#E23744',
                                                            transition: 'all 0.15s', marginLeft: 'auto',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#FFF5F5'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = 'white'; }}
                                                    >
                                                        ❌ Cancel Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
            `}</style>
        </AdminLayout>
    );
};

export default AdminOrders;
