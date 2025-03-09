import 'react-phone-number-input/style.css';
import PhoneInput, { formatPhoneNumber } from 'react-phone-number-input';
import { useEffect, useState } from 'react';
import { fetchCountriesCode } from '@/helpers/validation/common';

interface Props {
  onChange: (phone: string, formattedValue: string) => void;
  initialValue?: string;
}
const PhoneNumberInput = ({ onChange = () => {}, initialValue }: Props) => {
  const [phone, setPhone] = useState<any>();
  const [countries, setCountries] = useState([]);

  const getCountriesHandler = async () => {
    const resp = await fetchCountriesCode();
    if (!Array.isArray(resp)) return;
    setCountries(() => resp.map((res) => res.toLocaleUpperCase()));
  };

  useEffect(() => {
    getCountriesHandler();
  }, []);

  const phoneNumHandler = () => {
    const formattedValue = formatPhoneNumber(phone);
    onChange(formattedValue, phone);
  };

  useEffect(() => {
    if (phone) phoneNumHandler();
  }, [phone]);

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
          countries={countries}
          defaultCountry={countries[0]}
          international
          countryCallingCodeEditable={false}
          className="common-phone-number-input"
          limitMaxLength
        />
      )}
    </>
  );
};

export default PhoneNumberInput;
