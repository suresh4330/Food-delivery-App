import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Clock,
    MapPin,
    Minus,
    Plus,
    Search,
    ShoppingBag,
    Star,
    Tag,
} from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';

const FOOD_FALLBACKS = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=360&h=260&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=360&h=260&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=360&h=260&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=360&h=260&fit=crop',
];

const RestaurantMenu = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    const { cartCount, updateCartCount } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [quantities, setQuantities] = useState({});
    const [loadingItems, setLoadingItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const fetchMenu = async () => {
            try {
                const [restaurantResponse, foodResponse] = await Promise.all([
                    API.get(`/restaurant/${restaurantId}`),
                    API.get(`/food/${restaurantId}`),
                ]);
                if (mounted) {
                    setRestaurant(restaurantResponse.data);
                    setFoods(Array.isArray(foodResponse.data) ? foodResponse.data : []);
                }
            } catch {
                if (mounted) setError('Could not load this menu.');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchMenu();
        return () => {
            mounted = false;
        };
    }, [restaurantId]);

    const categories = useMemo(() => ['All', ...new Set(foods.map((food) => food.category))], [foods]);

    const filteredFoods = useMemo(() => {
        const query = search.trim().toLowerCase();
        return foods.filter((food) => {
            const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
            const matchesSearch = !query || food.name.toLowerCase().includes(query);
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, foods, search]);

    const groupedFoods = useMemo(() => {
        return filteredFoods.reduce((groups, food) => {
            const key = food.category || 'Recommended';
            groups[key] = groups[key] || [];
            groups[key].push(food);
            return groups;
        }, {});
    }, [filteredFoods]);

    const localCartCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

    const addItem = async (food, delta) => {
        if (!food.isAvailable) return;

        const currentQuantity = quantities[food._id] || 0;
        if (currentQuantity + delta < 0) return;

        setLoadingItems((current) => ({ ...current, [food._id]: true }));
        try {
            await API.post('/cart/add', { foodId: food._id, quantity: delta });
            setQuantities((current) => ({
                ...current,
                [food._id]: Math.max(0, (current[food._id] || 0) + delta),
            }));
            updateCartCount(Math.max(0, cartCount + delta));
        } catch {
            setError('Could not update cart. Please try again.');
        } finally {
            setLoadingItems((current) => ({ ...current, [food._id]: false }));
        }
    };

    if (loading) {
        return (
            <main className="qb-page qb-menu-page">
                <div className="qb-container qb-menu-loading">
                    <div className="qb-menu-hero-skeleton skeleton" />
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div className="qb-menu-row-skeleton skeleton" key={index} />
                    ))}
                </div>
            </main>
        );
    }

    if (error && !restaurant) {
        return (
            <main className="qb-page qb-centered-state">
                <h2>{error}</h2>
                <button type="button" className="qb-primary-button" onClick={() => navigate('/')}>
                    Back to restaurants
                </button>
            </main>
        );
    }

    return (
        <main className="qb-page qb-menu-page">
            <section className="qb-menu-hero">
                <img src={restaurant.image} alt={restaurant.name} />
                <div className="qb-menu-overlay" />
                <div className="qb-container qb-menu-hero-content">
                    <button type="button" className="qb-round-button" onClick={() => navigate(-1)} aria-label="Go back">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <p className="qb-kicker">Restaurant menu</p>
                        <h1>{restaurant.name}</h1>
                        <p>{restaurant.description}</p>
                        <div className="qb-menu-stats">
                            <span>
                                <Star size={14} fill="currentColor" />
                                4.6 ratings
                            </span>
                            <span>
                                <Clock size={14} />
                                30-40 min
                            </span>
                            <span>
                                <MapPin size={14} />
                                {restaurant.address}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="qb-menu-shell">
                <div className="qb-container">
                    <div className="qb-menu-tools">
                        <label className="qb-search-box qb-menu-search">
                            <Search size={18} />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search within menu"
                            />
                        </label>
                        <div className="qb-category-tabs">
                            {categories.map((category) => (
                                <button
                                    type="button"
                                    key={category}
                                    className={activeCategory === category ? 'is-active' : ''}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="qb-menu-layout">
                        <aside className="qb-menu-summary">
                            <h2>Menu</h2>
                            <p>{foods.length} items available</p>
                            <div className="qb-summary-offer">
                                <Tag size={18} />
                                <span>Use QUICKFIRST for welcome savings.</span>
                            </div>
                        </aside>

                        <div className="qb-menu-list">
                            {Object.keys(groupedFoods).length === 0 && (
                                <div className="qb-empty-state">
                                    <h3>No menu items found</h3>
                                    <p>Try another category or search term.</p>
                                </div>
                            )}

                            {Object.entries(groupedFoods).map(([category, items]) => (
                                <section className="qb-menu-category" key={category}>
                                    <h2>{category}</h2>
                                    {items.map((food, index) => (
                                        <FoodRow
                                            key={food._id}
                                            food={food}
                                            index={index}
                                            quantity={quantities[food._id] || 0}
                                            loading={loadingItems[food._id]}
                                            onAdd={() => addItem(food, 1)}
                                            onIncrease={() => addItem(food, 1)}
                                            onDecrease={() => addItem(food, -1)}
                                        />
                                    ))}
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {localCartCount > 0 && (
                <button type="button" className="qb-floating-cart" onClick={() => navigate('/cart')}>
                    <span>{localCartCount} item{localCartCount === 1 ? '' : 's'} added</span>
                    <strong>View cart</strong>
                    <ShoppingBag size={18} />
                </button>
            )}
        </main>
    );
};

const FoodRow = ({ food, index, quantity, loading, onAdd, onIncrease, onDecrease }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const image = imageFailed ? FOOD_FALLBACKS[index % FOOD_FALLBACKS.length] : food.image;

    return (
        <article className="qb-food-row">
            <div className="qb-food-info">
                <span className="qb-veg-mark" aria-label="Vegetarian item" />
                <h3>{food.name}</h3>
                <strong>Rs.{food.price}</strong>
                <p>Freshly prepared, packed carefully, and ready for delivery.</p>
                {!food.isAvailable && <span className="qb-unavailable">Currently unavailable</span>}
            </div>

            <div className="qb-food-media">
                <img src={image} alt={food.name} onError={() => setImageFailed(true)} />
                {quantity > 0 ? (
                    <div className="qb-stepper">
                        <button type="button" onClick={onDecrease} disabled={loading} aria-label={`Remove one ${food.name}`}>
                            <Minus size={14} />
                        </button>
                        <span>{loading ? '...' : quantity}</span>
                        <button type="button" onClick={onIncrease} disabled={loading} aria-label={`Add one ${food.name}`}>
                            <Plus size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        type="button"
                        className="qb-add-button"
                        onClick={onAdd}
                        disabled={loading || !food.isAvailable}
                    >
                        {loading ? 'Adding' : 'Add'}
                    </button>
                )}
            </div>
        </article>
    );
};

export default RestaurantMenu;
