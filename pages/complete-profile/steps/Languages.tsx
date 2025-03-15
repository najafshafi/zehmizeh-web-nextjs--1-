"use client"
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { components } from 'react-select';
import AsyncSelect from 'react-select/async';
import { FormWrapper } from './steps.styled';
import { StyledButton } from '@/components/forms/Buttons';
import { getLanguages } from '@/helpers/http/common';
import { MultiSelectCustomStyle } from './multiSelectCustomStyle';
import { IClientDetails } from '@/helpers/types/client.type';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';

type TData = Partial<IClientDetails & IFreelancerDetails>;

type Props = {
  languagesProps?: TData['languages'];
  onUpdate: (data: TData) => void;
  onPrevious: () => void;
  skipForNow: () => void;
};

const multiSelectProps = {
  closeMenuOnSelect: true,
  isMulti: true,
  styles: MultiSelectCustomStyle,
};

const Languages = ({
  languagesProps,
  onUpdate,
  onPrevious,
  skipForNow,
}: Props) => {
  const [languages, setLanguages] = useState(languagesProps);

  const handleUpdate = () => {
    // Validations and parent function call to store the data in parent
    if (!languages || languages?.length == 0) {
      toast.error('Please add at least one language.');
    } else {
      onUpdate({ languages });
    }
  };

  const languageOptions = (inputValue: string) => {
    // This will be called when user types and will call languages api with the keyword

    const languagesLocal: { label: string; value: string }[] = [];
    return getLanguages(inputValue || '').then((res) => {
      res.data.forEach(function (item) {
        const obj = {
          label: item.language_name,
          value: item.language_id,
        };
        languagesLocal.push(obj);
      });
      return languagesLocal;
    });
  };

  const getDefaultlanguageOptions = useMemo(() => {
    // This will format all the availbale languages to the format that the react async requires

    if (languages?.length > 0) {
      return languages?.map((item) => {
        return { label: item.name, value: item.id };
      });
    }
  }, [languages]);

  const onSelect = (selected) => {
    const data = selected.map((item) => {
      return { id: item.value, name: item.label };
    });
    setLanguages(data);
  };

  return (
    <FormWrapper className="d-flex flex-column">
      <div>
        <div className="form-group">
          <div>
            <b className="fs-18">
              Languages
              <span className="mandatory">&nbsp;*</span>
            </b>
            <p className="fs-base mt-2 mb-0 text-justify text-secondary">
              Select any languages that you can work in below.
            </p>
          </div>
          <AsyncSelect
            {...multiSelectProps}
            placeholder="Enter your languages"
            components={{ NoOptionsMessage }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            loadOptions={languageOptions as any}
            onChange={(options) => onSelect(options)}
            value={getDefaultlanguageOptions}
            defaultOptions={true}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center justify-content-md-end gap-3">
        <StyledButton variant="outline-dark" onClick={onPrevious}>
          Previous
        </StyledButton>
        <StyledButton variant="dark" onClick={skipForNow}>
          Skip
        </StyledButton>
        <StyledButton onClick={handleUpdate}>Next</StyledButton>
      </div>
    </FormWrapper>
  );
};

export default Languages;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NoOptionsMessage = (props: any) => {
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
