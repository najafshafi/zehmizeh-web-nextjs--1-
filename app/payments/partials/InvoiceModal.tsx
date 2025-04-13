"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface Props {
  show: boolean;
  onClose: () => void;
}

function InvoiceModal({ show, onClose }: Props) {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
        </Transition.Child>

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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white px-4 py-8 lg:p-12 text-left align-middle shadow-xl transition-all">
                <button
                  type="button"
                  className="absolute top-4 right-4 lg:top-0 lg:-right-8 text-gray-400 hover:text-gray-500"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="flex flex-col">
                  <Dialog.Title className="text-2xl font-normal mb-6">
                    Invoice
                  </Dialog.Title>

                  <div className="p-4" id="invoice">
                    <header className="flex justify-between items-start">
                      <div className="text-gray-700">
                        <p className="font-medium">John Smith</p>
                        <p className="text-gray-600">john@gmail.com</p>
                        <p className="text-gray-600">LA, USA</p>
                      </div>
                      <figure className="relative w-24 h-24">
                        <Image
                          src="/logo.svg"
                          alt="logo"
                          fill
                          className="object-contain"
                        />
                      </figure>
                    </header>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="px-8 py-[0.9rem] text-lg font-normal text-white bg-amber-500 border border-transparent rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                    >
                      Download
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
}

export default InvoiceModal;
