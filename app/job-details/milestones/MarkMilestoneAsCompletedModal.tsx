import CustomButton from "@/components/custombutton/CustomButton";
import { StyledButton } from "@/components/forms/Buttons";
import { breakpoints } from "@/helpers/hooks/useResponsive";

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
    <>
      {stateData.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto  bg-black bg-opacity-50">
          <div className="relative mx-auto max-w-[900px] rounded-md bg-white shadow-lg p-8">
            <button
              className="absolute -right-8 -top-4 text-3xl font-light text-white "
              onClick={toggle}
            >
              &times;
            </button>

            <div className="flex flex-col gap-0 md:gap-3">
              <div className="text-center text-xl md:font-medium md:text-2xl py-2">
                You're Changing Milestone Status to 'Complete'
              </div>

              <p className="text-[1.2rem] my-2 px-3">
                By marking a milestone as complete, you're indicating to the
                client that all of the required uploads have been submitted.
                They'll be notified that you're ready to have your payment
                delivered.
              </p>

              <div className="flex flex-col justify-center gap-3 md:flex-row">
                <CustomButton
                  text="It's Not Ready - Cancel"
                  className="px-8 py-4 text-base font-normal border-2 border-gray-800 text-gray-800 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-black hover:text-white"
                  onClick={toggle}
                />

                <CustomButton
                  text={
                    <span className="inline-flex items-center">
                      {stateData.loading && (
                        <span className="mr-2">
                          <div className="h-4 w-4 animate-pulse rounded-full bg-white"></div>
                        </span>
                      )}
                      Everything is Submitted - Mark as 'Complete'
                    </span>
                  }
                  className={`px-8 py-4 text-base font-normal rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105 ${
                    stateData.loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={onConfirm}
                  disabled={stateData.loading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarkMilestoneAsCompleted;
