"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  show: boolean;
  onCloseModal: () => void;
  isLoading: boolean;
  handleClick: (type: "public" | "hidden") => void;
}

export const PostVisibilityModal = ({
  show,
  onCloseModal,
  isLoading,
  handleClick,
}: Props) => {
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
                {!isLoading && (
                  <button
                    type="button"
                    className="absolute top-4 right-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500"
                    onClick={onCloseModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                )}

                <div className="text-center">
                  <Dialog.Title
                    as="h4"
                    className="text-xl font-semibold text-gray-900 mb-6"
                  >
                    Who should see the project?
                  </Dialog.Title>

                  <div className="text-lg text-gray-600 space-y-2">
                    <p>
                      If you&apos;d like to post so all ZMZ freelancers can see
                      it, click <b>&quot;Post Publicly.&quot;</b>
                    </p>
                    <p>
                      If you&apos;d like only freelancers you invite to have
                      access, click <b>&quot;Post Hidden.&quot;</b>
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                    <button
                      type="button"
                      className="px-6 py-[0.9rem] text-lg font-normal text-white bg-amber-500 border border-transparent rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      disabled={isLoading}
                      onClick={() => handleClick("public")}
                    >
                      Post Publicly
                    </button>
                    <button
                      type="button"
                      className="px-6 py-[0.9rem] text-lg font-normal text-white bg-amber-500 border border-transparent rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      disabled={isLoading}
                      onClick={() => handleClick("hidden")}
                    >
                      Post Hidden
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
