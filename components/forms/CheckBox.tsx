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
        className="w-4 h-4 border border-gray-400 rounded-sm text-blue-600 focus:ring-0"
      />
      {label && (
        <label htmlFor={typeof label === "string" ? label : undefined} className="text-sm text-gray-700">
          {label}
        </label>
      )}
    </div>
  );
}

export default Checkbox;