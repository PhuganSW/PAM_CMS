import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: 13.7563,  // Default: Bangkok
  lng: 100.5018
};

const LocationPickerMap = ({ lat, lon, onLocationSelect }) => {
  const [position, setPosition] = useState({ lat: lat || center.lat, lng: lon || center.lng });
  const [autocomplete, setAutocomplete] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCqKdSanrwR9l0ElL8EfAEJ02yzl8ipzxw',  // Replace with your API key
    libraries: ['places'],  // For search autocomplete functionality
  });

  useEffect(() => {
    if (lat && lon) {
      setPosition({ lat, lng: lon });
    }
  }, [lat, lon]);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });
    onLocationSelect(lat, lng); // Pass selected location back to parent
  }, [onLocationSelect]);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setPosition({ lat, lng });
        onLocationSelect(lat, lng);
      } else {
        console.log('No geometry or location available for the selected place.');
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return isLoaded ? (
    <>
      {/* Search Input for Places Autocomplete */}
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          type="text"
          placeholder="Enter address"
          style={{
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '100%',
            height: '40px',
            padding: '0 12px',
            borderRadius: '5px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            fontSize: '16px',
            outline: 'none',
            textOverflow: 'ellipses'
          }}
        />
      </Autocomplete>

      {/* Google Map Component */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={16}
        onClick={onMapClick}
      >
        <Marker position={position} />
      </GoogleMap>
    </>
  ) : <></>;
};

export default LocationPickerMap;
