import CustomButton from "@/components/custombutton/CustomButton";

type Props = {
  show: boolean;
  onConfirm: () => void;
  loading: boolean;
};

const SubmitEndJobModal = ({ show, onConfirm, loading }: Props) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="relative bg-white rounded-lg max-w-[540px] w-full mx-4 p-4">
        <div className="p-6">
          <div className="text-2xl font-normal text-center mb-3">
            The freelancer has accepted your request to end the project
          </div>
          <div className="flex flex-row justify-center gap-3 mt-4">
            <CustomButton
              text="Close Project"
              className={`px-8 py-4 text-base font-normal rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={onConfirm}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitEndJobModal;
