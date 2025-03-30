interface Props {
  label?: string;
  className?: string;
  toggle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  value?: string;
}

const Radio = ({
  label = "",
  className = "",
  toggle,
  checked,
  value,
}: Props) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="radio"
        id={value}
        checked={checked}
        onChange={toggle}
        value={value}
        className="h-6 w-6 bg-primary border-gray-300   "
      />
      {label && (
        <label htmlFor={value} className="ml-2 text-gray-700 text-sm">
          {label}
        </label>
      )}
    </div>
  );
};

export default Radio;
