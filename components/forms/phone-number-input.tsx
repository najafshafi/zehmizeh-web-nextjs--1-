import "react-phone-number-input/style.css";
import PhoneInput, { formatPhoneNumber } from "react-phone-number-input";
import { useEffect, useState, useCallback } from "react";
import { fetchCountriesCode } from "@/helpers/validation/common";

// Define a type alias for country codes
type CountryCode = string;

interface Props {
  onChange: (phone: string, formattedValue: string) => void;
  initialValue?: string;
}

const PhoneNumberInput = ({ onChange = () => {}, initialValue }: Props) => {
  const [phone, setPhone] = useState<string | undefined>();
  const [countries, setCountries] = useState<CountryCode[]>([]);

  const getCountriesHandler = async () => {
    const resp = await fetchCountriesCode();
    if (!Array.isArray(resp)) return;
    // Type assertion to CountryCode since we know these are valid country codes
    setCountries(resp.map((res) => res.toLocaleUpperCase() as CountryCode));
  };

  useEffect(() => {
    getCountriesHandler();
  }, []);

  const phoneNumHandler = useCallback(() => {
    if (!phone) return;
    const formattedValue = formatPhoneNumber(phone);
    onChange(formattedValue, phone);
  }, [phone, onChange]);

  useEffect(() => {
    phoneNumHandler();
  }, [phoneNumHandler]);

  useEffect(() => {
    if (initialValue) setPhone(initialValue);
  }, [initialValue]);

  return (
    <>
      {!!countries.length && (
        <PhoneInput
          placeholder="Enter phone number"
          value={phone}
          initialValueFormat="national"
          onChange={setPhone}
          // @ts-expect-error - The PhoneInput component types are expecting CountryCode, but our strings are valid
          countries={countries}
          // @ts-expect-error - Same reason as above
          defaultCountry={countries[0]}
          international
          countryCallingCodeEditable={false}
          className="common-phone-number-input h-[58px] "
          limitMaxLength
        />
      )}
    </>
  );
};

export default PhoneNumberInput;
