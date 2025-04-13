"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  stateData: {
    show: boolean;
    loading: boolean;
  };
  toggle: () => void;
  onConfirm: () => void;
};

const MarkMilestoneAsCompleted = ({ stateData, toggle, onConfirm }: Props) => {
  return (
    <Transition appear show={stateData.show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggle}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 shadow-xl transition-all">
                <div className="absolute right-4 top-4 md:top-0 md:-right-8 ">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 md:text-white focus:outline-none"
                    onClick={toggle}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  <Dialog.Title className="text-2xl font-normal text-center md:text-3xl">
                    You're Changing Milestone Status to 'Complete'
                  </Dialog.Title>

                  <p className="text-lg text-gray-600 md:text-xl">
                    By marking a milestone as complete, you're indicating to the
                    client that all of the required uploads have been submitted.
                    They'll be notified that you're ready to have your payment
                    delivered.
                  </p>

                  <div className="flex flex-col md:flex-row justify-center gap-4">
                    <button
                      type="button"
                      onClick={toggle}
                      className="inline-flex justify-center rounded-full border border-gray-800 px-8 py-4 text-base font-normal text-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      It's Not Ready - Cancel
                    </button>
                    <button
                      type="button"
                      onClick={onConfirm}
                      disabled={stateData.loading}
                      className="inline-flex justify-center rounded-full bg-amber-500 px-8 py-4 text-base font-normal text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {stateData.loading ? (
                        <div className="flex items-center">
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Everything is Submitted - Mark as 'Complete'
                        </div>
                      ) : (
                        "Everything is Submitted - Mark as 'Complete'"
                      )}
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

export default MarkMilestoneAsCompleted;
