import { components } from 'react-select';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div>
        {props?.selectProps?.inputValue
          ? `No result found for '${props?.selectProps?.inputValue}'`
          : 'Search...'}
      </div>
    </components.NoOptionsMessage>
  );
};
