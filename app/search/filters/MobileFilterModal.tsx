import Filters from "./Filters";

// This is a modal for displaying filters in mobile view

type Props = {
  isSkillAndCategoryModalOpen?: boolean;
  onClose: () => void;
  show: boolean;
};

const MobileFilterModal = ({
  show,
  onClose,
  isSkillAndCategoryModalOpen,
}: Props) => {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto ${isSkillAndCategoryModalOpen ? "hidden" : ""}`}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-start justify-center p-4">
        <div className="relative bg-white rounded-xl max-w-[678px] w-full max-h-[90vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-0 md:-right-8 md:text-white text-black hover:text-opacity-70  p-0  text-[1.75rem] font-thin border-none transform translate-x-[30px] -translate-y-[10px] hover:border-none focus:border-none active:border-none visited:border-none md:translate-x-0 md:translate-y-0"
          >
            &times;
          </button>

          {/* Modal Content */}
          <div className="p-12">
            <Filters showApplyBtn onApply={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterModal;
