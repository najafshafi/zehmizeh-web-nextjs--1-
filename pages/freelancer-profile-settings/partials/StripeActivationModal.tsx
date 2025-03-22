"use client";

import { useEffect, useState } from "react";
import Checkbox from "@/components/forms/CheckBox";
import CountryDropdown from "@/components/forms/country-dropdown/CountryDropdown";
import { IDENTITY_DOCS } from "@/helpers/const/constants";
import Link from "next/link";
import { VscClose } from "react-icons/vsc";

type CountryCode = keyof typeof IDENTITY_DOCS;

interface Country {
  country_name: string;
  country_short_name: CountryCode;
}

interface Props {
  onVerify: (country: Country) => void;
  step: number;
  setStep: (step: number) => void;
}

interface ModalContent {
  id: number;
  title: string;
  content: React.ReactNode;
}

const StripeActivationModal = ({ onVerify, step, setStep }: Props) => {
  const [check, setCheck] = useState(false);
  const [checkErr, setCheckErr] = useState(false);
  const [countryErr, setCountryErr] = useState(false);
  const [currIndex, setCurrIndex] = useState(step - 1);
  const [country, setCountry] = useState<Country | null>(null);

  // Add effect to manage body scrolling
  useEffect(() => {
    if (step > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure body scrolling is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [step]);

  const modalContent: ModalContent[] = [
    {
      id: 1,
      title: "Getting Paid on ZMZ",
      content: (
        <div>
          <p>
            To get paid on ZehMizeh, all freelancers have to register for an
            account with our payment processing service,{" "}
            <a
              href="https://stripe.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Stripe
            </a>
            . They do the work of transporting the freelancers&apos; fees,
            crossing country borders, and delivering precisely according to your
            country&apos;s banking customs.
          </p>
          <p>
            <b>If you are from Israel, or any non-American country</b>- you can
            still get paid on ZehMizeh! While the normal Stripe account may not
            be available in your country, all ZehMizeh users can get paid
            through the special partnership we have with Stripe.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: "Preferred Banking Country",
      content: (
        <div>
          <p>
            Before registering for Stripe, you have to decide:
            <b> where would you like your payments to arrive?</b>
          </p>
          <p>
            You can have your payments sent to a country you&apos;re not living
            in, as long as:
            <ol className="list-decimal pl-5 mt-2">
              <li className="mt-1">
                It&apos;s an approved ZehMizeh country (listed in the options
                below)
              </li>
              <li className="mt-1">You have a bank account there.</li>
            </ol>
          </p>
          <p>
            Select below the country <b>of the bank account</b> where you would
            like your payments to be sent. (If that&apos;s the country you live
            in, select that country.){" "}
            <b className="text-red-600">This choice cannot be changed later.</b>
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: "How to Register",
      content: (
        <div>
          <p>
            Stripe will verify user info in phases, asking for and verifying
            information up to three times. They&apos;ll be asking for basic
            information, like:
          </p>
          <ul className="list-disc pl-5 mt-2">
            <li className="mt-1">Name</li>
            <li className="mt-1">Birthdate</li>
            {country?.country_short_name === "US" && (
              <>
                <li className="mt-1">Address</li>
                <li className="mt-1">Phone Number</li>
                <li className="mt-1">
                  Last 4 Digits of your SSN or Identity document
                </li>
              </>
            )}
            <li className="mt-1">Bank Account Details</li>
          </ul>
          <p>
            Most important is your <b>proof of identity document</b>, a
            government-issued document that matches the information you&apos;ve
            entered. This is essential for verification purposes.
          </p>
          <div className="mt-2">
            Your Preferred Banking Country is: {country?.country_name}
          </div>
          <div className="mt-2">Acceptable ID Documents include:</div>
          <ul className="list-disc pl-5 mt-2">
            {country?.country_short_name &&
              IDENTITY_DOCS[country.country_short_name]?.map(
                (item: string, index: number) => (
                  <li className="mt-1" key={index}>
                    {item}
                  </li>
                )
              )}
          </ul>
          <p className="mt-2">
            For more details, please click{" "}
            {country?.country_short_name && (
              <Link
                href={`https://docs.stripe.com/acceptable-verification-documents?country=${country.country_short_name}`}
                className="text-blue-600 hover:text-blue-800"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
            )}
            .
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: "If you don't have texting on your phone...",
      content: (
        <div>
          <p>
            Stripe requires users to have access to texting to verify their
            identity. There is no way around this in their design.
          </p>
          <p>
            This is only necessary for registration, so we recommend that users
            without texting temporarily borrow the phone number of a friend with
            texting. Once you have your ID Document in hand, the whole
            registration should be simple to complete in one sitting, without
            having to borrow the phone number again.
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setCurrIndex(step - 1);
  }, [step]);

  const onHide = () => {
    setStep(0);
    setCountry(null);
    setCheckErr(false);
  };

  if (!step) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick={onHide}
        />

        {/* Modal */}
        <div className="inline-block transform text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[800px] sm:align-middle">
          <div className="relative bg-white rounded-lg p-12">
            {/* Close Button */}
            <VscClose
              className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
              onClick={onHide}
            />

            {/* Step Counter */}
            <div className="text-right mb-4">
              {step}/{modalContent.length}
            </div>

            {/* Title */}
            <h3 className="!text-[2rem] !capitalize !text-black font-bold mb-8 pb-2">
              {modalContent[currIndex]?.title}
            </h3>

            {/* Content */}
            <div className="prose max-w-none">
              {modalContent[currIndex]?.content}
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-start gap-3">
              {/* Step 1 */}
              {step === 1 && (
                <button
                  onClick={() => setStep(step + 1)}
                  className="rounded-full bg-[#F7B500] px-6 py-2.5 text-base font-medium text-[#1d1e1b] hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2"
                >
                  Next
                </button>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <>
                  <div className="w-full mb-4">
                    <p className="mb-2">
                      Preferred Banking Country
                      <span className="text-red-500">&nbsp;*</span>
                    </p>
                    <CountryDropdown
                      placeholder="Enter the country that your payments will be sent to"
                      selectedCountry={country}
                      onSelectCountry={(item: Country) => setCountry(item)}
                    />
                    {countryErr && !country && (
                      <p className="text-red-600 text-sm mt-1">
                        This field is required
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setStep(step - 1)}
                      className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        setCountryErr(true);
                        if (country) setStep(step + 1);
                      }}
                      className="rounded-full bg-[#F7B500] px-6 py-2.5 text-base font-medium text-[#1d1e1b] hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <>
                  <div className="flex items-center mb-4">
                    <Checkbox
                      checked={check}
                      toggle={(e) => setCheck(e.target.checked)}
                    />
                    <span className="ml-2">
                      I have read these instructions and I understand.
                    </span>
                  </div>
                  {checkErr && !check && (
                    <p className="text-red-600 text-sm mb-4">
                      Please confirm that the instructions are read.
                    </p>
                  )}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setStep(step - 1)}
                      className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        setCheckErr(true);
                        if (check) setStep(step + 1);
                      }}
                      className="rounded-full bg-[#F7B500] px-6 py-2.5 text-base font-medium text-[#1d1e1b] hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Step 4 */}
              {step === 4 && (
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setStep(step - 1)}
                    className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      if (check && country) {
                        onVerify(country);
                      }
                    }}
                    className="rounded-full bg-[#F7B500] px-6 py-2.5 text-base font-medium text-[#1d1e1b] hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2"
                  >
                    Continue to Stripe Registration
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeActivationModal;
