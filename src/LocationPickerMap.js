import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Autocomplete } from '@react-google-maps/api';


const containerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: 13.7563,  // Default: Bangkok
  lng: 100.5018
};

const LocationPickerMap = ({ lat, lon, onLocationSelect, showSearch = true }) => {
  const [position, setPosition] = useState({ lat: lat || defaultCenter.lat, lng: lon || defaultCenter.lng });
  const [autocomplete, setAutocomplete] = useState(null);
  const mapRef = useRef(null);  // Reference to the map

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCJvrGYnyxTM4Qbd5bJRLoO139XiHO_8T0',  // Replace with your API key
    libraries: ['places'],
    region: 'TH',
    language: 'th'
  });

  // Ensure lat/lng are valid numbers before setting the position
  const ensureNumber = (value) => {
    const parsedValue = parseFloat(value);
    return !isNaN(parsedValue) ? parsedValue : null;
  };

  // Update position if lat and lon props change and are valid
  useEffect(() => {
    const validLat = ensureNumber(lat);
    const validLng = ensureNumber(lon);

    if (validLat !== null && validLng !== null) {
      const newPosition = { lat: validLat, lng: validLng };
      setPosition(newPosition);

      // If map reference is available, move the map to the new position
      if (mapRef.current) {
        mapRef.current.panTo(newPosition);
      }
    } else {
      console.error('Invalid latitude or longitude provided.');
    }
  }, [lat, lon]);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const newPosition = { lat, lng };

    // Ensure that both latitude and longitude are valid
    const validLat = ensureNumber(lat);
    const validLng = ensureNumber(lng);

    if (validLat !== null && validLng !== null) {
      setPosition(newPosition);
      onLocationSelect(validLat, validLng);

      // Move the map to the new clicked location
      if (mapRef.current) {
        mapRef.current.panTo(newPosition);
      }
    } else {
      console.error('Invalid map click position.');
    }
  }, [onLocationSelect]);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  // Fallback to Geocoding API if Autocomplete doesn't provide geometry
  const fetchLatLonFromGeocode = async (placeName) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=AIzaSyCJvrGYnyxTM4Qbd5bJRLoO139XiHO_8T0`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log(`Geocode Fallback: Lat: ${lat}, Lon: ${lng}`);
        
        const validLat = ensureNumber(lat);
        const validLng = ensureNumber(lng);

        if (validLat !== null && validLng !== null) {
          const newPosition = { lat: validLat, lng: validLng };
          setPosition(newPosition);
          onLocationSelect(validLat, validLng);

          if (mapRef.current) {
            mapRef.current.panTo(newPosition);
          }
        }
      } else {
        console.error('No geocode results found.');
      }
    } catch (error) {
      console.error('Error fetching lat/lon from geocoding API:', error);
    }
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log("Place returned by Autocomplete:", place);

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        const validLat = ensureNumber(lat);
        const validLng = ensureNumber(lng);

        if (validLat !== null && validLng !== null) {
          const newPosition = { lat: validLat, lng: validLng };
          setPosition(newPosition);
          onLocationSelect(validLat, validLng);

          // Move the map to the searched location
          if (mapRef.current) {
            mapRef.current.panTo(newPosition);
          }
        } else {
          console.error('Invalid geometry or place data.');
        }
      } else {
        console.log('No geometry or location available for the selected place.');
        
        // Fallback: Use Geocoding API to find lat/lon based on the place name
        if (place.name) {
          console.log(`Using Geocoding API for place: ${place.name}`);
          fetchLatLonFromGeocode(place.name);  // Fallback to Geocoding API
        }
      }
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return isLoaded ? (
    <>
      {showSearch && (
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
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position}
        zoom={16}
        onClick={onMapClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        <Marker position={position} />
      </GoogleMap>
    </>
  ) : <></>;
};

export default LocationPickerMap;
