import CustomButton from "@/components/custombutton/CustomButton";
import React from "react";

interface Props {
  show: boolean;
  onClose: () => void;
}

const helpCenter = () =>
  window.open("https://intercom.help/zehmizehfaq/en", "_blank");

const NewPaymentInfoModal = ({ onClose, show }: Props) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl w-full max-w-[580px] mx-4 p-12 sm:mx-0">
        {/* Close button */}
        <button
          className="absolute right-4 top-0 md:-right-8 md:top-0 text-2xl md:text-white text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="content">
          <h3 className="text-4xl font-bold text-center mb-4">
            You're Ready to Go!
          </h3>
          <ul>
            <li className="mt-3 list-none">
              Now that you've added payment details, you're ready to post
              projects. Click the yellow "Post Project" button in the top-right
              to make a new post!
            </li>
            <li className="mt-3 list-none">
              For more information on how to use ZMZ, see our{" "}
              <span
                onClick={helpCenter}
                className="text-[#f2b420] underline cursor-pointer"
              >
                FAQs.
              </span>
            </li>
          </ul>

          <div className="flex justify-center mt-4">
            <CustomButton
              text="Close"
              className="bg-primary text-center rounded-full min-h-[56px] px-9 py-4.5 text-lg"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPaymentInfoModal;
