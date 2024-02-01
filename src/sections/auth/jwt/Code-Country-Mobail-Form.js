/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const CountryMobileLogin = ({ onCountryCodeChange, setIsSelectActive }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleSelectFocus = () => {
    setIsSelectActive(true);
  };

  const handleSelectBlur = () => {
    setIsSelectActive(false);
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    const countryCode = countries.find((country) => country.id === selectedOption.value)?.country_code || '';
    onCountryCodeChange(countryCode);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://sapis.ma-moh.com/api/countries', {
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

  const customStyles = {
    control: (provided) => ({
      ...provided,
      // Add other control styles as needed
    }),
    option: (provided, state) => ({
      ...provided,
      zIndex: 99,
      backgroundColor: state.isSelected ? '#3366FF' : 'white',
      color: state.isSelected ? 'white' : 'black',
    }),
  };

  return (
    <div style={{ position: 'relative' }}>
      <Select
        value={selectedCountry}
        onChange={handleCountryChange}
        options={countryOptions}
        styles={customStyles}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
      />
    </div>
  );
};

export default CountryMobileLogin;
