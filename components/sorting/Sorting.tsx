import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

interface SortOption {
  key: string;
  label: string;
}

interface Props {
  sortTypes: SortOption[];
  sorting: string;
  setSorting: (value: string) => void;
}

const Sorting: React.FC<Props> = ({ sortTypes, sorting, setSorting }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedSort = sortTypes.find((type) => type.key === sorting) || sortTypes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-white cursor-pointer shadow-sm w-48"
      >
        <span className="text-sm font-medium">Sort By: {selectedSort.label}</span>
        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {sortTypes.map((item) => (
            <div
              key={item.key}
              onClick={() => {
                setSorting(item.key);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sorting;