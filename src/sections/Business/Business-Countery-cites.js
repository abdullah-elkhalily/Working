/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RHFSelect } from 'src/components/hook-form';

export const CounteryCitesBusines = ({ onCountryChange, onCityChange }) => {
    const [counteries, setCounteries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
  
    useEffect(() => {
      // Fetch the list of countries
      const fetchCountries = async () => {
        try {
          const response = await axios.get('https://dapis.ma-moh.com/api/countries', {
            headers: {
              'language': 'en',
              'Content-Type': 'application/json',
            },
          });
  
          setCounteries(response.data.data);
        } catch (error) {
          console.error('Error fetching countries:', error);
        }
      };
  
      fetchCountries();
    }, []);
  
    const handleCountryChange = async (e) => {
      const countryId = parseInt(e.target.value, 10);
      setSelectedCountry(countryId);
      
      // Fetch the list of cities based on the selected country
      try {
        const response = await axios.get(`https://dapis.ma-moh.com/api/cities?&country_id=${countryId}`, {
          headers: {
            'language': 'en',
            'Content-Type': 'application/json',
          },
        });
  
        setCities(response.data.data);
  
        // Invoke the callback for country change in the parent component
        if (onCountryChange) {
          onCountryChange(countryId);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
  
    const handleCityChange = (e) => {
      const cityId = parseInt(e.target.value, 10);
      setSelectedCity(cityId);
  
      // Invoke the callback for city change in the parent component
      if (onCityChange) {
        onCityChange(cityId);
      }
    };
  const renderProperties = (
    <>
      <RHFSelect
        native
        name="country"
        label="Country"
        value={selectedCountry}
        InputLabelProps={{ shrink: true }}
        onChange={handleCountryChange}
      >
        {counteries.map((country) => (
          <option key={country.id} value={country.id}>
            {country.name}
           
          </option>
          
        ))}
      </RHFSelect>
      <RHFSelect
        native
        name="city"
        label="City"
        onChange={handleCityChange}
        InputLabelProps={{ shrink: true }}
      >
        {cities.map((city) => (
      
          <option key={city.id} value={city.id}>
            {city.name}
          </option>
        ))}
      </RHFSelect>
    </>
  );

  return <>{renderProperties}</>;
};
