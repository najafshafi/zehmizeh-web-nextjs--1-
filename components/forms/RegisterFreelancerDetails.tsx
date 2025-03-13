import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import default styles
import CustomButton from "../custombutton/CustomButton";
import PhoneInputWrapper from "../styled/PhoneInputWrapper";
import PhoneNumberInput from "./phone-number-input";
import ErrorMessage from "../ui/ErrorMessage";
// import { IFreelancerDetails } from "@/helpers/types/freelancer.type"

interface RegisterFreelancerDetailsProps {
  onNext: (data: FreelancerDetailsData) => void;
  onBack: () => void;
  initialData?: FreelancerDetailsData;
}

interface CountryData {
  id: string;
  name: string;
  states: string[];
}

interface FreelancerDetailsData {
  isAgency: boolean;
  agencyName?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  phone: string;
}

const countryStates: CountryData[] = [
  {
    id: "US",
    name: "United States",
    states: [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
  },
  {
    id: "IL",
    name: "Israel",
    states: [
      "Central District",
      "Haifa District",
      "Jerusalem District",
      "Northern District",
      "Southern District",
      "Tel Aviv District",
    ],
  },
  {
    id: "UK",
    name: "United Kingdom",
    states: ["England", "Scotland", "Wales", "Northern Ireland"],
  },
  {
    id: "BE",
    name: "Belgium",
    states: ["Flemish Region", "Walloon Region", "Brussels-Capital Region"],
  },
  {
    id: "CA",
    name: "Canada",
    states: [
      "Alberta",
      "British Columbia",
      "Manitoba",
      "New Brunswick",
      "Newfoundland and Labrador",
      "Nova Scotia",
      "Ontario",
      "Prince Edward Island",
      "Quebec",
      "Saskatchewan",
      "Northwest Territories",
      "Nunavut",
      "Yukon",
    ],
  },
  {
    id: "ZA",
    name: "South Africa",
    states: [
      "Eastern Cape",
      "Free State",
      "Gauteng",
      "KwaZulu-Natal",
      "Limpopo",
      "Mpumalanga",
      "Northern Cape",
      "North West",
      "Western Cape",
    ],
  },
  {
    id: "AU",
    name: "Australia",
    states: [
      "New South Wales",
      "Queensland",
      "South Australia",
      "Tasmania",
      "Victoria",
      "Western Australia",
      "Australian Capital Territory",
      "Northern Territory",
    ],
  },
  {
    id: "MX",
    name: "Mexico",
    states: [
      "Aguascalientes",
      "Baja California",
      "Baja California Sur",
      "Campeche",
      "Chiapas",
      "Chihuahua",
      "Coahuila",
      "Colima",
      "Durango",
      "Guanajuato",
      "Guerrero",
      "Hidalgo",
      "Jalisco",
      "Mexico State",
      "Michoacán",
      "Morelos",
      "Nayarit",
      "Nuevo León",
      "Oaxaca",
      "Puebla",
      "Querétaro",
      "Quintana Roo",
      "San Luis Potosí",
      "Sinaloa",
      "Sonora",
      "Tabasco",
      "Tamaulipas",
      "Tlaxcala",
      "Veracruz",
      "Yucatán",
      "Zacatecas",
    ],
  },
  {
    id: "FR",
    name: "France",
    states: [
      "Auvergne-Rhône-Alpes",
      "Bourgogne-Franche-Comté",
      "Brittany",
      "Centre-Val de Loire",
      "Corsica",
      "Grand Est",
      "Hauts-de-France",
      "Île-de-France",
      "Normandy",
      "Nouvelle-Aquitaine",
      "Occitanie",
      "Pays de la Loire",
      "Provence-Alpes-Côte d'Azur",
    ],
  },
  {
    id: "DE",
    name: "Germany",
    states: [
      "Baden-Württemberg",
      "Bavaria",
      "Berlin",
      "Brandenburg",
      "Bremen",
      "Hamburg",
      "Hesse",
      "Lower Saxony",
      "Mecklenburg-Vorpommern",
      "North Rhine-Westphalia",
      "Rhineland-Palatinate",
      "Saarland",
      "Saxony",
      "Saxony-Anhalt",
      "Schleswig-Holstein",
      "Thuringia",
    ],
  },
  {
    id: "AR",
    name: "Argentina",
    states: ["Buenos Aires", "Córdoba", "Santa Fe", "Mendoza", "Tucumán"],
  },
  {
    id: "BR",
    name: "Brazil",
    states: [
      "São Paulo",
      "Rio de Janeiro",
      "Minas Gerais",
      "Bahia",
      "Rio Grande do Sul",
    ],
  },
  {
    id: "HU",
    name: "Hungary",
    states: ["Central Hungary", "Transdanubia", "Great Plain"],
  },
  {
    id: "CH",
    name: "Switzerland",
    states: ["Zürich", "Geneva", "Vaud", "Bern", "Lucerne"],
  },
  {
    id: "PA",
    name: "Panama",
    states: ["Panamá", "Chiriquí", "Bocas del Toro", "Coclé", "Colón"],
  },
  {
    id: "NZ",
    name: "New Zealand",
    states: ["Auckland", "Wellington", "Canterbury", "Otago", "Waikato"],
  },
  {
    id: "GI",
    name: "Gibraltar",
    states: [],
  },
  {
    id: "AT",
    name: "Austria",
    states: ["Vienna", "Tyrol", "Salzburg", "Carinthia", "Upper Austria"],
  },
];

const RegisterFreelancerDetails: React.FC<RegisterFreelancerDetailsProps> = ({
  onNext,
  onBack,
  initialData,
}) => {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [isAgency, setIsAgency] = useState(initialData?.isAgency || false);
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [confirmPassword, setConfirmPassword] = useState(initialData?.confirmPassword || "");
  const [selectedCountry, setSelectedCountry] = useState(initialData?.country || "");
  const [selectedState, setSelectedState] = useState(initialData?.state || "");
  const [phone, setPhone] = useState<string | undefined>(initialData?.phone || "");
  const [agencyName, setAgencyName] = useState(initialData?.agencyName || "");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [showTooltip, setShowTooltip] = useState(false);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const agencyNameRef = useRef<HTMLInputElement>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [isFocusedFirstName, setIsFocusedFirstName] = useState(false);
  const [isFocusedLastName, setIsFocusedLastName] = useState(false);
  const [isFocusedAgencyName, setIsFocusedAgencyName] = useState(false);

  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] =
    useState(false);

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [stateError, setStateError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!firstName) {
      setFirstNameError("First name is required.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    if (!email) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Password confirmation is required.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!selectedCountry) {
      setCountryError("Country is required.");
      isValid = false;
    } else {
      setCountryError("");
    }

    if (!selectedState) {
      setStateError("State/region is required.");
      isValid = false;
    } else {
      setStateError("");
    }

    if (!phone) {
      setPhoneError("Phone number is required.");
      isValid = false;
    } else {
      setPhoneError("");
    }

    return isValid;
  };


  const handleNext = () => {
    if (validateForm()) {
      // Prepare data to send back to parent component
      const detailsData: FreelancerDetailsData = {
        isAgency,
        agencyName: isAgency ? agencyName : undefined,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        country: selectedCountry,
        state: selectedState,
        phone: phone || "",
      };
      
      console.log("Form is valid", detailsData);
      onNext(detailsData);
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedCountry(selected);
    setSelectedState("");
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className="flex flex-col gap-10 md:px-0 px-8  w-full max-w-[600px] sm:mt-0 mt-3">
      <div className="flex items-center justify-center">
        <Image
          src={"/zehmizeh-logo.svg"}
          alt={"logo"}
          width={70}
          height={70}
          quality={100}
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="sm:text-[24px] text-[20px] text-black leading-none">
          Are you registering as an agency?
        </p>
        <p className=" text-gray-500 text-[15px]">
          A freelancer who works alone is not considered an agency. If this
          account will be shared between coworkers, register as an agency.
        </p>
        <div className="flex flex-row gap-4">
          <button
            className={`py-4 px-10 rounded-xl border ${
              isAgency
                ? "border-2  border-black text-black"
                : "border-gray-400 text-gray-500"
            }`}
            onClick={() => setIsAgency(true)}
          >
            Yes
          </button>
          <button
            className={`py-4 px-10 rounded-xl border ${
              !isAgency
                ? "border-2 border-black text-black"
                : "border-gray-400 text-gray-500"
            }`}
            onClick={() => setIsAgency(false)}
          >
            No
          </button>
        </div>
      </div>

      <div className="mt-3 w-full flex flex-col gap-2">
        <p className="sm:text-[24px] text-[20px] text-black leading-none">
          Account Details
        </p>
        <p className="sm:text-[24px] text-[20px] text-[#86888A] font-light leading-none mt-3">
          Account details can be changed later
        </p>
        {isAgency && (
          <div
            className={`flex-grow p-1 rounded-lg transition-all duration-300 mt-2 ${
              isFocusedAgencyName
                ? "bg-blue-500/40 border"
                : "border-transparent"
            }`}
            onClick={() => agencyNameRef.current?.focus()}
          >
            <div className="relative p-4 rounded-md border border-gray-300 bg-white cursor-text">
              <input
                type="text"
                placeholder=" "
                ref={agencyNameRef}
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                onFocus={() => setIsFocusedAgencyName(true)}
                onBlur={() => setIsFocusedAgencyName(false)}
                className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent"
              />
              <label
                className="cursor-text absolute left-4 text-gray-400 transition-all
                peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
                peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
                -top-1 text-[14px] font-light"
              >
                Agency Name
              </label>
            </div>
          </div>
        )}
        <div className="flex md:flex-row flex-col w-full gap-3 mt-2">
          <div
            className={`flex-grow p-1 rounded-lg transition-all duration-300 ${
              isFocusedFirstName
                ? "bg-blue-500/40 border"
                : "border-transparent"
            }`}
            onClick={() => firstNameRef.current?.focus()}
          >
            <div className="relative p-4 rounded-md border border-gray-300 bg-white cursor-text">
              <input
                type="text"
                placeholder=" "
                ref={firstNameRef}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={() => setIsFocusedFirstName(true)}
                onBlur={() => setIsFocusedFirstName(false)}
                className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent"
              />
              <label
                className="cursor-text absolute left-4 text-gray-400 transition-all
            peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
            -top-1 text-[14px] font-light"
              >
                First Name
              </label>
            </div>
            {firstNameError && (
              <p className="text-red-600 text-[15px] pl-1">{firstNameError}</p>
            )}
          </div>
          <div
            className={`flex-grow p-1 rounded-lg transition-all duration-300 ${
              isFocusedLastName ? "bg-blue-500/40 border" : "border-transparent"
            }`}
            onClick={() => lastNameRef.current?.focus()}
          >
            <div className="relative p-4 rounded-md border border-gray-300 bg-white cursor-text">
              <input
                type="text"
                placeholder=" "
                ref={lastNameRef}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={() => setIsFocusedLastName(true)}
                onBlur={() => setIsFocusedLastName(false)}
                className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent"
              />
              <label
                className="cursor-text absolute left-4 text-gray-400 transition-all
            peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
            -top-1 text-[14px] font-light"
              >
                Last Name
              </label>
            </div>
            {lastNameError && (
              <p className="text-red-600 text-[15px] pl-1">{lastNameError}</p>
            )}
          </div>
        </div>

        <div className="flex md:flex-row flex-col w-full gap-3 mt-2">
          <div className="flex-grow ml-1">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              className="block w-full text-gray-900 bg-white rounded-lg border border-gray-300 px-2 py-4 focus:outline-blue-500"
            >
              <option value="" className="py-2">
                Select Country
              </option>
              {countryStates.map((country) => (
                <option
                  className="py-2 hover:bg-gray-100"
                  key={country.id}
                  value={country.id}
                >
                  {country.name}
                </option>
              ))}
            </select>
            {countryError && (
              <p className="text-red-600 text-[15px] pl-1">{countryError}</p>
            )}
          </div>
          <div className="flex-grow ml-1">
            <select
              value={selectedState}
              onChange={handleStateChange}
              disabled={!selectedCountry}
              className="block w-full text-gray-900 bg-white rounded-lg border border-gray-300 px-2 py-4 focus:outline-blue-500"
            >
              <option value="">Select State/Region</option>
              {selectedCountry &&
                countryStates
                  .find((c) => c.id === selectedCountry)
                  ?.states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
            </select>
            {stateError && (
              <p className="text-red-600 text-[15px] pl-1">{stateError}</p>
            )}
          </div>
        </div>
        <div className="flex flex-row w-full gap-3 mt-2">
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry="US"
            value={phone}
            onChange={(value) => setPhone(value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            className="px-2 py-4 ml-1 rounded-lg border border-gray-300 w-full !focus:outline-none !focus:ring-0"
          />
          <style jsx>{`
            .PhoneInputCountryIcon {
              width: 15px !important; 
              height: 15px !important;
            }
            input {
              border: none !important;
              outline: none !important;
              box-shadow: none !important;
            }
            input:focus {
              border: none !important;
              outline: none !important;
              box-shadow: none !important;
            }
          `}</style>
           
        </div>
        {phoneError && (
          <p className="text-red-600 text-[15px] pl-1">{phoneError}</p>
        )}

        {/* <div className="flex flex-row w-full gap-3 mt-2">
        <PhoneInputWrapper>
            <label>Enter Phone Number</label>
            <PhoneNumberInput initialValue={phone}     onChange={(value) => setPhone(value)} />
          </PhoneInputWrapper>
          <ErrorMessage>{phoneError}</ErrorMessage>
        </div> */}

        <div
          className={`flex-grow p-1 rounded-lg transition-all duration-300 ${
            isFocusedEmail ? "bg-blue-500/40 border" : "border-transparent"
          }`}
          onClick={() => emailRef.current?.focus()}
        >
          <div className="relative p-4 rounded-md border border-gray-300 bg-white cursor-text">
            <input
              type="email"
              placeholder=" "
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocusedEmail(true)}
              onBlur={() => setIsFocusedEmail(false)}
              className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent"
            />
            <label
              className="cursor-text absolute left-4 text-gray-400 transition-all
            peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
            -top-1 text-[14px] font-light"
            >
              Email
            </label>
          </div>
          {emailError && (
            <p className="text-red-600 text-[15px] pl-1">{emailError}</p>
          )}
        </div>
        <div
          className={`flex-grow p-1 rounded-lg transition-all duration-300 ${
            isFocusedPassword ? "bg-blue-500/40 border" : "border-transparent"
          }`}
          onClick={() => passwordRef.current?.focus()}
        >
          <div className="relative p-4 flex flex-row items-center justify-between rounded-md border border-gray-300 bg-white cursor-text">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder=" "
              ref={passwordRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsFocusedPassword(true)}
              onBlur={() => setIsFocusedPassword(false)}
              className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent"
            />
            <div className="flex gap-4 items-center">
              <div className="relative flex items-center">
                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 w-64 p-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg">
                    Every password must include at least: 1 uppercase letter, 1
                    lowercase letter, 1 number, 1 symbol, and at least 8
                    characters
                    {/* Tooltip Arrow */}
                    <div className="absolute left-1/2 bottom-[-5px] transform -translate-x-1/2 rotate-45 w-3 h-3 bg-gray-800"></div>
                  </div>
                )}

                {/* Information Icon */}
                <div
                  className="h-7 w-7 font-semibold rounded-full flex items-center justify-center bg-[#E7E7E7] cursor-pointer relative"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  i
                </div>
              </div>

              <IoEyeOutline
                onClick={togglePasswordVisibility}
                className={` cursor-pointer  text-[24px] ${
                  passwordVisible ? "text-black" : "text-gray-400"
                }`}
              />
            </div>
            <label
              className="cursor-text absolute left-4 text-gray-400 transition-all
            peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
            -top-1 text-[14px] font-light"
            >
              Password
            </label>
          </div>
          {passwordError && (
            <p className="text-red-600 text-[15px] pl-1">{passwordError}</p>
          )}
        </div>
        <div
          className={`flex-grow p-1 rounded-lg transition-all duration-300 ${
            isFocusedConfirmPassword
              ? "bg-blue-500/40 border"
              : "border-transparent"
          }`}
          onClick={() => confirmPasswordRef.current?.focus()}
        >
          <div className="relative p-4 flex flex-row items-center justify-between rounded-md border border-gray-300 bg-white cursor-text">
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder=" "
              ref={confirmPasswordRef}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setIsFocusedConfirmPassword(true)}
              onBlur={() => setIsFocusedConfirmPassword(false)}
              className="peer block w-full text-gray-900 bg-transparent focus:outline-none placeholder-transparent"
            />
            <IoEyeOutline
              onClick={toggleConfirmPasswordVisibility}
              className={` cursor-pointer  text-[24px] ${
                confirmPasswordVisible ? "text-black" : "text-gray-400"
              }`}
            />
            <label
              className="cursor-text absolute left-4 text-gray-400 transition-all
            peer-focus:-top-[1px] peer-focus:text-[14px] peer-focus:text-gray-400 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-[17px]
            -top-1 text-[14px] font-light"
            >
              Confirm Password
            </label>
          </div>
          {confirmPasswordError && (
            <p className="text-red-600 text-[15px] pl-1">
              {confirmPasswordError}
            </p>
          )}
        </div>

        <p className="md:text-[21px] text-[18px] text-center mt-8">
          Already have an account?{" "}
          <Link href={"/login"} className="text-primary">
            Log in
          </Link>
        </p>
        <div className="flex flex-row items-center justify-between mt-2 pb-5">
          <CustomButton
            text="Back"
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-[#E7E7E7] text-[18px]"
            onClick={onBack}
          />
          <CustomButton
            text="Next"
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterFreelancerDetails;
