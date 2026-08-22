import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
};

const MapPicker = ({ initialPosition, onConfirm, onCancel }) => {
    const [position, setPosition] = useState(initialPosition || { lat: 28.6139, lng: 77.2090 }); // Default Delhi
    const [loading, setLoading] = useState(() => !initialPosition && 'geolocation' in navigator);
    const [saveLabel, setSaveLabel] = useState(''); // 'Home', 'Work', 'Other', ''

    useEffect(() => {
        if (!initialPosition) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setLoading(false);
                },
                () => {
                    setLoading(false);
                },
                { enableHighAccuracy: true }
            );
        }
    }, [initialPosition]);

    const handleConfirm = () => {
        onConfirm(position, saveLabel);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '24px' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onCancel} />
            <div style={{ position: 'relative', background: 'white', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#282C3F' }}>Pick your location</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#93959F' }}>Click on the map to drop the pin exactly at your building entrance.</p>
                
                <div style={{ width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E9E9EB' }}>
                    {!loading ? (
                        <MapContainer center={position} zoom={16} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker position={position} setPosition={setPosition} />
                        </MapContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93959F', fontWeight: 600 }}>
                            Fetching your precise location...
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#686B78' }}>Save as:</span>
                        {['Home', 'Work', 'Other'].map(lbl => (
                            <button
                                key={lbl} type="button"
                                onClick={() => setSaveLabel(prev => prev === lbl ? '' : lbl)}
                                style={{
                                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    background: saveLabel === lbl ? '#FC8019' : 'white',
                                    color: saveLabel === lbl ? 'white' : '#686B78',
                                    border: `1px solid ${saveLabel === lbl ? '#FC8019' : '#E9E9EB'}`
                                }}
                            >
                                {lbl}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={onCancel} style={{ padding: '12px 24px', background: 'white', border: '1px solid #E9E9EB', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#686B78', transition: 'background 0.2s' }}>
                            Cancel
                        </button>
                        <button type="button" onClick={handleConfirm} style={{ padding: '12px 24px', background: '#FC8019', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, color: 'white', transition: 'background 0.2s' }}>
                            Confirm Location
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPicker;
