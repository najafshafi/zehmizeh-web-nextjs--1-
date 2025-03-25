import { useState, useRef, useEffect } from "react";
import MoreIcon from "@/public/icons/more.svg";

type Props = {
  onDelete: () => void;
  handleEdit: () => void;
  isEditEnabled?: boolean;
};

const MoreButton = ({ onDelete, handleEdit, isEditEnabled = true }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-center items-center cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MoreIcon />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {isEditEnabled ? (
            <>
              <button
                onClick={() => {
                  handleEdit();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-base text-primary hover:bg-gray-100 transition-colors"
              >
                Edit Proposal
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-base text-red-600 hover:bg-gray-100 transition-colors"
              >
                Cancel Proposal
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-base text-red-600 hover:bg-gray-100 transition-colors"
            >
              Cancel Milestone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MoreButton;
