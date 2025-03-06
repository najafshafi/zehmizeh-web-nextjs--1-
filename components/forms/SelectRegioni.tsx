import React, { useState, useEffect } from "react";

interface SelectRegionProps {
  states: string[];          // List of regions for the selected country
  selectedState: string;     // Currently selected region
  setSelectedState: (state: string) => void; // Function to update region
  disabled: boolean;         // Disable input if no country is selected
}

const SelectRegion: React.FC<SelectRegionProps> = ({
  states,
  selectedState,
  setSelectedState,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState(selectedState);
  const [filteredStates, setFilteredStates] = useState(states);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Update filteredStates when the states prop changes
  useEffect(() => {
    setFilteredStates(states);
  }, [states]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === "") {
      setFilteredStates(states);
    } else {
      const filtered = states.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStates(filtered);
    }
    setShowSuggestions(true);
  };

  const selectState = (state: string) => {
    setSelectedState(state);
    setInputValue(state);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full mt-4">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Select State/Region"
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 py-4 font-light"
        disabled={disabled}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && filteredStates.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-64 overflow-y-auto">
          {filteredStates.map((state) => (
            <li
              key={state}
              className="p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectState(state)}
            >
              {state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectRegion;
