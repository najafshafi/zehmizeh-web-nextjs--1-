"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
  show: boolean;
  toggle: () => void;
};

const NextStepModal = ({ show, toggle }: Props) => {
  return (
    <Transition appear show={show} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white px-4 py-8 md:p-12 shadow-xl transition-all">
                <div className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={toggle}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <Dialog.Title className="text-2xl font-normal mb-4">
                    Next Step
                  </Dialog.Title>

                  <div className="text-base">
                    <span className="font-bold">
                      The client has accepted your proposal - mazal tov!
                    </span>
                    <span className="font-light">
                      {" "}
                      Because this is a Project-Based project, the next step is
                      to discuss the project&apos;s milestones with your client.
                    </span>
                  </div>

                  <div className="text-base font-light">
                    The milestone system is a way of breaking up the project
                    into pieces, allowing the freelancer to get paid as they
                    complete work. For example, if you were ghostwriting a book,
                    you could divide the book into 10 chapters and propose 1
                    milestone for each chapter. That way, you could get paid
                    every time a chapter is finished.
                  </div>

                  <div className="text-base font-light">
                    There&apos;no requirement to break up the project into
                    pieces. You&apos;re always welcome to post one milestone and
                    charge for the whole project at once.
                  </div>

                  <div className="text-base font-light">
                    Use the &quot;Messages&quot; tab to communicate your
                    preferences with the client. Visit the Help Center pages for
                    more info about milestones, (see the yellow icon in the
                    bottom-right corner).
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={toggle}
                      className="rounded-full bg-primary px-8 py-4 text-base font-normal text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200"
                    >
                      I Understand
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

export default NextStepModal;
