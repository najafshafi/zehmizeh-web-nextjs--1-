/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * This component is a dropdown of states based on the selected country
 */
import { getCountries } from "@/helpers/http/common";
import CustomSelect from "@/components/custom-select/CustomSelect";
import toast from "react-hot-toast";

// Define the type to match CustomSelect's OptionType but with country_name
type CountryOptionType = {
  label: string;
  value: string | number | boolean;
  country_name: string;
  [key: string]: any;
};

type Props = {
  selectedCountry: CountryOptionType | null;
  onSelectCountry: (item: any) => void; // Keep this as any to match CustomSelect's expectations
  placeholder?: string;
};

const CountryDropdown = ({
  selectedCountry,
  onSelectCountry,
  placeholder,
}: Props) => {
  const countriesOptions = (
    inputValue: string
  ): Promise<CountryOptionType[]> => {
    // This will be called when something is typed in input and will call get skills api with that keyword
    const options: CountryOptionType[] = [];

    return getCountries(inputValue || "")
      .then((res) => {
        res.data.forEach(function (item: any) {
          const obj: CountryOptionType = {
            ...item,
            label: item.country_name,
            value: item.country_name,
          };
          options.push(obj);
        });
        return options;
      })
      .catch((error) => {
        let errorMessage = "Failed to load countries";
        if (
          error?.response?.data?.message &&
          typeof error?.response?.data?.message === "string"
        )
          errorMessage = error.response.data.message;
        else if (error?.message && typeof error.message === "string")
          errorMessage = error.message;
        else if (error && typeof error === "string") errorMessage = error;

        toast.error(errorMessage);
        // Return empty array instead of undefined when there's an error
        return [];
      });
  };

  return (
    <div>
      <CustomSelect
        isMulti={false}
        placeholder={placeholder ?? "Select Country"}
        loadOptions={countriesOptions}
        selectedValue={selectedCountry}
        onSelect={onSelectCountry}
        getOptionValue={(option: any) => option.country_name}
        getOptionLabel={(option: any) => option.country_name}
      />
    </div>
  );
};

export default CountryDropdown;
