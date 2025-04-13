import CustomButton from "@/components/custombutton/CustomButton";
import { useEffect } from "react";

type Props = {
  show: boolean;
  onCloseModal: () => void;
  isLoading: boolean;
  handleClick: (type: "public" | "hidden") => void;
};

export const PostVisibilityModal = ({
  show,
  onCloseModal,
  isLoading,
  handleClick,
}: Props) => {
  // Handle ESC key press to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && show) {
        onCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [show, onCloseModal]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCloseModal}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg  w-full max-w-[767px] mx-4 sm:mx-auto p-6 shadow-xl z-10">
        {/* Close button */}
        {!isLoading && (
          <button
            type="button"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 text-2xl font-semibold"
            onClick={onCloseModal}
          >
            &times;
          </button>
        )}

        {/* Modal body */}
        <div className="text-center">
          <h4 className="text-center text-xl font-medium mb-6">
            Who should see the project?
          </h4>
          <div className="text-lg">
            <p className="mb-2">
              If you&apos;d like to post so all ZMZ freelancers can see it,
              click <b>&quot;Post Publicly.&quot;</b>
            </p>
            <p>
              If you&apos;d like only freelancers you invite to have access,
              click <b>&quot;Post Hidden.&quot;</b>
            </p>
          </div>

          {/* Action buttons */}
          <div
            className="flex  justify-center gap-8 mt-8 sm:flex-row md:gap-8 
                         flex-col max-[640px]:flex-col max-[640px]:gap-5"
          >
            <CustomButton
              text="Post Publicly"
              className="px-[2rem] py-[0.8125rem] transition-transform duration-200 hover:scale-105 text-black rounded-full bg-primary text-base font-normal"
              disabled={isLoading}
              onClick={() => handleClick("public")}
            />

            <CustomButton
              text="Post Hidden"
              className="px-[2rem] py-[0.8125rem] transition-transform duration-200 hover:scale-105 text-black rounded-full bg-primary text-base font-normal"
              disabled={isLoading}
              onClick={() => handleClick("hidden")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
