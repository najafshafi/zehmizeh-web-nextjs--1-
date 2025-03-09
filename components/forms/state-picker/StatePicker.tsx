/*
 * This component is a dropdown of states based on the selected country
 */

import { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { getStates } from '@/helpers/http/common';
import { MultiSelectCustomStyle } from './MultiSelectCustomStyle';
import './style.css';

type Props = {
  countryCode?: string;
  onSelectState: (item: string) => void;
  selectedState?: any;
  borderColor?: any;
};

const multiSelectProps = {
  closeMenuOnSelect: true,
};

const StateDropdown = ({ countryCode, selectedState, borderColor }: Props) => {
  const [states, setStates] = useState<any>([]);

  useEffect(() => {
    // When the country is selected then this will load that conuntry's states
    if (countryCode) {
      getStates(countryCode).then((res) => {
        const formattedOptions = res?.data?.map((item: any) => {
          const obj = item;
          obj.label = item?.name;
          obj.value = item?.name;
          return obj;
        });
        setStates(formattedOptions);
      });
    }
  }, [countryCode]);

  return (
    <div>
      <Select
        {...multiSelectProps}
        styles={MultiSelectCustomStyle(borderColor)}
        placeholder="Select State/Region"
        components={{ NoOptionsMessage }}
        options={states}
        isSearchable={true}
        isMulti={true}
        value={selectedState}
        isDisabled={!countryCode}
      />
    </div>
  );
};

export default StateDropdown;

const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div>
        {props?.selectProps?.inputValue ? `No result found for '${props?.selectProps?.inputValue}'` : 'Search...'}
      </div>
    </components.NoOptionsMessage>
  );
};
