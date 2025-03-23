"use client";

import { useEffect } from "react";
import Link from "next/link";
import { VscClose } from "react-icons/vsc";

interface Props {
  show: boolean;
  toggle: () => void;
}

const HowToRegisterAccModal = ({ show, toggle }: Props) => {
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
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          onClick={toggle}
        />

        {/* Modal */}
        <div className="inline-block transform text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[800px] sm:align-middle">
          <div className="relative bg-white rounded-lg p-12 m-2">
            {/* Close Button */}
            <VscClose
              className="absolute top-4 lg:top-0 right-4 lg:-right-8 text-2xl text-black lg:text-white hover:text-gray-200 cursor-pointer"
              onClick={toggle}
            />

            {/* Title */}
            <h4 className="text-2xl font-bold mb-2">How to Register</h4>

            {/* Content */}
            <div className="text-lg">
              <p>
                All freelancers need to register with Stripe to be paid on
                ZehMizeh. Here&apos;s what you need to know:
              </p>
              <div className="mt-4">
                <ol className="list-decimal ml-8 space-y-1">
                  <li>
                    <b>No matter where you live</b> - you can get paid with
                    Stripe on ZehMizeh.
                  </li>
                  <li>
                    You can have your payments sent to a country that you
                    don&apos;t live in, as long as:
                    <ol className="list-[lower-alpha] ml-7">
                      <li>It&apos;s an approved ZMZ country.</li>
                      <li>You have a bank account there.</li>
                    </ol>
                  </li>
                  <li>
                    Stripe will require you to upload a legal ID document to
                    verify your identity. The documents that are accepted will
                    depend on what country you&apos;re from.
                  </li>
                  <li>
                    You will need a phone that receives text to finish signing
                    up for Stripe. You can borrow a phone for this.
                  </li>
                </ol>
              </div>
              <p className="mt-4">
                For more details, visit out Help Center (by clicking the yellow
                icon in the bottom-right) or submit an inquiry -{" "}
                <Link
                  href="/support"
                  className="text-blue-600 hover:text-blue-800"
                >
                  here
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToRegisterAccModal;
