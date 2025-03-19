/*
 * This component is a modal for delete proposal *
 */
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteProposal } from '@/helpers/http/proposals';
import { useRouter } from 'next/navigation'; // Replaced useNavigate
import Spinner from "@/components/forms/Spin/Spinner";

// Type definitions
interface DeleteProposalModalProps {
  show: boolean;
  toggle: () => void;
  proposal_id: number;
}

const DeleteProposalModal = ({ show, toggle, proposal_id }: DeleteProposalModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); // Replaced useNavigate

  const onCloseModal = () => toggle();

  const deleteProposalHandler = async () => {
    if (!proposal_id) return;

    setLoading(true);

    const promise = deleteProposal({ proposal_id });
    toast.promise(promise, {
      loading: 'Deleting proposal...',
      error: (error) => {
        setLoading(false);
        return error?.response?.data?.message ?? error?.message;
      },
      success: (resp) => {
        setLoading(false);
        router.back(); // Replaced navigate(-1)
        return resp.message ?? 'Proposal deleted successfully';
      },
    });
  };

  if (!show) return null; // Early return if modal isn't shown

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-[718px] bg-white rounded-lg shadow-lg p-6">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800"
          onClick={onCloseModal}
        >
          ×
        </button>

        {/* Modal Content */}
        <div className="text-center">
          <p className="text-lg mb-0">
            Are you sure you would like to delete this proposal?
          </p>
          <p className="text-lg mt-1 font-bold">
            You will not be able to send a new proposal for this project.
          </p>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
              onClick={deleteProposalHandler}
            >
              {loading && <Spinner className="w-4 h-4" />}
              Yes - Delete
            </button>
            <button
              className="px-4 py-2 border border-gray-800 rounded hover:bg-gray-100"
              onClick={toggle}
            >
              No - Keep Proposal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProposalModal;