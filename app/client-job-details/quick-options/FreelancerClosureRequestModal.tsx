import { VscClose } from "react-icons/vsc";
import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const FreelancerClosureRequestModal = ({
  show,
  toggle,
  onConfirm,
  loading,
}: Props) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={toggle}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[570px] transform rounded-2xl bg-white px-6 py-8 text-left align-middle shadow-xl transition-all">
            <button
              onClick={toggle}
              className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 focus:outline-none"
            >
              <VscClose className="h-6 w-6" />
            </button>

            <div className="text-xl font-normal text-center mb-3">
              Before ending the project, the freelancer will be given the
              opportunity to submit any remaining unposted hours. If they have
              no more hours to post, they will accept your closure request.
            </div>

            <div className="flex flex-col md:flex-row justify-center mt-4 gap-2">
              <CustomButton
                text="Send Closure Request"
                className="px-[2rem] py-[1rem]  transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px] border border-primary"
                onClick={onConfirm}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerClosureRequestModal;
