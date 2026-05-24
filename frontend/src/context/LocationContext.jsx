import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const LocationContext = createContext(null);

const DEFAULT_LOCATION = {
    label: 'Home',
    address: 'Set your delivery location',
    coordinates: null,
};

export const LocationProvider = ({ children }) => {
    const [location, setLocationState] = useState(DEFAULT_LOCATION);

    useEffect(() => {
        try {
            const saved = window.localStorage.getItem('quickbite-location');
            if (saved) setLocationState({ ...DEFAULT_LOCATION, ...JSON.parse(saved) });
        } catch {
            setLocationState(DEFAULT_LOCATION);
        }
    }, []);

    const setLocation = (nextLocation) => {
        const updated = {
            ...DEFAULT_LOCATION,
            ...nextLocation,
            label: nextLocation.label?.trim() || 'Home',
            address: nextLocation.address?.trim() || nextLocation.label?.trim() || DEFAULT_LOCATION.address,
        };
        setLocationState(updated);
        window.localStorage.setItem('quickbite-location', JSON.stringify(updated));
    };

    const value = useMemo(() => ({ location, setLocation }), [location]);

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export const useDeliveryLocation = () => {
    const context = useContext(LocationContext);
    if (!context) throw new Error('useDeliveryLocation must be used inside LocationProvider');
    return context;
};
