"use client";

import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface PaymentTermsPopupProps {
  show: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PaymentTermsPopup = ({
  show,
  onClose,
  onAccept,
}: PaymentTermsPopupProps) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[500px] transform overflow-hidden rounded-xl bg-white  px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
                <div className="text-center">
                  <Dialog.Title
                    as="h2"
                    className="text-2xl font-semibold text-gray-900 mb-4"
                  >
                    Payment Terms Agreement
                  </Dialog.Title>

                  <div className="mb-4">
                    <p className="mb-2 text-gray-700">
                      I agree that all payments will be processed through
                      Zehmizeh.
                    </p>
                    <p className="font-bold mb-2 text-gray-900">
                      Paying outside Zehmizeh is against Halacha and violates
                      our{" "}
                      <Link
                        href="/terms-of-service#13"
                        className="text-yellow-500 hover:text-yellow-600 transition-colors"
                      >
                        Terms
                      </Link>
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center items-center">
                    <button
                      onClick={onClose}
                      className="px-8 py-[0.85rem] rounded-full border border-gray-300 bg-white text-gray-900 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onAccept}
                      className="px-14 py-[0.85rem] text-lg rounded-full bg-[#F2B420] text-gray-900 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-300"
                    >
                      I Agree
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PaymentTermsPopup;
