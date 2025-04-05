import CustomButton from "@/components/custombutton/CustomButton";
import useResponsive from "@/helpers/hooks/useResponsive";

type Props = {
  show: boolean;
  loading: boolean;
  onConfirm: (selectedOption: "not_yet" | "decline_closure" | "accept") => void;
};

export const JobClosuremodalProjectBased = ({
  show,
  loading,
  onConfirm,
}: Props) => {
  const { isMobile } = useResponsive();

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative z-50 mx-4 my-6 max-w-[800px] md:min-h-[719px] h-fit  w-full rounded-lg bg-white shadow-lg md:p-5">
        <div className="p-6 md:p-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-3">
              The Client Requests to Close the Project
            </h2>
            <p className="mt-2 text-lg font-normal text-start">
              Your client is requesting that this project be closed. Since you
              have not been paid for any milestones, you can decline this
              request if you wish.
            </p>
            <p className="mt-3  md:mt-5 text-lg font-normal text-start">
              Any project that is closed before the freelancer has been paid is
              automatically marked as <b>Incomplete</b>. Having been part of
              this project therefore does not contribute to your record on ZMZ.
              You and your client will both be unable to leave ratings or
              feedback.
            </p>
            <p className="mt-3  md:mt-5 text-lg font-normal text-start">
              If no decision is made, the project will be closed automatically 3
              weeks after the client&apos;s closure request.
            </p>
            <ul>
              <li className="mt-3 md:mt-5  ml-5 text-lg font-normal text-start">
                ● To keep the project open, click <b>Decline Closure Request</b>{" "}
                below.
              </li>
              <li className="mt-2 ml-5 text-lg font-normal text-start">
                ● To close the project, press <b>Accept & Close</b> below. This
                cannot be undone.
              </li>
            </ul>
            <div className="flex flex-col justify-center items-center gap-2 md:gap-3 mt-5 md:mt-10">
              <CustomButton
                text={"Not Yet"}
                className={`px-8 py-4 border-2 border-black transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full hover:text-white hover:bg-black text-lg
                  ${isMobile ? "w-full" : "w-1/2"}
                `}
                onClick={() => onConfirm("not_yet")}
                disabled={loading}
              />

              <CustomButton
                text={"Decline Closure Request"}
                className={`px-8 py-4 border-2 border-black transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full hover:text-white hover:bg-black text-lg
                  ${isMobile ? "w-full" : "w-1/2"}
                `}
                onClick={() => onConfirm("decline_closure")}
                disabled={loading}
              />

              <CustomButton
                text={"Accept & Close"}
                className={`px-8 py-4 border-2 border-black transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full hover:text-white hover:bg-black text-lg
                  ${isMobile ? "w-full" : "w-1/2"}
                `}
                onClick={() => onConfirm("accept")}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
