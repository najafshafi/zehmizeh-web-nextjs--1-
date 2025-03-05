"use client";

import { useEffect, useState } from "react";
import { PhoneInput, CountryIso2 } from "react-international-phone";
import "react-international-phone/style.css";

interface Props {
  onChange: (formattedValue: string, rawValue: string) => void;
  initialValue?: string;
}

const PhoneNumberInput: React.FC<Props> = ({ onChange, initialValue }) => {
  const [phone, setPhone] = useState<string>(initialValue || "");
  const [defaultCountry, setDefaultCountry] = useState<CountryIso2>("US");

  useEffect(() => {
    if (phone) {
      onChange(phone, phone.replace(/\D/g, ""));
      setDefaultCountry(phone);

    }
  }, [phone, onChange]);

  return (
    <div className="w-full">
      <PhoneInput
        value={phone}
        onChange={setPhone}
        defaultCountry={defaultCountry}
        className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default PhoneNumberInput;