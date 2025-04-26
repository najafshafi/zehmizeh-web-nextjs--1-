import { ChangeEvent, ReactNode } from "react";

interface Props {
  label?: ReactNode | string;
  className?: string;
  toggle?: (e: ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
}

function Checkbox({ label = "", className = "", toggle, checked }: Props) {
  const id =
    typeof label === "string"
      ? label
      : `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-2 cursor-pointer ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={toggle}
        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
      />
      <span>{label}</span>
    </label>
  );
}

export default Checkbox;
