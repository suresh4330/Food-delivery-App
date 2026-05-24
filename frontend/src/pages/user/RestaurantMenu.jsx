import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import { useToast } from '../../context/ToastContext';

const FOOD_FALLBACKS = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=360&h=260&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=360&h=260&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=360&h=260&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=360&h=260&fit=crop',
];

const pageMotion = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.35, ease: 'easeOut' },
};

const listMotion = {
    animate: {
        transition: {
            staggerChildren: 0.055,
        },
    },
};

const rowMotion = {
    initial: { opacity: 0, y: 18, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
};

const RestaurantMenu = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    const { cartCount, updateCartCount } = useCart();
    const { showToast } = useToast();
    const [restaurant, setRestaurant] = useState(null);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState(['All']);
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
                const params = {};
                if (search.trim()) params.search = search.trim();
                if (activeCategory !== 'All') params.category = activeCategory;
                const [restaurantResponse, foodResponse] = await Promise.all([
                    API.get(`/restaurant/${restaurantId}`),
                    API.get(`/food/${restaurantId}`, { params }),
                ]);
                if (mounted) {
                    setRestaurant(restaurantResponse.data);
                    const nextFoods = Array.isArray(foodResponse.data) ? foodResponse.data : [];
                    setFoods(nextFoods);
                    if (activeCategory === 'All' && !search.trim()) {
                        setCategories(['All', ...new Set(nextFoods.map((food) => food.category).filter(Boolean))]);
                    }
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
    }, [activeCategory, restaurantId, search]);

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
            showToast(delta > 0 ? 'Added to cart' : 'Cart updated');
        } catch {
            setError('Could not update cart. Please try again.');
            showToast('Could not update cart', 'error');
        } finally {
            setLoadingItems((current) => ({ ...current, [food._id]: false }));
        }
    };

    if (loading) {
        return (
            <motion.main className="qb-page qb-menu-page" {...pageMotion}>
                <div className="qb-container qb-menu-loading">
                    <div className="qb-menu-hero-skeleton skeleton" />
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div className="qb-menu-row-skeleton skeleton" key={index} />
                    ))}
                </div>
            </motion.main>
        );
    }

    if (error && !restaurant) {
        return (
            <motion.main className="qb-page qb-centered-state" {...pageMotion}>
                <h2>{error}</h2>
                <button type="button" className="qb-primary-button" onClick={() => navigate('/')}>
                    Back to restaurants
                </button>
            </motion.main>
        );
    }

    return (
        <motion.main className="qb-page qb-menu-page" {...pageMotion}>
            <section className="qb-menu-hero">
                <motion.img
                    src={restaurant.image}
                    alt={restaurant.name}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <div className="qb-menu-overlay" />
                <div className="qb-container qb-menu-hero-content">
                    <motion.button
                        type="button"
                        className="qb-round-button"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        whileHover={{ x: -3 }}
                        whileTap={{ scale: 0.94 }}
                    >
                        <ArrowLeft size={20} />
                    </motion.button>
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                        <p className="qb-kicker">Restaurant menu</p>
                        <h1>{restaurant.name}</h1>
                        <p>{restaurant.description}</p>
                        <motion.div className="qb-menu-stats" variants={listMotion} initial="initial" animate="animate">
                            <motion.span variants={rowMotion}>
                                <Star size={14} fill="currentColor" />
                                4.6 ratings
                            </motion.span>
                            <motion.span variants={rowMotion}>
                                <Clock size={14} />
                                30-40 min
                            </motion.span>
                            <motion.span variants={rowMotion}>
                                <MapPin size={14} />
                                {restaurant.address}
                            </motion.span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="qb-menu-shell">
                <div className="qb-container">
                    <motion.div
                        className="qb-menu-tools"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 }}
                    >
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
                                <motion.button
                                    type="button"
                                    key={category}
                                    className={activeCategory === category ? 'is-active' : ''}
                                    onClick={() => setActiveCategory(category)}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    {category}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    <div className="qb-menu-layout">
                        <motion.aside
                            className="qb-menu-summary"
                            initial={{ opacity: 0, x: -18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.22 }}
                        >
                            <h2>Menu</h2>
                            <p>{foods.length} items available</p>
                            <div className="qb-summary-offer">
                                <Tag size={18} />
                                <span>Use QUICKFIRST for welcome savings.</span>
                            </div>
                        </motion.aside>

                        <motion.div className="qb-menu-list" variants={listMotion} initial="initial" animate="animate">
                            {Object.keys(groupedFoods).length === 0 && (
                                <div className="qb-empty-state">
                                    <h3>No menu items found</h3>
                                    <p>Try another category or search term.</p>
                                </div>
                            )}

                            {Object.entries(groupedFoods).map(([category, items]) => (
                                <motion.section className="qb-menu-category" key={category} variants={rowMotion}>
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
                                </motion.section>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            <AnimatePresence>
            {localCartCount > 0 && (
                <motion.button
                    type="button"
                    className="qb-floating-cart"
                    onClick={() => navigate('/cart')}
                    initial={{ opacity: 0, y: 28, x: '-50%', scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                    exit={{ opacity: 0, y: 20, x: '-50%', scale: 0.96 }}
                    whileHover={{ y: -3, x: '-50%' }}
                    whileTap={{ scale: 0.97, x: '-50%' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                    <span>{localCartCount} item{localCartCount === 1 ? '' : 's'} added</span>
                    <strong>View cart</strong>
                    <ShoppingBag size={18} />
                </motion.button>
            )}
            </AnimatePresence>
        </motion.main>
    );
};

const FoodRow = ({ food, index, quantity, loading, onAdd, onIncrease, onDecrease }) => {
    const [imageFailed, setImageFailed] = useState(false);
    const image = imageFailed ? FOOD_FALLBACKS[index % FOOD_FALLBACKS.length] : food.image;

    return (
        <motion.article
            className="qb-food-row"
            variants={rowMotion}
            whileHover={{ backgroundColor: '#fffaf5' }}
            transition={{ duration: 0.2 }}
        >
            <div className="qb-food-info">
                <span className="qb-veg-mark" aria-label="Vegetarian item" />
                <h3>{food.name}</h3>
                <strong>₹{food.price}</strong>
                <p>Freshly prepared, packed carefully, and ready for delivery.</p>
                {!food.isAvailable && <span className="qb-unavailable">Currently unavailable</span>}
            </div>

            <div className="qb-food-media">
                <motion.img
                    src={image}
                    alt={food.name}
                    onError={() => setImageFailed(true)}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                />
                <AnimatePresence mode="wait">
                {quantity > 0 ? (
                    <motion.div
                        className="qb-stepper"
                        key="stepper"
                        initial={{ opacity: 0, y: 8, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.92 }}
                    >
                        <button type="button" onClick={onDecrease} disabled={loading} aria-label={`Remove one ${food.name}`}>
                            <Minus size={14} />
                        </button>
                        <span>{loading ? '...' : quantity}</span>
                        <button type="button" onClick={onIncrease} disabled={loading} aria-label={`Add one ${food.name}`}>
                            <Plus size={14} />
                        </button>
                    </motion.div>
                ) : (
                    <motion.button
                        type="button"
                        className="qb-add-button"
                        onClick={onAdd}
                        disabled={loading || !food.isAvailable}
                        key="add"
                        initial={{ opacity: 0, y: 8, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.92 }}
                        whileHover={food.isAvailable ? { y: -2 } : undefined}
                        whileTap={food.isAvailable ? { scale: 0.94 } : undefined}
                    >
                        {loading ? 'Adding' : 'Add'}
                    </motion.button>
                )}
                </AnimatePresence>
            </div>
        </motion.article>
    );
};

export default RestaurantMenu;
