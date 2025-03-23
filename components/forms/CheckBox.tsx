import { ChangeEvent, ReactNode } from "react";

interface Props {
  label?: ReactNode | string;
  className?: string;
  toggle?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

const Checkbox = ({ label = "", className = "", toggle, checked }: Props) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        id={typeof label === "string" ? label : undefined}
        checked={checked}
        onChange={toggle}
        className="w-5 h-5 rounded-lg border border-[#f2b420] accent-[#f2b420] text-white bg-white focus:ring-4 focus:ring-[#9ecffa4d]"
      />
      {label && (
        <label
          htmlFor={typeof label === "string" ? label : undefined}
          className="text-sm text-gray-700"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
