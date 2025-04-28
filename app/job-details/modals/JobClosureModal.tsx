"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  show: boolean;
  onConfirm: (selection: string) => void;
  loading?: boolean;
};

const JobClosureModal = ({ show, onConfirm, loading = false }: Props) => {
  const handleSelection = (option: string) => () => {
    onConfirm(option);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
              <Dialog.Panel className="w-full max-w-[556px] transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex flex-col justify-center">
                  <Dialog.Title className="text-2xl font-bold text-center mb-3">
                    The client is ending this project.
                  </Dialog.Title>

                  <div className="text-lg font-normal text-center mb-2">
                    There are three actions you can take.
                  </div>

                  <ul className="space-y-2">
                    <li className="text-lg font-normal text-start">
                      If you've already been paid for all of the work you've
                      done on this project, press "Accept Closure" below to
                      close the project.
                    </li>
                    <li className="text-lg font-normal text-start">
                      If you&apos;ve completed work that you haven&apos;t been
                      paid for yet, you have the opportunity to submit one last
                      hour submission by selecting &quot;Submit Final
                      Hours.&quot; This project will close once these hours are
                      paid for, so be sure to include all remaining unpaid hours
                      in your submission.
                    </li>
                    <li className="text-lg font-normal text-start">
                      If you need to speak to the client before closing, press
                      &quot;Delay Closure&quot; below.
                    </li>
                  </ul>

                  <div className="text-lg font-normal text-center mt-4">
                    What would you like to do?
                  </div>

                  <div className="flex flex-col gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleSelection("end_job")}
                      disabled={loading}
                      className="w-full rounded-full border-2 border-gray-800 px-8 py-3 text-base font-normal text-gray-800 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Accept Closure
                    </button>

                    <button
                      type="button"
                      onClick={handleSelection("final_milestone")}
                      disabled={loading}
                      className="w-full rounded-full border-2 border-gray-800 px-8 py-3 text-base font-normal text-gray-800 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Final Hours
                    </button>

                    <button
                      type="button"
                      onClick={handleSelection("decide_later")}
                      disabled={loading}
                      className="w-full rounded-full border-2 border-gray-800 px-8 py-3 text-base font-normal text-gray-800 hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Delay Closure
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

export default JobClosureModal;
