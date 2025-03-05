interface Props {
    label?: string;
    className?: string;
    toggle?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    checked?: boolean;
    value?: string;
  }
  
  const Radio = ({ label = "", className = "", toggle, checked, value }: Props) => {
    return (
      <div className={`flex items-center ${className}`}>
        <input
          type="radio"
          id={value}
          checked={checked}
          onChange={toggle}
          value={value}
          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
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