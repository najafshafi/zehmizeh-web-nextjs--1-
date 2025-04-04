import useOnClickOutside from "@/helpers/hooks/useClickOutside";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RiCheckboxCircleFill } from "react-icons/ri";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";
import useResponsive from "@/helpers/hooks/useResponsive";
import { CSSTransition } from "react-transition-group";
import { GetStartedWrapper } from "./style";
import { IoMdClose } from "react-icons/io";
import { StyledModal } from "@/components/styled/StyledModal";
import { Modal } from "react-bootstrap";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { FREELANCER_PROFILE_TABS } from "@/helpers/const/tabs";
import CustomButton from "../custombutton/CustomButton";

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
      <StyledModal maxwidth={767} show size="sm" centered>
        <Modal.Body className="flex flex-col justify-center items-center text-center">
          <h4>Your Profile is Filled Out!</h4>
          <span className="mt-3">
            Well done - you have fulfilled the required sections of your
            profile! A ZMZ staff member will check your account for approval
            shortly!
          </span>

          <CustomButton
            text="Close"
            className="my-[10px] mx-[4px] py-[1.125rem] px-[2.5rem] bg-primary text-white rounded-md hover:scale-105 transition-all duration-300 mt-4"
            onClick={() => setIsShowingCompleteModal(0)}
          />
        </Modal.Body>
      </StyledModal>
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
    <GetStartedWrapper ref={outsideClickRef}>
      <div onClick={() => setIsModalOpen((prev) => !prev)}>
        {isModalOpen ? (
          <div className="cross">
            <IoMdClose size={22} />
          </div>
        ) : (
          <div className="get-started">
            <span className="pending-count">
              {requiredData.filter((item) => !item.isCompleted).length}
            </span>
            <FaRocket /> <span>Profile {percentCompleted}% Complete!</span>
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
          className={`get-started-modal shadow ${isMobile ? "full-width" : ""}`}
        >
          <span className="fw-bold">Profile {percentCompleted}% Complete!</span>
          <div className="progress my-2">
            <div
              className="progress-bar bg-warning"
              role="progressbar"
              style={{ width: `${percentCompleted}%` }}
              aria-valuenow={percentCompleted}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {percentCompleted}%
            </div>
          </div>
          <ul className="my-2">
            {requiredData.map(({ isCompleted, label, link }) => {
              return (
                <li
                  key={label}
                  className={`flex items-center py-1 ${
                    isCompleted ? "completed" : "text-decoration-none"
                  }`}
                >
                  {isCompleted ? (
                    <RiCheckboxCircleFill />
                  ) : (
                    <RiCheckboxBlankCircleLine />
                  )}
                  <Link
                    href={link}
                    className="mx-2"
                    onClick={() => {
                      setIsModalOpen(false);
                    }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </CSSTransition>
    </GetStartedWrapper>
  );
};
