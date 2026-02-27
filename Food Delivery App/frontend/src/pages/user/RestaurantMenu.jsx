import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, ShoppingBag, Star, Clock, Leaf, ChevronDown } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

const FOOD_FALLBACKS = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30990466d2e9?w=400&h=300&fit=crop',
];

const RestaurantMenu = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    const { cartCount, updateCartCount } = useCart();

    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [vegOnly, setVegOnly] = useState(false);
    const [toasts, setToasts] = useState([]);

    // { foodId: quantity } — tracks qty per item in this session
    const [quantities, setQuantities] = useState({});
    // { foodId: bool } — tracks API loading state per item
    const [loadingItems, setLoadingItems] = useState({});

    const addToast = (msg, type = 'success') => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg, type }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2500);
    };

    const fetchData = async () => {
        setLoading(true); setError(false);
        try {
            const [r, f] = await Promise.all([
                API.get(`/restaurant/${restaurantId}`),
                API.get(`/food/${restaurantId}`),
            ]);
            setRestaurant(r.data);
            setFoods(f.data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { fetchData(); }, [restaurantId]);

    const categories = useMemo(() => ['All', ...new Set(foods.map(f => f.category))], [foods]);

    const filteredFoods = useMemo(() => foods.filter(food => {
        const matchCat = activeCategory === 'All' || food.category === activeCategory;
        const matchSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchVeg = !vegOnly || food.isVeg !== false;
        return matchCat && matchSearch && matchVeg;
    }), [foods, activeCategory, searchQuery, vegOnly]);

    /* ── Cart Helpers ── */
    const totalCartQty = Object.values(quantities).reduce((a, b) => a + b, 0);

    const handleAdd = async (food) => {
        if (!food.isAvailable) return;
        setLoadingItems(p => ({ ...p, [food._id]: true }));
        try {
            await API.post('/cart/add', { foodId: food._id, quantity: 1 });
            setQuantities(p => ({ ...p, [food._id]: (p[food._id] || 0) + 1 }));
            updateCartCount(cartCount + 1);
            addToast(`${food.name} added to cart!`);
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to add item', 'error');
        } finally {
            setLoadingItems(p => ({ ...p, [food._id]: false }));
        }
    };

    const handleIncrease = async (food) => {
        setLoadingItems(p => ({ ...p, [food._id]: true }));
        try {
            await API.post('/cart/add', { foodId: food._id, quantity: 1 });
            setQuantities(p => ({ ...p, [food._id]: (p[food._id] || 0) + 1 }));
            updateCartCount(cartCount + 1);
        } catch {
            addToast('Failed to update', 'error');
        } finally {
            setLoadingItems(p => ({ ...p, [food._id]: false }));
        }
    };

    const handleDecrease = async (food) => {
        const current = quantities[food._id] || 0;
        if (current <= 0) return;
        setLoadingItems(p => ({ ...p, [food._id]: true }));
        try {
            await API.post('/cart/add', { foodId: food._id, quantity: -1 });
            setQuantities(p => ({ ...p, [food._id]: Math.max(0, (p[food._id] || 0) - 1) }));
            updateCartCount(Math.max(0, cartCount - 1));
        } catch {
            addToast('Failed to update', 'error');
        } finally {
            setLoadingItems(p => ({ ...p, [food._id]: false }));
        }
    };

    /* ── Loading ── */
    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', fontFamily: "'Inter', sans-serif" }}>
            <div style={{ height: '260px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill , minmax(300px, 1fr))', gap: '1px' }}>
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ background: 'white', borderBottom: '1px solid #F0F0F0' }}>
                        <div style={{ height: '3px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.5s infinite' }} />
                        <div style={{ padding: '20px', display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ height: '14px', width: '40%', background: '#F0F0F0', borderRadius: '4px' }} />
                                <div style={{ height: '12px', width: '90%', background: '#F0F0F0', borderRadius: '4px' }} />
                                <div style={{ height: '12px', width: '60%', background: '#F0F0F0', borderRadius: '4px' }} />
                                <div style={{ height: '16px', width: '25%', background: '#F0F0F0', borderRadius: '4px', marginTop: '8px' }} />
                            </div>
                            <div style={{ width: '130px', height: '110px', borderRadius: '12px', background: '#F0F0F0', flexShrink: 0 }} />
                        </div>
                    </div>
                ))}
            </div>
            <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
        </div>
    );

    /* ── Error ── */
    if (error || !restaurant) return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", gap: '12px' }}>
            <div style={{ fontSize: '4rem' }}>🍽️</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#282C3F' }}>
                {error ? 'Something went wrong' : 'Restaurant not found'}
            </h2>
            <p style={{ color: '#93959F', fontSize: '0.875rem' }}>
                {error ? 'Could not load the menu. Please try again.' : "We couldn't find this restaurant."}
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button onClick={() => navigate('/')} style={btnStyle('#282C3F')}>Back to Home</button>
                {error && <button onClick={fetchData} style={btnStyle('#FC8019')}>Retry</button>}
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#F8F8F8', paddingTop: '72px', fontFamily: "'Inter', -apple-system, sans-serif" }}>

            {/* ── Toast ── */}
            <div style={{ position: 'fixed', top: '90px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {toasts.map(t => (
                    <div key={t.id} style={{
                        background: t.type === 'success' ? '#48C479' : '#E23744',
                        color: 'white', fontWeight: 700, fontSize: '0.82rem',
                        padding: '10px 16px', borderRadius: '8px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                        animation: 'slideIn 0.3s ease',
                    }}>
                        {t.type === 'success' ? '✓ ' : '! '}{t.msg}
                    </div>
                ))}
            </div>

            {/* ── Restaurant Banner ── */}
            <div style={{ position: 'relative', height: '240px', overflow: 'hidden', background: '#FFF3E8' }}>
                {restaurant.image ? (
                    <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #FFF3E8, #FFE0C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7rem' }}>
                        🍽️
                    </div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }} />

                {/* Back */}
                <button onClick={() => navigate(-1)} style={{
                    position: 'absolute', top: '16px', left: '16px',
                    background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%',
                    width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backdropFilter: 'blur(6px)', color: '#282C3F', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                    <ArrowLeft size={18} />
                </button>

                {/* Restaurant Info */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '-0.3px', marginBottom: '4px' }}>
                            {restaurant.name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>
                                <MapPin size={13} style={{ color: '#FC8019' }} />
                                <span>{restaurant.address}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ background: '#48C479', color: 'white', borderRadius: '5px', padding: '2px 7px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                    <Star size={10} style={{ fill: 'white' }} /> 4.8
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>500+ ratings</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' }}>
                                <Clock size={12} />
                                <span>30–40 min</span>
                            </div>
                            <span style={{
                                background: restaurant.isActive ? 'rgba(72,196,121,0.2)' : 'rgba(226,55,68,0.2)',
                                border: `1px solid ${restaurant.isActive ? '#48C479' : '#E23744'}`,
                                color: restaurant.isActive ? '#48C479' : '#E23744',
                                borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700,
                            }}>
                                {restaurant.isActive ? '● Open' : '● Closed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Sticky Controls: Category Tabs + Search ── */}
            <div style={{ position: 'sticky', top: '72px', zIndex: 40, background: 'white', borderBottom: '1px solid #E9E9EB', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {/* Category tabs */}
                    <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid #F5F5F5' }}>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                                padding: '14px 20px', whiteSpace: 'nowrap',
                                fontSize: '0.8rem', fontWeight: 700,
                                border: 'none', background: 'none',
                                cursor: 'pointer', fontFamily: 'inherit',
                                color: activeCategory === cat ? '#FC8019' : '#686B78',
                                borderBottom: `2px solid ${activeCategory === cat ? '#FC8019' : 'transparent'}`,
                                marginBottom: '-1px',
                                textTransform: 'uppercase', letterSpacing: '0.04em',
                                transition: 'all 0.2s',
                            }}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search + Veg toggle row */}
                    <div style={{ padding: '10px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                            <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="Search menu items..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%', padding: '9px 12px 9px 34px',
                                    border: '1px solid #E9E9EB', borderRadius: '6px',
                                    fontSize: '0.82rem', fontFamily: 'inherit',
                                    color: '#282C3F', outline: 'none', background: '#FAFAFA',
                                }}
                                onFocus={e => { e.target.style.borderColor = '#FC8019'; e.target.style.background = 'white'; }}
                                onBlur={e => { e.target.style.borderColor = '#E9E9EB'; e.target.style.background = '#FAFAFA'; }}
                            />
                        </div>
                        <button onClick={() => setVegOnly(!vegOnly)} style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px',
                            border: `1.5px solid ${vegOnly ? '#48C479' : '#E9E9EB'}`,
                            borderRadius: '6px',
                            background: vegOnly ? '#F0FBF4' : 'white',
                            color: vegOnly ? '#48C479' : '#686B78',
                            fontSize: '0.8rem', fontWeight: 700,
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.2s',
                        }}>
                            <Leaf size={14} />
                            Veg
                        </button>
                        <span style={{ color: '#93959F', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                            {filteredFoods.length} items
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Food Items — Swiggy list layout ── */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 0 40px' }}>
                {filteredFoods.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍽️</div>
                        <h3 style={{ fontWeight: 700, color: '#282C3F', marginBottom: '8px' }}>No items found</h3>
                        <p style={{ color: '#93959F', fontSize: '0.85rem', marginBottom: '16px' }}>Try a different category or clear the search</p>
                        <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} style={btnStyle('#FC8019')}>
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    filteredFoods.map((item, idx) => (
                        <FoodRow
                            key={item._id}
                            item={item}
                            idx={idx}
                            qty={quantities[item._id] || 0}
                            loading={loadingItems[item._id]}
                            onAdd={() => handleAdd(item)}
                            onIncrease={() => handleIncrease(item)}
                            onDecrease={() => handleDecrease(item)}
                        />
                    ))
                )}
            </div>

            {/* ── Floating View Cart Button ── */}
            {totalCartQty > 0 && (
                <div style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, animation: 'slideUp 0.3s ease' }}>
                    <button onClick={() => navigate('/cart')} style={{
                        background: '#FC8019', color: 'white', border: 'none',
                        borderRadius: '12px', padding: '14px 28px',
                        fontFamily: 'inherit', fontWeight: 800, fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: '0 8px 32px rgba(252,128,25,0.4)',
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.25)', borderRadius: '6px',
                            padding: '2px 8px', fontSize: '0.78rem',
                        }}>
                            {totalCartQty} item{totalCartQty !== 1 ? 's' : ''}
                        </div>
                        View Cart
                        <ShoppingBag size={18} />
                    </button>
                </div>
            )}

            <style>{`
                @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
                @keyframes slideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
                @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(20px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
                @keyframes popIn  { from{transform:scale(0.8);opacity:0} to{transform:scale(1);opacity:1} }
            `}</style>
        </div>
    );
};

/* ──────────────────────────────────────────────
   FOOD ROW — exact Swiggy list-row style
   Left: veg dot + name + desc + price
   Right: image + ADD / − qty + button
────────────────────────────────────────────── */
const FoodRow = ({ item, idx, qty, loading, onAdd, onIncrease, onDecrease }) => {
    const [imgErr, setImgErr] = useState(false);
    const imgSrc = (item.image && !imgErr) ? item.image : FOOD_FALLBACKS[idx % FOOD_FALLBACKS.length];

    const isVeg = item.isVeg !== false;
    const hasQty = qty > 0;

    return (
        <div style={{
            background: 'white',
            borderBottom: '1px solid #F5F5F5',
            padding: '20px 24px',
            display: 'flex', alignItems: 'flex-start', gap: '16px',
            transition: 'background 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
            {/* ── LEFT: info ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
                {/* Veg / Non-veg indicator */}
                <div style={{ marginBottom: '6px' }}>
                    <div style={{
                        width: '18px', height: '18px',
                        border: `2px solid ${isVeg ? '#48C479' : '#E23744'}`,
                        borderRadius: '3px',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: isVeg ? '#48C479' : '#E23744',
                        }} />
                    </div>
                </div>

                {/* Name */}
                <h3 style={{
                    fontSize: '0.97rem', fontWeight: 700, color: '#282C3F',
                    marginBottom: '5px', lineHeight: 1.25,
                }}>
                    {item.name}
                </h3>

                {/* Price */}
                <p style={{ fontSize: '1rem', fontWeight: 800, color: '#282C3F', marginBottom: '8px' }}>
                    ₹{item.price}
                </p>

                {/* Rating row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span style={{
                        background: '#48C479', color: 'white', borderRadius: '4px',
                        padding: '1px 6px', fontSize: '0.68rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: '2px',
                    }}>
                        <Star size={9} style={{ fill: 'white' }} />
                        4.{2 + (idx % 7)}
                    </span>
                    <span style={{ color: '#93959F', fontSize: '0.72rem' }}>
                        {120 + idx * 37} ratings
                    </span>
                </div>

                {/* Description */}
                <p style={{
                    fontSize: '0.8rem', color: '#93959F', lineHeight: 1.55,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    maxWidth: '380px',
                }}>
                    {item.description || 'Fresh and delicious, made with the finest quality ingredients for an unforgettable taste.'}
                </p>

                {/* Unavailable tag */}
                {!item.isAvailable && (
                    <span style={{
                        display: 'inline-block', marginTop: '8px',
                        background: '#FFF5F5', border: '1px solid #FECACA',
                        color: '#E23744', fontSize: '0.72rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '4px',
                    }}>
                        Currently Unavailable
                    </span>
                )}
            </div>

            {/* ── RIGHT: Image + ADD button ── */}
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                {/* Food image */}
                <div style={{
                    width: '130px', height: '110px',
                    borderRadius: '12px', overflow: 'hidden',
                    background: '#FFF3E8',
                    position: 'relative',
                    border: '1px solid #F0F0F0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}>
                    <img
                        src={imgSrc}
                        alt={item.name}
                        onError={() => setImgErr(true)}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {/* "Sold Out" overlay */}
                    {!item.isAvailable && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(255,255,255,0.65)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{
                                background: '#E23744', color: 'white', fontSize: '0.65rem',
                                fontWeight: 800, padding: '3px 8px', borderRadius: '4px',
                                textTransform: 'uppercase',
                            }}>Sold Out</span>
                        </div>
                    )}
                </div>

                {/* ── ADD / Quantity Selector ── */}
                {item.isAvailable && (
                    !hasQty ? (
                        /* Initial ADD button */
                        <button
                            onClick={onAdd}
                            disabled={loading}
                            style={{
                                width: '90px', padding: '9px 0',
                                border: '1.5px solid #FC8019',
                                borderRadius: '8px',
                                background: 'white',
                                color: '#FC8019',
                                fontSize: '0.88rem', fontWeight: 800,
                                cursor: loading ? 'wait' : 'pointer',
                                fontFamily: 'inherit',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                transition: 'all 0.2s',
                                boxShadow: '0 1px 4px rgba(252,128,25,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#FC8019'; e.currentTarget.style.color = 'white'; } }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#FC8019'; }}
                        >
                            {loading ? (
                                <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #FC8019', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                            ) : '+ ADD'}
                        </button>
                    ) : (
                        /* Quantity stepper — appears after ADD */
                        <div style={{
                            width: '90px', height: '38px',
                            background: '#FC8019', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            overflow: 'hidden',
                            boxShadow: '0 2px 10px rgba(252,128,25,0.3)',
                            animation: 'popIn 0.2s ease',
                        }}>
                            <button
                                onClick={onDecrease}
                                disabled={loading}
                                style={{
                                    width: '30px', height: '100%', border: 'none',
                                    background: 'transparent', color: 'white',
                                    fontSize: '1.3rem', fontWeight: 900,
                                    cursor: loading ? 'wait' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                −
                            </button>
                            <span style={{ fontSize: '0.95rem', fontWeight: 900, color: 'white', minWidth: '20px', textAlign: 'center' }}>
                                {loading ? (
                                    <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                                ) : qty}
                            </span>
                            <button
                                onClick={onIncrease}
                                disabled={loading}
                                style={{
                                    width: '30px', height: '100%', border: 'none',
                                    background: 'transparent', color: 'white',
                                    fontSize: '1.3rem', fontWeight: 900,
                                    cursor: loading ? 'wait' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                +
                            </button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

/* shared button style helper */
const btnStyle = (bg) => ({
    background: bg, color: 'white', border: 'none', borderRadius: '6px',
    padding: '11px 22px', fontSize: '0.875rem', fontWeight: 800,
    cursor: 'pointer', fontFamily: 'inherit',
    textTransform: 'uppercase', letterSpacing: '0.04em',
});

export default RestaurantMenu;
