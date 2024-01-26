/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { RHFTextField } from 'src/components/hook-form';
import zIndex from '@mui/material/styles/zIndex';
import { Mobailvalidation } from './jwt-login-view';

export const CountryMobileLogin = ({ onCountryCodeChange}) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryCode, setCountryCode] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://dapis.ma-moh.com/api/countries', {
          headers: {
            'language': 'en',
            'Content-Type': 'application/json',
          },
        });

        setCountries(response.data.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const countryOptions = countries.map((country) => ({
    value: country.id,
    label: (
      <div>
        <span>{country.country_code} - {country.country_name}</span>
        <img
          src={country.image}
          width={20}
          height={20}
          alt={`${country.country_name} flag`}
          style={{ marginLeft: '5px' }}
        />
      </div>
    ),
  }));

 
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    const countryCode = countries.find((country) => country.id === selectedOption.value)?.country_code || '';
    // Update the country code immediately
    onCountryCodeChange(countryCode);
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      // Adjust the zIndex as needed
    }),
    option: (provided, state) => ({
      ...provided,
    
      backgroundColor: state.isSelected ? '#3366FF' : 'white',
      color: state.isSelected ? 'white' : 'black',
    }),
  };

  
  return (
    <>
  <div >
            <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countryOptions}
          styles={customStyles}
        />
      </div>
    </>
  );
};
