import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import API from '../../api/axios';

/* ── Swiggy-style food category circles (from screenshots) ── */
const FOOD_CATEGORIES = [
    { label: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
    { label: 'Pizzas', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
    { label: 'Rolls', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=200&fit=crop' },
    { label: 'Desserts', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&h=200&fit=crop' },
    { label: 'Chinese', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&fit=crop' },
    { label: 'Cakes', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop' },
    { label: 'South Indian', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&h=200&fit=crop' },
    { label: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=200&fit=crop' },
    { label: 'Thali', img: 'https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=200&h=200&fit=crop' },
    { label: 'Sandwiches', img: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&h=200&fit=crop' },
    { label: 'Ice Cream', img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&h=200&fit=crop' },
    { label: 'Healthy', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
];

/* ── Restaurant offer banners (like in screenshot) ── */
const OFFERS = [
    '60% OFF UPTO ₹110',
    'ITEMS AT ₹39',
    'FREE DELIVERY',
    '₹75 OFF ABOVE ₹249',
    '50% OFF UPTO ₹100',
    'ITEMS AT ₹89',
];

/* ── Restaurant fallback images ── */
const REST_FALLBACKS = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&h=300&fit=crop',
];

const CUISINE_LABELS = [
    'North Indian • Chinese',
    'Fast Food • Burgers',
    'South Indian • Combo',
    'Pizza • Pasta • Italian',
    'Chinese • Thai • Asian',
    'Biryani • Mughlai',
];

const Home = () => {
    const navigate = useNavigate();
    const catScrollRef = useRef(null);

    const [restaurants, setRestaurants] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    const [vegOnly, setVegOnly] = useState(false);
    const [activeSort, setActiveSort] = useState('Relevance');

    const fetchRestaurants = async () => {
        setLoading(true); setError(false);
        try {
            const { data } = await API.get('/restaurant');
            setRestaurants(data);
            setFiltered(data);
        } catch { setError(true); }
        finally { setLoading(false); }
    };
    useEffect(() => { fetchRestaurants(); }, []);

    useEffect(() => {
        let result = [...restaurants];
        if (search) result = result.filter(r =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.description || '').toLowerCase().includes(search.toLowerCase())
        );
        if (activeCategory) {
            const cat = activeCategory.toLowerCase();
            result = result.filter(r =>
                (r.description || '').toLowerCase().includes(cat) ||
                r.name.toLowerCase().includes(cat)
            );
        }
        if (vegOnly) result = result.filter(r => r.isVeg !== false);
        setFiltered(result);
    }, [search, vegOnly, activeCategory, restaurants]);

    const scrollCat = (dir) => {
        if (catScrollRef.current) catScrollRef.current.scrollLeft += dir * 300;
    };

    /* ── Greeting based on time ── */
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning 🌅' : hour < 17 ? 'Good afternoon ☀️' : 'Good evening 🌙';

    return (
        <div style={{ background: '#F8F8F8', minHeight: '100vh', paddingTop: '72px', fontFamily: "'Inter', -apple-system, sans-serif" }}>

            {/* ═══════════════════════════════════════════
                HERO — Search + greeting (white section)
            ═══════════════════════════════════════════ */}
            <div style={{ background: 'white', paddingBottom: '0', borderBottom: '1px solid #E9E9EB' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '28px 24px 0' }}>
                    <p style={{ fontSize: '0.8rem', color: '#93959F', fontWeight: 500, marginBottom: '4px' }}>{greeting}</p>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#282C3F', marginBottom: '20px', letterSpacing: '-0.3px' }}>
                        What would you like to order?
                    </h1>

                    {/* Search bar */}
                    <div style={{ position: 'relative', maxWidth: '560px', marginBottom: '28px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#93959F', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            placeholder="Search for restaurants and food"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', border: '1px solid #E9E9EB', borderRadius: '8px',
                                padding: '13px 14px 13px 44px', fontSize: '0.875rem',
                                fontFamily: 'inherit', color: '#282C3F', background: 'white',
                                outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}
                            onFocus={e => { e.target.style.borderColor = '#FC8019'; e.target.style.boxShadow = '0 2px 12px rgba(252,128,25,0.15)'; }}
                            onBlur={e => { e.target.style.borderColor = '#E9E9EB'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
                        />
                    </div>

                    {/* ─── FOOD CATEGORY CIRCLES (like Swiggy) ─── */}
                    <div style={{ position: 'relative', marginBottom: '0' }}>
                        {/* Left scroll btn */}
                        <button onClick={() => scrollCat(-1)} style={{
                            position: 'absolute', left: '-14px', top: '40%', transform: 'translateY(-50%)',
                            background: 'white', border: '1px solid #E9E9EB', borderRadius: '50%',
                            width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                            <ChevronLeft size={16} style={{ color: '#282C3F' }} />
                        </button>
                        {/* Right scroll btn */}
                        <button onClick={() => scrollCat(1)} style={{
                            position: 'absolute', right: '-14px', top: '40%', transform: 'translateY(-50%)',
                            background: 'white', border: '1px solid #E9E9EB', borderRadius: '50%',
                            width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                            <ChevronRight size={16} style={{ color: '#282C3F' }} />
                        </button>

                        <div ref={catScrollRef} style={{
                            display: 'flex', gap: '4px', overflowX: 'auto',
                            scrollBehavior: 'smooth', scrollbarWidth: 'none',
                            paddingBottom: '0',
                        }}>
                            {FOOD_CATEGORIES.map(cat => {
                                const isActive = activeCategory === cat.label;
                                return (
                                    <div
                                        key={cat.label}
                                        onClick={() => setActiveCategory(isActive ? null : cat.label)}
                                        style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            gap: '10px', cursor: 'pointer', flexShrink: 0,
                                            padding: '14px 12px',
                                            borderBottom: isActive ? '3px solid #FC8019' : '3px solid transparent',
                                            transition: 'all 0.2s',
                                            minWidth: '80px',
                                        }}
                                    >
                                        {/* Circular image — exact Swiggy style */}
                                        <div style={{
                                            width: '76px', height: '76px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: isActive ? '3px solid #FC8019' : '2px solid #E9E9EB',
                                            boxShadow: isActive ? '0 4px 12px rgba(252,128,25,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'all 0.2s',
                                            transform: isActive ? 'scale(1.07)' : 'scale(1)',
                                            background: '#F8F8F8',
                                        }}>
                                            <img
                                                src={cat.img}
                                                alt={cat.label}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                onError={e => { e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                        <span style={{
                                            fontSize: '0.72rem', fontWeight: isActive ? 700 : 500,
                                            color: isActive ? '#FC8019' : '#282C3F',
                                            textAlign: 'center', lineHeight: 1.3,
                                            maxWidth: '76px',
                                        }}>
                                            {cat.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <style>{`::-webkit-scrollbar{display:none}`}</style>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                PROMO BANNER
            ═══════════════════════════════════════════ */}
            <div style={{ background: 'white', padding: '16px 24px', borderBottom: '8px solid #F8F8F8' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #FC8019 0%, #E37012 60%, #d46410 100%)',
                        borderRadius: '12px', padding: '18px 24px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        overflow: 'hidden', position: 'relative', cursor: 'pointer',
                    }}>
                        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '180px', height: '180px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', right: '100px', bottom: '-50px', width: '140px', height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                                🏷️ LIMITED TIME
                            </div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', letterSpacing: '-0.3px' }}>
                                50% OFF up to ₹100
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)', marginTop: '4px' }}>
                                Use code <strong>QUICKFIRST</strong> · Valid on your first order
                            </div>
                        </div>
                        <div style={{ fontSize: '4rem', position: 'relative', zIndex: 1, animation: 'float 3s ease-in-out infinite' }}>🎉</div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                RESTAURANTS SECTION
            ═══════════════════════════════════════════ */}
            <div style={{ background: 'white', padding: '24px', paddingBottom: '40px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* Section header + filters */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#282C3F', marginBottom: '2px' }}>
                                Restaurants Near You
                            </h2>
                            <p style={{ fontSize: '0.78rem', color: '#93959F' }}>
                                {filtered.length} restaurant{filtered.length !== 1 ? 's' : ''} available
                            </p>
                        </div>

                        {/* Filter pills */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button onClick={() => setVegOnly(!vegOnly)} style={{
                                display: 'flex', alignItems: 'center', gap: '5px',
                                padding: '7px 14px', borderRadius: '20px',
                                border: `1.5px solid ${vegOnly ? '#48C479' : '#E9E9EB'}`,
                                background: vegOnly ? '#F0FBF4' : 'white',
                                color: vegOnly ? '#48C479' : '#686B78',
                                fontSize: '0.78rem', fontWeight: 700,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                            }}>
                                <Leaf size={13} /> Pure Veg
                            </button>
                            {['Rating', 'Delivery Time', 'Cost: Low to High'].map(opt => (
                                <button key={opt}
                                    onClick={() => setActiveSort(opt === activeSort ? 'Relevance' : opt)}
                                    style={{
                                        padding: '7px 14px', borderRadius: '20px',
                                        border: `1.5px solid ${activeSort === opt ? '#FC8019' : '#E9E9EB'}`,
                                        background: activeSort === opt ? '#FFF3E8' : 'white',
                                        color: activeSort === opt ? '#FC8019' : '#686B78',
                                        fontSize: '0.78rem', fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Separator line */}
                    <div style={{ height: '1px', background: '#F0F0F0', margin: '0 0 24px' }} />

                    {/* ── Loading Skeletons ── */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
                            {[...Array(8)].map((_, i) => (
                                <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', background: 'white', border: '1px solid #F0F0F0' }}>
                                    <div style={{ height: '170px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '600px 100%', animation: 'shimmer 1.5s infinite' }} />
                                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <div style={{ height: '16px', width: '70%', background: '#F0F0F0', borderRadius: '4px' }} />
                                        <div style={{ height: '12px', width: '50%', background: '#F0F0F0', borderRadius: '4px' }} />
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <div style={{ height: '12px', width: '60px', background: '#F0F0F0', borderRadius: '4px' }} />
                                            <div style={{ height: '12px', width: '60px', background: '#F0F0F0', borderRadius: '4px' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '60px 24px', background: '#FFF5F5', borderRadius: '12px', border: '1px solid #FFCCCC' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>😕</div>
                            <p style={{ color: '#E23744', fontWeight: 700, fontSize: '1rem', marginBottom: '16px' }}>
                                Something went wrong. Please try again.
                            </p>
                            <button onClick={fetchRestaurants} className="swiggy-btn">Retry</button>
                        </div>

                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#282C3F', marginBottom: '8px' }}>No results found</h3>
                            <p style={{ color: '#93959F', fontSize: '0.875rem', marginBottom: '20px' }}>Try searching something else</p>
                            <button onClick={() => setSearch('')} className="swiggy-btn">Clear Search</button>
                        </div>

                    ) : (
                        /* ── Restaurant Cards Grid ── */
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '24px' }}>
                            {filtered.map((res, idx) => (
                                <RestaurantCard
                                    key={res._id}
                                    res={res}
                                    idx={idx}
                                    onClick={() => navigate(`/restaurant/${res._id}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <footer style={{ background: '#1C1C1C', padding: '36px 24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <div style={{ width: '34px', height: '34px', background: '#FC8019', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px' }}>🍕</div>
                        <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>QuickBite</span>
                    </div>
                    <p style={{ color: '#686B78', fontSize: '0.8rem', maxWidth: '400px', lineHeight: 1.7 }}>
                        Order food online from the best restaurants near you. Fresh, fast, delivered.
                    </p>
                    <div style={{ borderTop: '1px solid #282828', marginTop: '20px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ color: '#686B78', fontSize: '0.75rem' }}>© 2025 QuickBite. All rights reserved.</span>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {['Privacy', 'Terms', 'Contact'].map(l => (
                                <span key={l} style={{ color: '#686B78', fontSize: '0.75rem', cursor: 'pointer' }}>{l}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes shimmer { 0%{background-position:-600px 0}100%{background-position:600px 0} }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            `}</style>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   RESTAURANT CARD — Swiggy style with offer overlay
═══════════════════════════════════════════════════════ */
const RestaurantCard = ({ res, idx, onClick }) => {
    const [hovered, setHovered] = useState(false);
    const [imgErr, setImgErr] = useState(false);

    const imgSrc = (res.image && !imgErr) ? res.image : REST_FALLBACKS[idx % REST_FALLBACKS.length];
    const deliveryTime = `${25 + (idx % 5) * 5}–${35 + (idx % 5) * 5} mins`;
    const costForTwo = `₹${300 + (idx % 4) * 100} for two`;
    const rating = `4.${3 + (idx % 6)}`;
    const offerText = OFFERS[idx % OFFERS.length];
    const cuisine = CUISINE_LABELS[idx % CUISINE_LABELS.length];

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: 'white', borderRadius: '16px',
                overflow: 'hidden', cursor: 'pointer',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 12px 28px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F0F0F0',
            }}
        >
            {/* ── Image with offer overlay (exactly like screenshot) ── */}
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: '#F8F8F8' }}>
                <img
                    src={imgSrc}
                    alt={res.name}
                    onError={() => setImgErr(true)}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        transform: hovered ? 'scale(1.06)' : 'scale(1)',
                    }}
                />

                {/* Offer overlay ribbon at bottom (like screenshot: "60% OFF UPTO ₹110") */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                    padding: '28px 12px 10px',
                }}>
                    <span style={{
                        background: 'linear-gradient(90deg, #FC8019, #E37012)',
                        color: 'white', fontSize: '0.68rem', fontWeight: 900,
                        padding: '4px 10px', borderRadius: '4px',
                        letterSpacing: '0.03em', textTransform: 'uppercase',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}>
                        {offerText}
                    </span>
                </div>

                {/* Closed overlay */}
                {!res.isActive && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(40,44,63,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ background: '#282C3F', color: 'white', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                            Currently Closed
                        </span>
                    </div>
                )}
            </div>

            {/* ── Info section (like screenshot) ── */}
            <div style={{ padding: '12px 14px 14px' }}>
                {/* Name + Rating badge side-by-side */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                    <h3 style={{
                        fontSize: '1rem', fontWeight: 800, color: '#282C3F',
                        flex: 1, paddingRight: '8px', lineHeight: 1.25,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        letterSpacing: '-0.2px',
                    }}>
                        {res.name}
                    </h3>
                    {/* Green rating badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '3px',
                        background: '#48C479', color: 'white',
                        fontSize: '0.72rem', fontWeight: 700,
                        padding: '3px 7px', borderRadius: '5px', flexShrink: 0,
                    }}>
                        <Star size={10} style={{ fill: 'white' }} />
                        {rating}
                    </div>
                </div>

                {/* Cuisine line (like "Fast Food • North Indian") */}
                <p style={{
                    fontSize: '0.78rem', color: '#686B78',
                    fontWeight: 500, marginBottom: '6px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                    {res.description?.split(' ').slice(0, 5).join(' ') || cuisine}
                </p>

                {/* Delivery time + cost for two */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#93959F', fontSize: '0.78rem', marginBottom: '6px' }}>
                    <Clock size={12} />
                    <span style={{ fontWeight: 600, color: '#282C3F' }}>{deliveryTime}</span>
                    <span style={{ color: '#E9E9EB' }}>•</span>
                    <span>{costForTwo}</span>
                </div>

                {/* Separator */}
                <div style={{ height: '1px', background: '#F5F5F5', margin: '8px 0' }} />

                {/* Location row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#93959F', fontSize: '0.73rem' }}>
                    <MapPin size={11} style={{ color: '#FC8019', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {res.address}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Home;
