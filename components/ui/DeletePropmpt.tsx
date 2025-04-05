/*
 * This is a prompt modal for deleting..
 */
import { VscClose } from "react-icons/vsc";

interface Props {
  show: boolean;
  toggle: () => void;
  onDelete: () => void;
  loading?: boolean;
  text: string;
  cancelButtonText?: string;
}

const DeletePrompt = ({
  show,
  toggle,
  onDelete,
  loading,
  text,
  cancelButtonText = "Go Back",
}: Props) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={toggle}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="rounded-xl bg-white w-full max-w-[570px] max-h-[90vh] py-[2rem] px-[1rem] md:py-12 md:px-[3.20rem] relative">
          <VscClose
            className="absolute top-4 md:top-0 right-4 lg:-right-8 text-2xl text-black  lg:text-white hover:text-gray-200 cursor-pointer"
            onClick={toggle}
          />

          {/* Content */}
          <div className="text-center">
            <h3 className="text-2xl font-normal text-gray-900 leading-9">
              {text}
            </h3>

            {/* Buttons */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={toggle}
                className="rounded-full border border-[#1d1e1b] bg-white px-8 py-[0.85rem] text-lg font-medium text-[#1d1e1b] hover:bg-[#1d1e1b] hover:text-white duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {cancelButtonText}
              </button>
              <button
                onClick={onDelete}
                disabled={loading}
                className=" bg-[#f2b420] px-8 py-[0.85rem] hover:scale-105 duration-300 text-lg rounded-full font-medium text-[#1d1e1b]  focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePrompt;
