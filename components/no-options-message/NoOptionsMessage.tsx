import { components, NoticeProps } from "react-select";

type NoOptionsMessageProps = NoticeProps<unknown, boolean>;

export const NoOptionsMessage = (props: NoOptionsMessageProps) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div className="text-gray-500 text-sm">
        {props.selectProps.inputValue
          ? `No results found for "${props.selectProps.inputValue}"`
          : "Search..."}
      </div>
    </components.NoOptionsMessage>
  );
};