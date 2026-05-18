import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Search,
    SlidersHorizontal,
    Star,
    Tag,
} from 'lucide-react';
import API from '../../api/axios';

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

const Home = () => {
    const navigate = useNavigate();
    const categoryRef = useRef(null);
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [activeSort, setActiveSort] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const fetchRestaurants = async () => {
            try {
                const { data } = await API.get('/restaurant');
                if (mounted) setRestaurants(Array.isArray(data) ? data : []);
            } catch {
                if (mounted) setError('Could not load restaurants.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchRestaurants();
        return () => {
            mounted = false;
        };
    }, []);

    const filteredRestaurants = useMemo(() => {
        const query = search.trim().toLowerCase();
        const category = activeCategory.toLowerCase();

        return restaurants.filter((restaurant) => {
            const haystack = `${restaurant.name} ${restaurant.description} ${restaurant.address}`.toLowerCase();
            const matchesSearch = !query || haystack.includes(query);
            const matchesCategory = !category || haystack.includes(category);
            return matchesSearch && matchesCategory;
        });
    }, [activeCategory, restaurants, search]);

    const scrollCategories = (direction) => {
        categoryRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' });
    };

    return (
        <main className="qb-page">
            <section className="qb-hero">
                <div className="qb-container qb-hero-grid">
                    <div>
                        <p className="qb-kicker">QuickBite Food Delivery</p>
                        <h1>Order from restaurants near you</h1>
                        <p className="qb-hero-copy">
                            Browse fresh menus, top-rated kitchens, and quick deals in one clean ordering flow.
                        </p>
                    </div>

                    <div className="qb-search-panel">
                        <div className="qb-location-line">
                            <MapPin size={18} />
                            Delivering to Home
                            <span>Change</span>
                        </div>
                        <label className="qb-search-box">
                            <Search size={20} />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search for restaurant or cuisine"
                            />
                        </label>
                    </div>
                </div>
            </section>

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
                        <button
                            type="button"
                            key={category.label}
                            className={`qb-category ${activeCategory === category.label ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(activeCategory === category.label ? '' : category.label)}
                        >
                            <img src={category.img} alt={category.label} />
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="qb-container qb-offer-grid">
                <article className="qb-offer qb-offer-primary">
                    <Tag size={22} />
                    <div>
                        <strong>Big welcome offer</strong>
                        <span>Use QUICKFIRST and save on your next order.</span>
                    </div>
                    <ArrowRight size={20} />
                </article>
                <article className="qb-offer">
                    <Clock size={22} />
                    <div>
                        <strong>Fast picks nearby</strong>
                        <span>Popular restaurants with 30 minute delivery windows.</span>
                    </div>
                </article>
            </section>

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
                    <div className="qb-restaurant-grid">
                        {filteredRestaurants.map((restaurant, index) => (
                            <RestaurantCard
                                key={restaurant._id}
                                restaurant={restaurant}
                                index={index}
                                onClick={() => navigate(`/restaurant/${restaurant._id}`)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

const RestaurantCard = ({ restaurant, index, onClick }) => {
    const rating = `4.${(index % 6) + 2}`;
    const deliveryTime = `${25 + (index % 4) * 5}-${35 + (index % 4) * 5} min`;
    const offer = OFFERS[index % OFFERS.length];

    return (
        <button type="button" className="qb-restaurant-card" onClick={onClick}>
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
        </button>
    );
};

export default Home;
