"use client";

import { useEffect, useState, useCallback } from "react";
import { BsCheck2 } from "react-icons/bs";
import CrossIcon from "../../public/icons/cross-black.svg";
import classNames from "classnames";
import PropTypes from "prop-types";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  onChange: (option: Option) => void;
  options: Option[];
  title: string;
  selected?: number;
  defaultValue?: Option;
}

const generateId = (length: number): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
};

const CustomSelect: React.FC<SelectProps> = ({
  onChange,
  options = [],
  title = "",
  selected = 0,
  defaultValue,
}) => {
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(
    options[selected] ?? { label: "", value: "" }
  );
  const [elemId] = useState(generateId(10));

  const onClickOption = useCallback(
    (option: Option) => {
      setSelectedOption(option);
      onChange(option);
      setShow(false);
    },
    [onChange]
  );

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${elemId}`)) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [elemId]);

  return (
    <div className={`${elemId} relative cursor-pointer`}>
      <div
        className={classNames(
          "flex items-center w-full p-3 border rounded-md",
          {
            "bg-gray-100":
              defaultValue && defaultValue.value !== selectedOption.value,
          }
        )}
        onClick={() => setShow(!show)}
      >
        <div className="flex-1">{title}</div>
        {defaultValue && defaultValue.value !== selectedOption.value && (
          <CrossIcon
            className="w-5 h-5 cursor-pointer"
            onClick={(e: React.MouseEvent<SVGSVGElement>) => {
              e.stopPropagation();
              onClickOption(defaultValue);
            }}
          />
        )}
      </div>

      {show && (
        <div className="absolute w-full mt-2 bg-white shadow-lg z-10 border border-gray-200 rounded-md">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedOption.value === option.value ? "bg-gray-200" : ""
              }`}
              onClick={() => onClickOption(option)}
            >
              {selectedOption.value === option.value && (
                <BsCheck2 className="mr-2" />
              )}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  title: PropTypes.string.isRequired,
  selected: PropTypes.number,
  defaultValue: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }),
};

export default CustomSelect;
