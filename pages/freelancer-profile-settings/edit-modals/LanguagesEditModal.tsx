/*
 * This component is a modal to edit languages
 */

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Modal, Button } from "react-bootstrap";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import { EditFormWrapper } from "./edit-modals.styled";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { editUser } from "@/helpers/http/auth";
import { getLanguages } from "@/helpers/http/common";
import { MultiSelectCustomStyle } from "./multiSelectCustomStyle";

type Props = {
  show: boolean;
  onClose: () => void;
  languagesProps?: any;
  onUpdate: () => void;
};

const multiSelectProps = {
  closeMenuOnSelect: true,
  isMulti: true,
  styles: MultiSelectCustomStyle,
};

const LanguagesEditModal = ({
  show,
  onClose,
  languagesProps,
  onUpdate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [languages, setLanguages] = useState<any>(languagesProps);

  const handleUpdate = () => {
    // Update languages api call

    setLoading(true);
    const body = {
      languages,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating your details - please wait...",
      success: (res) => {
        onUpdate();
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const languageOptions = (inputValue: string) => {
    // This will be called when user types and will call languages api with the keyword

    const languagesLocal: { label: any; value: any }[] = [];
    return getLanguages(inputValue || "").then((res) => {
      res.data.forEach(function (item: any) {
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
      return languages?.map((item: any) => {
        return { label: item.name, value: item.id };
      });
    }
  }, [languages]);

  const onSelect = (selected: any) => {
    const data = selected.map((item: any) => {
      return { id: item.value, name: item.label };
    });
    setLanguages(data);
  };

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <EditFormWrapper>
          <div className="content flex flex-column">
            <div className="modal-title fs-28 font-normal">My Languages</div>
            <div className="form-group">
              <div className="flex items-center mb-2">
                Select all of the languages you can work in.
              </div>
              <AsyncSelect
                {...multiSelectProps}
                placeholder="Enter your languages"
                components={{ NoOptionsMessage }}
                loadOptions={languageOptions}
                onChange={(options) => onSelect(options)}
                value={getDefaultlanguageOptions}
                defaultOptions={true}
              />
            </div>
            <div className="bottom-buttons flex">
              <StyledButton
                padding="1.125rem 2.25rem"
                variant="primary"
                disabled={loading}
                onClick={handleUpdate}
              >
                Update
              </StyledButton>
            </div>
          </div>
        </EditFormWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default LanguagesEditModal;

const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div>
        {props?.selectProps?.inputValue
          ? `No result found for '${props?.selectProps?.inputValue}'`
          : "Search..."}
      </div>
    </components.NoOptionsMessage>
  );
};
