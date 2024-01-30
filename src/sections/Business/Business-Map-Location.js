import React, { useEffect, useState } from 'react';

const BusinessMap = ({ onLocationChange }) => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

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
  }, []); 

const initializeMap = () => {
  const storedLocation = JSON.parse(localStorage.getItem('selectedLocation'));

  const initialLocation = storedLocation || { lat: 23.78616040739036, lng: 27.827448596169056 };

  const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
    center: initialLocation,
    zoom: 4,
  });

  setMap(mapInstance);

  let currentMarker = null;

  mapInstance.addListener('click', (e) => {
    const { latLng } = e;
    const location = {
      lat: latLng.lat(),
      lng: latLng.lng(),
    };

    onLocationChange(location);

    // Remove the current marker before adding a new one
    if (currentMarker) {
      currentMarker.setMap(null);
    }

    // Add a new marker for the selected location
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: mapInstance,
      title: 'Selected Location',
    });

    currentMarker = newMarker;

    setMarker(newMarker);

    localStorage.setItem('selectedLocation', JSON.stringify(location));
  });

  const initialMarker = new window.google.maps.Marker({
    position: initialLocation,
    map: mapInstance,
    title: 'Initial Location',
  });

  currentMarker = initialMarker;

  setMarker(initialMarker);
};


  return <div id="map" style={{ height: '300px', width: '100%' }} />;
};

export default BusinessMap;
