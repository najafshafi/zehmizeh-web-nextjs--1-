import { MdCancel, MdOutlineCheckCircle } from "react-icons/md";

type Props = {
  isActive?: boolean;
  label: string;
  className?: string;
  onDelete?: () => void;
  onSelect?: () => void;
};

export const Chip = ({
  className,
  isActive,
  label,
  onDelete,
  onSelect,
}: Props) => {
  return (
    <div
      className={` flex items-center px-3 py-[3px] rounded-full border transition-all duration-300 ${
        isActive
          ? "border-[#F2B420] bg-[#FCF0D2]"
          : "border-[#ececec] bg-[#ececec]"
      } ${onSelect ? "cursor-pointer hover:bg-gray-200" : ""} ${
        className ?? ""
      }`}
      onClick={() => onSelect && onSelect()}
    >
      {onSelect && isActive && (
        <MdOutlineCheckCircle className="text-[#F2B420] mr-1" />
      )}
      <span className="text-base font-medium text-gray-800">{label}</span>
      {onDelete && (
        <MdCancel
          className="text-gray-500 ml-2 cursor-pointer hover:text-gray-700"
          onClick={onDelete}
        />
      )}
    </div>
  );
};
