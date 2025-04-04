"use client";
import { useEffect, useState } from "react";
import "./style.css";
import { BsCheck2 } from "react-icons/bs";
import Cross from "@/public/icons/cross-black.svg";
import classNames from "classnames";

import ChevronUp from "@/public/icons/chevronUp.svg";
import ChevronDown from "@/public/icons/chevronDown.svg";
// Interfaces
interface Option {
  label: string;
  value: string | number;
}

interface SelectProps {
  onChange: any;
  options: Option[];
  title: string;
  selected?: number;
  defaultValue?: Option;
}

function makeid(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const CustomSelect = ({
  onChange = () => null,
  options = [],
  title = "",
  selected = 0,
  defaultValue,
}: SelectProps) => {
  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(
    options[selected] ?? {
      label: "",
      value: "",
    }
  );

  const [elemId] = useState(makeid(10));

  const onClickOption = (option: Option) => {
    setSelectedOption(option);
    onChange(option);
    setShow(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${elemId}`)) {
        setShow(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className={`${elemId} custom-select-container`}>
      <div
        className={classNames(
          "custom-select-title-box px-2 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none position-relative",
          {
            "showing-cross":
              defaultValue && defaultValue.value !== selectedOption.value,
          }
        )}
        onClick={() => setShow(!show)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="mx-2 ">{title}</div>
          <div className="mr-5">{show ? <ChevronUp /> : <ChevronDown />}</div>
          {defaultValue && defaultValue.value !== selectedOption.value && (
            <Cross
              className="cross-icon"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onClickOption(defaultValue);
              }}
            />
          )}
        </div>
      </div>
      {show && (
        <div className="custom-select-options ">
          {options?.map((option) => (
            <div
              className={`custom-select-option ${
                selectedOption.value !== option.value
                  ? "not-selected"
                  : "selected"
              }`}
              key={`${option.label}-${option.value}-${selectedOption.value}`}
              onClick={() => onClickOption(option)}
            >
              {selectedOption.value === option.value && <BsCheck2 />}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
