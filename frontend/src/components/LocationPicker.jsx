import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, Loader2, MapPin, Navigation, X } from 'lucide-react';
import { useDeliveryLocation } from '../context/LocationContext';

const LocationPicker = ({ open, onClose }) => {
    const { location, setLocation } = useDeliveryLocation();
    const [label, setLabel] = useState(location.label || 'Home');
    const [address, setAddress] = useState(location.address || '');
    const [detecting, setDetecting] = useState(false);
    const [error, setError] = useState('');

    const saveLocation = (event) => {
        event?.preventDefault();
        if (!address.trim() && !label.trim()) {
            setError('Please enter a delivery location.');
            return;
        }
        setLocation({ label, address });
        setError('');
        onClose();
    };

    const useCurrentLocation = () => {
        setError('');
        if (!navigator.geolocation) {
            setError('Your browser does not support location detection.');
            return;
        }

        setDetecting(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const shortLat = latitude.toFixed(4);
                const shortLng = longitude.toFixed(4);
                const nextAddress = `Current location (${shortLat}, ${shortLng})`;
                setLabel('Current location');
                setAddress(nextAddress);
                setLocation({
                    label: 'Current location',
                    address: nextAddress,
                    coordinates: { latitude, longitude },
                });
                setDetecting(false);
                onClose();
            },
            () => {
                setError('Location permission was denied. You can type your address instead.');
                setDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
        );
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="qb-location-modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={onClose}
                >
                    <motion.div
                        className="qb-location-modal"
                        initial={{ opacity: 0, y: 24, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 18, scale: 0.96 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <button type="button" className="qb-modal-close" onClick={onClose} aria-label="Close location picker">
                            <X size={18} />
                        </button>

                        <div className="qb-location-modal-icon">
                            <MapPin size={24} />
                        </div>
                        <h2>Choose delivery location</h2>
                        <p>Set where QuickBite should deliver your food.</p>

                        <button type="button" className="qb-detect-location" onClick={useCurrentLocation} disabled={detecting}>
                            {detecting ? <Loader2 size={18} className="spin-icon" /> : <Crosshair size={18} />}
                            {detecting ? 'Detecting location...' : 'Use my current location'}
                        </button>

                        <div className="qb-location-divider">or enter manually</div>

                        <form className="qb-location-form" onSubmit={saveLocation}>
                            <label>
                                Location name
                                <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Home, Office, Hostel" />
                            </label>
                            <label>
                                Full address
                                <textarea value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Flat, street, area, city" rows={3} />
                            </label>

                            {error && <span className="qb-location-error">{error}</span>}

                            <button type="submit" className="qb-save-location">
                                <Navigation size={17} />
                                Save location
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LocationPicker;
