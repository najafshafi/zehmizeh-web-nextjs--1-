import { MdCancel, MdOutlineCheckCircle } from "react-icons/md";

type Props = {
  isActive?: boolean;
  label: string;
  className?: string;
  onDelete?: () => void;
  onSelect?: () => void;
};

export const Chip = ({ className, isActive, label, onDelete, onSelect }: Props) => {
  return (
    <div
      className={`flex items-center px-3 py-1 rounded-full border transition-all duration-300 ${
        isActive ? "border-[#F2B420] bg-[#FCF0D2]" : "border-gray-300 bg-gray-100"
      } ${onSelect ? "cursor-pointer hover:bg-gray-200" : ""} ${className ?? ""}`}
      onClick={() => onSelect && onSelect()}
    >
      {onSelect && isActive && <MdOutlineCheckCircle className="text-[#F2B420] mr-1" />}
      <span className="text-sm font-medium text-gray-800">{label}</span>
      {onDelete && (
        <MdCancel className="text-gray-500 ml-2 cursor-pointer hover:text-gray-700" onClick={onDelete} />
      )}
    </div>
  );
};