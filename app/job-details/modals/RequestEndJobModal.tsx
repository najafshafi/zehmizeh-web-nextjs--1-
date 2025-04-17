"use client";

import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ErrorIcon from "@/public/icons/error-orange-icon.svg";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
};

const EndJobModal = ({ show, toggle, onConfirm }: Props) => {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const onCloseModal = () => {
    setErrorMsg("");
    toggle();
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-lg transform  rounded-2xl bg-white px-4 py-8 md:p-12 shadow-xl transition-all">
                <div className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white">
                  <button type="button" onClick={onCloseModal}>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center">
                  {!errorMsg ? (
                    <>
                      <Dialog.Title className="text-xl font-normal text-center mb-2">
                        Are you sure you&apos;re ready to end this project? If
                        the employer accepts this request, you won&apos;t be
                        able to post any more submissions.
                      </Dialog.Title>
                      <div className="w-full space-y-3 mt-4">
                        <button
                          type="button"
                          onClick={toggle}
                          className="w-full rounded-full border border-gray-800 px-8 py-4 text-base font-normal text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          No, I&apos;m not ready
                        </button>
                        <button
                          type="button"
                          onClick={() => onConfirm()}
                          className="w-full rounded-full border border-gray-800 px-8 py-4 text-base font-normal text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                          Yes, I&apos;m finished - request to close
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src={ErrorIcon}
                        alt="Error"
                        className="mb-4"
                        width={48}
                        height={48}
                      />
                      <Dialog.Title className="text-xl font-normal text-center text-red-500">
                        {errorMsg}
                      </Dialog.Title>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EndJobModal;
