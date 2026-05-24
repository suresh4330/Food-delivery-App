import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    Flame,
    MapPin,
    Search,
    SlidersHorizontal,
    Star,
    Tag,
} from 'lucide-react';
import API from '../../api/axios';
import LocationPicker from '../../components/LocationPicker';
import { useDeliveryLocation } from '../../context/LocationContext';

const FOOD_CATEGORIES = [
    { label: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=240&h=240&fit=crop' },
    { label: 'Pizza', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=240&h=240&fit=crop' },
    { label: 'Burger', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240&h=240&fit=crop' },
    { label: 'Rolls', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240&h=240&fit=crop' },
    { label: 'Chinese', img: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=240&h=240&fit=crop' },
    { label: 'Desserts', img: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=240&h=240&fit=crop' },
    { label: 'South Indian', img: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=240&h=240&fit=crop' },
    { label: 'Cakes', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=240&h=240&fit=crop' },
];

const OFFERS = [
    '50% OFF up to Rs.100',
    'Items from Rs.89',
    'Free delivery',
    'Flat Rs.75 off',
    '60% OFF up to Rs.110',
    'Combo deals inside',
];

const SORTS = ['Fast Delivery', 'Rating 4.0+', 'Pure Veg', 'Offers'];

const pageMotion = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.35, ease: 'easeOut' },
};

const staggerGroup = {
    animate: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const fadeUp = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
};

const HERO_FOODS = [
    {
        title: 'Hot pizza',
        meta: '28 min',
        img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=520&h=380&fit=crop',
    },
    {
        title: 'Fresh bowls',
        meta: '4.8 rated',
        img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=360&h=300&fit=crop',
    },
    {
        title: 'Burger meals',
        meta: 'Save Rs.90',
        img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=360&h=300&fit=crop',
    },
];

const Home = () => {
    const navigate = useNavigate();
    const categoryRef = useRef(null);
    const { location } = useDeliveryLocation();
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [activeSort, setActiveSort] = useState('');
    const [locationOpen, setLocationOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        const timeout = window.setTimeout(async () => {
            try {
                const params = {};
                if (search.trim()) params.search = search.trim();
                if (activeCategory) params.search = activeCategory;
                const { data } = await API.get('/restaurant', { params });
                if (mounted) {
                    setRestaurants(Array.isArray(data) ? data : []);
                    setError('');
                }
            } catch {
                if (mounted) setError('Could not load restaurants.');
            } finally {
                if (mounted) setLoading(false);
            }
        }, 250);

        return () => {
            mounted = false;
            window.clearTimeout(timeout);
        };
    }, [activeCategory, search]);

    const filteredRestaurants = useMemo(() => {
        const query = search.trim().toLowerCase();
        const category = activeCategory.toLowerCase();

        return restaurants.filter((restaurant) => {
            const haystack = `${restaurant.name} ${restaurant.description} ${restaurant.address}`.toLowerCase();
            const matchesSearch = !query || haystack.includes(query);
            const matchesCategory = !category || haystack.includes(category);
            return matchesSearch && matchesCategory;
        }).sort((a, b) => {
            if (activeSort === 'Fast Delivery') return a.name.localeCompare(b.name);
            if (activeSort === 'Rating 4.0+') return b.name.localeCompare(a.name);
            if (activeSort === 'Offers') return (b.description || '').length - (a.description || '').length;
            return 0;
        });
    }, [activeCategory, activeSort, restaurants, search]);

    const scrollCategories = (direction) => {
        categoryRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' });
    };

    return (
        <motion.main className="qb-page" {...pageMotion}>
            <motion.section className="qb-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
                <div className="qb-container qb-hero-grid">
                    <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                        <p className="qb-kicker">QuickBite Food Delivery</p>
                        <h1>Order from restaurants near you</h1>
                        <p className="qb-hero-copy">
                            Browse fresh menus, top-rated kitchens, and quick deals in one clean ordering flow.
                        </p>
                        <motion.div className="qb-hero-stats" variants={staggerGroup} initial="initial" animate="animate">
                            {[
                                ['120+', 'local kitchens'],
                                ['30 min', 'avg delivery'],
                                ['4.6', 'user rating'],
                            ].map(([value, label]) => (
                                <motion.span key={label} variants={fadeUp}>
                                    <strong>{value}</strong>
                                    {label}
                                </motion.span>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="qb-hero-visual"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.18, duration: 0.35 }}
                    >
                        <motion.div
                            className="qb-hero-food-card qb-hero-food-card-main"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <img src={HERO_FOODS[0].img} alt={HERO_FOODS[0].title} />
                            <div>
                                <span><Flame size={14} /> Trending now</span>
                                <strong>{HERO_FOODS[0].title}</strong>
                                <small>{HERO_FOODS[0].meta}</small>
                            </div>
                        </motion.div>

                        <motion.div
                            className="qb-hero-food-card qb-hero-food-card-small qb-hero-food-card-a"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <img src={HERO_FOODS[1].img} alt={HERO_FOODS[1].title} />
                            <strong>{HERO_FOODS[1].title}</strong>
                            <small>{HERO_FOODS[1].meta}</small>
                        </motion.div>

                        <motion.div
                            className="qb-hero-food-card qb-hero-food-card-small qb-hero-food-card-b"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <img src={HERO_FOODS[2].img} alt={HERO_FOODS[2].title} />
                            <strong>{HERO_FOODS[2].title}</strong>
                            <small>{HERO_FOODS[2].meta}</small>
                        </motion.div>

                        <motion.div className="qb-search-panel qb-hero-search-card" whileHover={{ y: -3 }}>
                            <div className="qb-location-line">
                                <MapPin size={18} />
                                <span className="qb-delivery-text">
                                    Delivering to {location.label}
                                    <small>{location.address}</small>
                                </span>
                                <button type="button" onClick={() => setLocationOpen(true)}>Change</button>
                            </div>
                            <label className="qb-search-box">
                                <Search size={20} />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search for restaurant or cuisine"
                                />
                            </label>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            <section className="qb-container qb-section">
                <div className="qb-section-heading">
                    <div>
                        <p className="qb-kicker">What's on your mind?</p>
                        <h2>Explore categories</h2>
                    </div>
                    <div className="qb-icon-actions">
                        <button type="button" onClick={() => scrollCategories(-1)} aria-label="Scroll categories left">
                            <ChevronLeft size={18} />
                        </button>
                        <button type="button" onClick={() => scrollCategories(1)} aria-label="Scroll categories right">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div ref={categoryRef} className="qb-category-strip">
                    {FOOD_CATEGORIES.map((category) => (
                        <motion.button
                            type="button"
                            key={category.label}
                            className={`qb-category ${activeCategory === category.label ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(activeCategory === category.label ? '' : category.label)}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                        >
                            <img src={category.img} alt={category.label} />
                            <span>{category.label}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            <motion.section className="qb-container qb-offer-grid" variants={staggerGroup} initial="initial" animate="animate">
                <motion.article className="qb-offer qb-offer-primary" variants={fadeUp}>
                    <Tag size={22} />
                    <div>
                        <strong>Big welcome offer</strong>
                        <span>Use QUICKFIRST and save on your next order.</span>
                    </div>
                    <ArrowRight size={20} />
                </motion.article>
                <motion.article className="qb-offer" variants={fadeUp}>
                    <Clock size={22} />
                    <div>
                        <strong>Fast picks nearby</strong>
                        <span>Popular restaurants with 30 minute delivery windows.</span>
                    </div>
                </motion.article>
            </motion.section>

            <section className="qb-container qb-section qb-restaurant-section">
                <div className="qb-section-heading qb-restaurant-heading">
                    <div>
                        <p className="qb-kicker">Restaurants</p>
                        <h2>{filteredRestaurants.length} places delivering to you</h2>
                    </div>
                    <div className="qb-filter-row">
                        <button
                            type="button"
                            className={`qb-filter ${activeSort === '' ? 'is-active' : ''}`}
                            onClick={() => setActiveSort('')}
                        >
                            <SlidersHorizontal size={15} />
                            Relevance
                        </button>
                        {SORTS.map((sort) => (
                            <button
                                type="button"
                                key={sort}
                                className={`qb-filter ${activeSort === sort ? 'is-active' : ''}`}
                                onClick={() => setActiveSort(activeSort === sort ? '' : sort)}
                            >
                                {sort}
                            </button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="qb-restaurant-grid">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div className="qb-card-skeleton" key={index}>
                                <div />
                                <span />
                                <span />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="qb-empty-state">
                        <h3>{error}</h3>
                        <button type="button" className="qb-primary-button" onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && filteredRestaurants.length === 0 && (
                    <div className="qb-empty-state">
                        <h3>No restaurants found</h3>
                        <p>Try another cuisine or clear your search.</p>
                        <button type="button" className="qb-primary-button" onClick={() => {
                            setSearch('');
                            setActiveCategory('');
                        }}>
                            Clear filters
                        </button>
                    </div>
                )}

                {!loading && !error && filteredRestaurants.length > 0 && (
                    <motion.div className="qb-restaurant-grid" variants={staggerGroup} initial="initial" animate="animate">
                        {filteredRestaurants.map((restaurant, index) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                                index={index}
                                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                            />
                        ))}
                    </motion.div>
                )}
            </section>

            <LocationPicker open={locationOpen} onClose={() => setLocationOpen(false)} />
        </motion.main>
    );
};

const RestaurantCard = ({ restaurant, index, onClick }) => {
    const rating = `4.${(index % 6) + 2}`;
    const deliveryTime = `${25 + (index % 4) * 5}-${35 + (index % 4) * 5} min`;
    const offer = OFFERS[index % OFFERS.length];

    return (
        <motion.button
            type="button"
            className="qb-restaurant-card"
            onClick={onClick}
            variants={fadeUp}
            whileHover={{ y: -8, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
            <div className="qb-card-image">
                <img src={restaurant.image} alt={restaurant.name} />
                <div className="qb-card-offer">{offer}</div>
            </div>
            <div className="qb-card-body">
                <div className="qb-card-title-row">
                    <h3>{restaurant.name}</h3>
                    <span className="qb-rating">
                        <Star size={12} fill="currentColor" />
                        {rating}
                    </span>
                </div>
                <p>{restaurant.description}</p>
                <div className="qb-card-meta">
                    <span>
                        <Clock size={14} />
                        {deliveryTime}
                    </span>
                    <span>{restaurant.address}</span>
                </div>
            </div>
        </motion.button>
    );
};

export default Home;
