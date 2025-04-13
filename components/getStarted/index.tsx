"use client";

import useOnClickOutside from "@/helpers/hooks/useClickOutside";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";
import useResponsive from "@/helpers/hooks/useResponsive";
import { CSSTransition } from "react-transition-group";
import { IoMdClose } from "react-icons/io";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { FREELANCER_PROFILE_TABS } from "@/helpers/const/tabs";
import CustomButton from "../custombutton/CustomButton";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type Props = {
  user: IFreelancerDetails;
  isLoading: boolean;
};

export const GetStarted = ({ user, isLoading }: Props) => {
  const { isMobile } = useResponsive();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowingCompleteModal, setIsShowingCompleteModal] = useState(0);
  const outsideClickRef = useRef(null);
  const modalAnimationRef = useRef(null);

  useOnClickOutside(outsideClickRef, () => {
    setIsModalOpen(false);
  });

  // Mandatory items user has to fill open to popup modal
  const requiredData = useMemo(() => {
    return [
      {
        label: "Add Headline",
        isCompleted: !!user?.job_title,
        link: `/freelancer/account/${FREELANCER_PROFILE_TABS.PROFILE}?openModal=headline`,
      },
      {
        label: "Add About Me",
        isCompleted: !!user?.about_me,
        link: `/freelancer/account/${FREELANCER_PROFILE_TABS.PROFILE}?openModal=about_me`,
      },
      {
        label: "Add Skills",
        isCompleted: user?.skills && user?.skills?.length > 0,
        link: `/freelancer/account/${FREELANCER_PROFILE_TABS.PROFILE}?openModal=skills`,
      },
      {
        label: "Get Stripe account verified",
        isCompleted: user?.stp_account_status === "verified",
        link: `/freelancer/account/${FREELANCER_PROFILE_TABS.PAYMENT_DETAILS}`,
      },
    ];
  }, [user]);

  // How much percent user completed required items
  const percentCompleted = useMemo(() => {
    const totalCompleted = requiredData.filter(
      (item) => item.isCompleted
    ).length;
    return (totalCompleted / requiredData.length) * 100;
  }, [requiredData]);

  // Determines finish profile popup should show or not
  useEffect(() => {
    // percent of single item out of total
    const singleItemPercent = 100 / requiredData.length;

    // checking last item in list is pending or not
    // if last item pending then increasing number to 1
    if (100 - singleItemPercent === percentCompleted)
      setIsShowingCompleteModal(1);

    // 1. all items completed
    // 2. used to determine user finished required items and didn't come from login page.
    if (percentCompleted === 100 && isShowingCompleteModal === 1) {
      setIsShowingCompleteModal(2);
    }
  }, [isShowingCompleteModal, percentCompleted, requiredData.length]);

  // 1. checking with 2 because on (1) user almost completed all items and (2) user completed all items
  // 2. checking user account is under review
  if (
    isShowingCompleteModal === 2 &&
    (user?.is_account_approved === null ||
      typeof user?.is_account_approved === "undefined")
  ) {
    return (
      <Transition appear show={true} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsShowingCompleteModal(0)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h4"
                    className="text-xl font-bold text-center"
                  >
                    Your Profile is Filled Out!
                  </Dialog.Title>
                  <p className="mt-3 text-center text-gray-600">
                    Well done - you have fulfilled the required sections of your
                    profile! A ZMZ staff member will check your account for
                    approval shortly!
                  </p>

                  <div className="mt-6 flex justify-center">
                    <CustomButton
                      text="Close"
                      className="px-10 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200"
                      onClick={() => setIsShowingCompleteModal(0)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  if (
    isLoading ||
    percentCompleted === 100 ||
    !("about_me" in user) ||
    !("job_title" in user)
  ) {
    return <></>;
  }

  return (
    <div ref={outsideClickRef} className="fixed bottom-4 right-4 z-50">
      <div
        onClick={() => setIsModalOpen((prev) => !prev)}
        className="cursor-pointer"
      >
        {isModalOpen ? (
          <div className="bg-amber-500 text-white p-3 rounded-full hover:bg-amber-600 transition-colors duration-200">
            <IoMdClose size={22} />
          </div>
        ) : (
          <div className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-600 transition-colors duration-200">
            <span className="bg-white text-amber-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {requiredData.filter((item) => !item.isCompleted).length}
            </span>
            <FaRocket />
            <span>Profile {percentCompleted}% Complete!</span>
          </div>
        )}
      </div>
      <CSSTransition
        in={isModalOpen}
        nodeRef={modalAnimationRef}
        timeout={1000}
        classNames="get-started-modal-transition"
        unmountOnExit
      >
        <div
          ref={modalAnimationRef}
          className={`absolute bottom-full right-0 mb-4 bg-white rounded-lg shadow-lg p-4 min-w-[300px] ${
            isMobile ? "w-full" : ""
          }`}
        >
          <span className="font-bold text-lg">
            Profile {percentCompleted}% Complete!
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${percentCompleted}%` }}
              role="progressbar"
              aria-valuenow={percentCompleted}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {percentCompleted}%
            </div>
          </div>
          <ul className="space-y-2 my-2">
            {requiredData.map(({ isCompleted, label, link }) => (
              <li
                key={label}
                className={`flex items-center py-1 ${
                  isCompleted ? "text-gray-500" : "text-gray-900"
                }`}
              >
                {isCompleted ? (
                  <RiCheckboxCircleFill className="text-amber-500 mr-2" />
                ) : (
                  <RiCheckboxBlankCircleLine className="text-gray-400 mr-2" />
                )}
                <Link
                  href={link}
                  className="hover:text-amber-500 transition-colors duration-200"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </CSSTransition>
    </div>
  );
};
