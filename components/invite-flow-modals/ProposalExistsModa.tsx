"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  show: boolean;
  job_post_id: string;
  toggle: () => void;
}

const ProposalExistsModal = ({ show, toggle, job_post_id }: Props) => {
  const onCloseModal = () => {
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
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
                <button
                  type="button"
                  className="absolute top-4 right-4 md:top- md:-right-8 md:text-white text-gray-400 hover:text-gray-500"
                  onClick={onCloseModal}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="mt-10 px-4 py-5 sm:p-6">
                  <p className="text-lg text-gray-700">
                    This freelancer already submitted a proposal to that project
                    - click{" "}
                    <Link
                      href={`/client-job-details/${job_post_id}/applicants`}
                      className="text-amber-500 hover:text-amber-600 underline transition-colors duration-200"
                    >
                      here
                    </Link>{" "}
                    to see it!
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProposalExistsModal;
