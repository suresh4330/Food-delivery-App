import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Clock, CheckCircle, ArrowRight, RefreshCw, User, Package } from 'lucide-react';
import API from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

const Dashboard = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        setLoading(true); setError(false);
        try {
            const { data } = await API.get('/order/admin');
            setOrders(data || []);
        } catch { setError(true); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchData(); }, []);

    const stats = useMemo(() => ({
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        active: orders.filter(o => ['Preparing', 'Out for Delivery'].includes(o.status)).length,
        revenue: orders.reduce((a, o) => a + (o.totalAmount || 0), 0),
        today: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length,
    }), [orders]);

    const recent = useMemo(() => orders.slice(0, 5), [orders]);

    const STATUS_STYLES = {
        'Pending': { color: '#D97706', bg: '#FEF3C7' },
        'Preparing': { color: '#3B82F6', bg: '#DBEAFE' },
        'Out for Delivery': { color: '#8B5CF6', bg: '#EDE9FE' },
        'Delivered': { color: '#48C479', bg: '#F0FBF4' },
        'Cancelled': { color: '#E23744', bg: '#FFF5F5' },
    };

    const timeAgo = (d) => {
        const ms = Date.now() - new Date(d).getTime();
        const mins = Math.floor(ms / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    if (loading) return (
        <AdminLayout title="Dashboard">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[1, 2, 3, 4].map(i => <div key={i} style={{ height: '100px', background: 'white', borderRadius: '14px', border: '1px solid #F0F0F0' }} />)}
            </div>
            <div style={{ height: '300px', background: 'white', borderRadius: '14px', border: '1px solid #F0F0F0' }} />
        </AdminLayout>
    );

    if (error) return (
        <AdminLayout title="Dashboard">
            <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '14px', border: '1px solid #F0F0F0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>😕</div>
                <h2 style={{ fontWeight: 800, color: '#282C3F', marginBottom: '8px' }}>Failed to load dashboard</h2>
                <p style={{ color: '#93959F', marginBottom: '16px', fontSize: '0.85rem' }}>Something went wrong while loading data.</p>
                <button onClick={fetchData} style={{ background: '#FC8019', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    Try Again
                </button>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout title="Dashboard">
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Orders', value: stats.total, emoji: '📦', sub: `+${stats.today} today`, subColor: '#3B82F6' },
                    { label: 'Pending', value: stats.pending, emoji: '⏳', sub: stats.pending > 0 ? 'Needs attention' : 'All clear', subColor: '#D97706' },
                    { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, emoji: '💰', sub: 'All time', subColor: '#48C479' },
                    { label: 'Delivered', value: stats.delivered, emoji: '✅', sub: `${stats.active} active`, subColor: '#FC8019' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'white', borderRadius: '14px', padding: '18px',
                        border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ fontSize: '1.3rem' }}>{s.emoji}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: s.subColor, background: `${s.subColor}12`, padding: '3px 8px', borderRadius: '10px' }}>
                                {s.sub}
                            </span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#282C3F' }}>{s.value}</div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#93959F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #F0F0F0', overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #F5F5F5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#282C3F' }}>Recent Orders</h3>
                        <p style={{ fontSize: '0.72rem', color: '#93959F', marginTop: '2px' }}>Latest {recent.length} orders</p>
                    </div>
                    <button onClick={() => navigate('/admin/orders')} style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        background: 'none', border: 'none', color: '#FC8019',
                        fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                        View All Orders <ArrowRight size={14} />
                    </button>
                </div>

                {recent.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ color: '#93959F', fontSize: '0.85rem' }}>No orders yet</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#FAFAFA' }}>
                                {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Time'].map(h => (
                                    <th key={h} style={{
                                        padding: '10px 20px', textAlign: 'left',
                                        fontSize: '0.68rem', fontWeight: 700, color: '#93959F',
                                        textTransform: 'uppercase', letterSpacing: '0.05em',
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recent.map(order => {
                                const st = STATUS_STYLES[order.status] || STATUS_STYLES['Pending'];
                                return (
                                    <tr key={order._id} style={{ borderTop: '1px solid #F5F5F5' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                                    >
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{ background: '#F5F5F5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace', color: '#282C3F' }}>
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FFF3E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <User size={13} style={{ color: '#FC8019' }} />
                                                </div>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#282C3F' }}>
                                                    {order.userId?.name || 'Customer'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: '#686B78' }}>
                                            {order.items.length} items
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '0.88rem', fontWeight: 800, color: '#282C3F' }}>
                                            ₹{order.totalAmount}
                                        </td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <span style={{
                                                padding: '4px 10px', borderRadius: '12px',
                                                fontSize: '0.68rem', fontWeight: 700,
                                                background: st.bg, color: st.color,
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 20px', fontSize: '0.75rem', color: '#93959F' }}>
                                            {timeAgo(order.createdAt)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
