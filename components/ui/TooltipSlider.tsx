import * as React from "react";
import "rc-tooltip/assets/bootstrap.css";
import Slider from "rc-slider";
import type { SliderProps } from "rc-slider";
import raf from "rc-util/lib/raf";
import Tooltip from "rc-tooltip";

// Import TooltipRef type
import type { TooltipRef } from "rc-tooltip/lib/Tooltip";

// Define TipProps interface
interface TipProps {
  parentId?: string;
  // Use a more specific type for additional props
  [key: string]: string | number | boolean | undefined;
}

const HandleTooltip = (props: {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  tipFormatter?: (value: number) => React.ReactNode;
  parentId?: string;
}) => {
  const {
    value,
    children,
    visible,
    tipFormatter = (val) => `${val} %`,
    parentId,
    ...restProps
  } = props;

  const tooltipRef = React.useRef<TooltipRef>(null);
  const rafRef = React.useRef<number | null>(null);

  function cancelKeepAlign() {
    raf.cancel(rafRef.current!);
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      tooltipRef.current?.forceAlign();
    });
  }

  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      placement="top"
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: "auto" }}
      ref={tooltipRef}
      visible={visible}
      {...restProps}
      getTooltipContainer={() => {
        const element = parentId
          ? document.getElementById(parentId)
          : document.getElementsByTagName("body")[0];
        return element || document.body;
      }}
    >
      {children}
    </Tooltip>
  );
};

export const handleRender: SliderProps["handleRender"] = (node, props) => {
  return (
    <HandleTooltip value={props.value} visible={props.dragging}>
      {node}
    </HandleTooltip>
  );
};

const TooltipSlider = ({
  tipFormatter,
  tipProps,
  ...props
}: SliderProps & {
  tipFormatter?: (value: number) => React.ReactNode;
  tipProps: TipProps;
}) => {
  const tipHandleRender: SliderProps["handleRender"] = (node, handleProps) => {
    return tipProps?.parentId ? (
      <div id={tipProps.parentId}>
        <HandleTooltip
          value={handleProps.value}
          // visible={handleProps.dragging}
          visible={true}
          tipFormatter={tipFormatter}
          {...tipProps}
        >
          {node}
        </HandleTooltip>
      </div>
    ) : (
      <HandleTooltip
        value={handleProps.value}
        // visible={handleProps.dragging}
        visible={true}
        tipFormatter={tipFormatter}
        {...tipProps}
      >
        {node}
      </HandleTooltip>
    );
  };

  return <Slider {...props} handleRender={tipHandleRender} />;
};

export default TooltipSlider;
