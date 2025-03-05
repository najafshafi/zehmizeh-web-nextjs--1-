import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { IconType } from "react-icons/lib";
import { useMediaQuery } from "react-responsive";

type Step = {
  number?: number;
  label: string;
  icon?: IconType;
};

type Props = {
  steps: Step[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
};

export const Stepper: React.FC<Props> = ({ steps, activeStep, setActiveStep }) => {
  const isSmallMobile = useMediaQuery({ minWidth: 450 });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(((activeStep - 1) / (steps.length - 1)) * 100);
  }, [activeStep, steps.length]);

  return (
    <div className="relative w-full flex justify-between mb-12">
      <div
        className="absolute left-0 top-[16px] z-10 w-full h-[4px] transition-all duration-[400ms] bg-[#ECECEC]"
      />
      <div
        className="absolute left-0 top-[16px] z-10 h-[4px] transition-all duration-[400ms] bg-[#F2B420]"
        style={{ width: `${width}%` }}
      />

      {steps.map((step, index) => {
        const stepNumber = step.number ?? index;
        const isActive = stepNumber <= activeStep;
        const Icon = step.icon;

        return (
          <div
            key={stepNumber}
            className="group relative flex flex-col items-center cursor-pointer z-20"
            onClick={() => setActiveStep(stepNumber)}
          >
            <div
              className={classNames(
                "flex items-center justify-center w-10 h-10 rounded-full bg-white border-[3px] transition-all duration-[400ms]"
              )}
              style={{
                borderColor: isActive ? "#F2B420" : "#ECECEC",
              }}
            >
              {Icon ? (
                <Icon color={isActive ? "#F2B420" : "#000000"} />
              ) : (
                stepNumber
              )}
            </div>
            {isSmallMobile ? (
              <span className="font-bold absolute top-[44px] left-[-40px] w-[300%]">
                {step.label}
              </span>
            ) : (
              <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 text-white text-xs px-2 py-1 rounded">
                {step.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};