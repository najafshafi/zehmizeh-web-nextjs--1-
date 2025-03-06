import React, { useState } from "react";

interface Country {
  code: string;
  name: string;
}

interface SelectCountryProps {
  countries: Country[];
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  setSelectedState: (state: string) => void; // Reset region when country changes
}

const SelectCountry: React.FC<SelectCountryProps> = ({
  countries,
  selectedCountry,
  setSelectedCountry,
  setSelectedState,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
    setShowSuggestions(true);
  };

  const selectCountry = (country: Country) => {
    setSelectedCountry(country.code);
    setInputValue(country.name);
    setSelectedState(""); // Reset region on country change
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Select Country"
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 py-4 font-light"
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && filteredCountries.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-64 overflow-y-auto">
          {filteredCountries.map((country) => (
            <li
              key={country.code}
              className="p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectCountry(country)}
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectCountry;
