import { useRef } from "react";
import Tooltip from "rc-tooltip";
import Info from "../../public/icons/info-circle-gray.svg";
import "rc-tooltip/assets/bootstrap.css";

// Define styles as objects for reuse
const tooltipContentStyle = {
  boxShadow: "0px 4px 22px rgba(0, 0, 0, 0.25)",
  background: "#1D1E1B",
  padding: "0.5rem",
  textAlign: "left" as const,
  maxWidth: "250px",
  fontSize: "0.875rem",
  fontFamily: "Helvetica, sans-serif",
};

// Custom CSS classes for tooltip styling
const tooltipStyles = {
  tooltip: {
    ".rc-tooltip-inner": {
      boxShadow: "0px 4px 22px rgba(0, 0, 0, 0.25)",
      background: "#1D1E1B",
      padding: "1rem",
      textAlign: "left" as const,
    },
    ".rc-tooltip-title": {
      padding: "0px !important",
    },
  },
};

function UITooltip({
  title,
  customTrigger,
  className,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
  customTrigger?: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <Tooltip
        placement="top"
        overlay={<div style={tooltipContentStyle}>{children}</div>}
        arrowContent={<div className="rc-tooltip-arrow-inner"></div>}
        destroyTooltipOnHide={true}
        overlayInnerStyle={tooltipStyles.tooltip[".rc-tooltip-inner"]}
      >
        <span className="cursor-pointer inline-block">
          {customTrigger ? (
            customTrigger
          ) : (
            <span className="flex items-center">
              {title || ""} <Info />
            </span>
          )}
        </span>
      </Tooltip>
    </div>
  );
}

export default UITooltip;
