import Delete from "../../public/icons/trash.svg";
import Edit from "../../public/icons/edit.svg";
import CheckMark from "../../public/icons/checkmark.svg";

interface IconButtonProps {
  name: "delete" | "edit" | "check";
  background?: string;
  children?: React.ReactNode;
}

export const IconButton = ({ name, background, children }: IconButtonProps) => {
  return (
    <button
      className={`${
        background ? `bg-${background} border-none` : "bg-white border-[#c7c7c7]"
      } rounded-xl w-10 h-10 flex items-center justify-center`}
    >
      {name === "delete" && <Delete />}
      {name === "edit" && <Edit />}
      {name === "check" && <CheckMark stroke="#32B155" />}
      {children}
    </button>
  );
};