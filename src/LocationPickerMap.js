import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css'; // Import CSS for geosearch

// Fix the default marker icon
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationPickerMap = ({ lat, lon, onLocationSelect }) => {
  const [position, setPosition] = useState([lat || 13.7563, lon || 100.5018]); // Default: Bangkok

  const provider = new OpenStreetMapProvider();

  const LocationMarker = () => {
    const map = useMap(); // Access the map instance

    useEffect(() => {
      // When position changes, move the map view to the new position with zoom
      if (position) {
        map.setView(position, 16); // Set view to new position with zoom level 16
      }
    }, [position, map]);

    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng); // Pass selected location back to parent
      },
    });

    return position ? <Marker position={position}></Marker> : null;
  };

  const MapWithSearch = () => {
    const map = useMap();

    useEffect(() => {
      const searchControl = new GeoSearchControl({
        provider: provider,
        style: 'bar', // You can also use 'button' style
        autoComplete: true,
        autoCompleteDelay: 250,
        showMarker: false, // Prevent map from automatically showing markers
        retainZoomLevel: false, // Retain zoom level after searching
      });

      map.addControl(searchControl);

      map.on('geosearch/showlocation', (result) => {
        const { x: lon, y: lat } = result.location;
        setPosition([lat, lon]); // Update the position
        onLocationSelect(lat, lon);
        map.setView([lat, lon], 16); // Move to the searched location and zoom in
      });

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  useEffect(() => {
    // Update position if lat and lon props change
    if (lat && lon) {
      setPosition([lat, lon]);
    }
  }, [lat, lon]);

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocationMarker />
      <MapWithSearch />
    </MapContainer>
  );
};

export default LocationPickerMap;
