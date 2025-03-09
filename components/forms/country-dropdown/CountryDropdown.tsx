/*
 * This component is a dropdown of states based on the selected country
 */
import { getCountries } from '@/helpers/http/common';
import CustomSelect from '@/components/custom-select/CustomSelect';
import toast from 'react-hot-toast';

type Props = {
  selectedCountry: any;
  onSelectCountry: (item: any) => void;
  placeholder?: string;
};

const CountryDropdown = ({
  selectedCountry,
  onSelectCountry,
  placeholder,
}: Props) => {
  const countriesOptions = (inputValue: string) => {
    // This will be called when somethig is typed in input and will call get skills api with that keyword

    const options: { label: any; value: any }[] = [];
    return getCountries(inputValue || '')
      .then((res) => {
        res.data.forEach(function (item: any) {
          const obj = item;
          obj.label = item.country_name;
          options.push(obj);
        });
        return options;
      })
      .catch((error) => {
        let errorMessage = 'Failed to load countries';
        if (
          error?.response?.data?.message &&
          typeof error?.response?.data?.message === 'string'
        )
          errorMessage = error.response.data.message;
        else if (error?.message && typeof error.message === 'string')
          errorMessage = error.message;
        else if (error && typeof error === 'string') errorMessage = error;
        toast.error(errorMessage);
      });
  };

  return (
    <div>
      <CustomSelect
        isMulti={false}
        placeholder={placeholder ?? 'Select Country'}
        loadOptions={countriesOptions}
        selectedValue={selectedCountry}
        onSelect={onSelectCountry}
        getOptionValue={(option) => option.country_name}
        getOptionLabel={(option) => option.country_name}
      />
    </div>
  );
};

export default CountryDropdown;
