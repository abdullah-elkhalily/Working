// MapComponent.js

import React, { useEffect, useState } from 'react';

const BusinessMap = ({ onLocationChange }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCYyYs7kxrmli4Un92kzy5j_tbINpXGyu0`;
    script.async = true;
    script.onload = () => {
      initializeMap();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []); // Make sure to replace 'YOUR_API_KEY' with your actual Google Maps API key

  const initializeMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 
        23.78616040739036, lng:27.827448596169056  },
      zoom: 4,
    });

    setMap(mapInstance);

    mapInstance.addListener('click', (e) => {
      const { latLng } = e;
      const location = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
      onLocationChange(location);
    });
  };

  return <div id="map" style={{ height: '300px', width: '100%' }} />;
};

export default BusinessMap;
