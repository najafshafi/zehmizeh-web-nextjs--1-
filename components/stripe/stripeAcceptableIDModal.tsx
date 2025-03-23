"use client";

import { useEffect } from "react";
import { VscClose } from "react-icons/vsc";
import { IDENTITY_DOCS } from "@/helpers/const/constants";

type CountryCode = keyof typeof IDENTITY_DOCS;

interface Props {
  show: boolean;
  toggle: () => void;
  country: CountryCode;
}

const StripeAcceptableIDList = ({ show, toggle, country }: Props) => {
  // Add effect to manage body scrolling
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure body scrolling is restored when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0 p-2">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick={toggle}
        />

        {/* Modal */}
        <div className="inline-block transform text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[800px] sm:align-middle">
          <div className="relative bg-white rounded-xl p-12">
            {/* Close Button */}
            <VscClose
              className="absolute top-4 lg:top-0 right-4 lg:-right-8 text-2xl text-black lg:text-white hover:text-gray-200 cursor-pointer"
              onClick={toggle}
            />

            {/* Title */}
            <h4 className="text-2xl font-bold mb-2">
              Acceptable ID Documents include:
            </h4>

            {/* Content */}
            <div className="text-base">
              <ul className="list-disc space-y-1 pl-6">
                {country &&
                  IDENTITY_DOCS[country]?.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeAcceptableIDList;
