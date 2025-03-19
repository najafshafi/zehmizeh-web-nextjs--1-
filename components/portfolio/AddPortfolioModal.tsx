import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as useFormPg from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal, Button, Form } from "react-bootstrap";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { addEditPortfolio } from "@/helpers/http/portfolio";
import ErrorMessage from "@/components/ui/ErrorMessage";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import FileUploadToAws from "./FileUploadToAws";
import styled from "styled-components";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import { MultiSelectCustomStyle } from "@/pages/freelancer-profile-settings/edit-modals/multiSelectCustomStyle";
import { getSkills } from "@/helpers/http/common";
import { CONSTANTS } from "@/helpers/const/constants";
import { portfolioValidation } from "@/helpers/validation/portfolioValidation";

type AttachmentProps = { fileUrl?: string; fileName?: string };

export const Wrapper = styled(Form)`
  .styled-form {
    margin-top: 1.25rem;
    .form-input {
      margin-top: 6px;
      padding: 1rem 1.25rem;
      border-radius: 7px;
      border: 1px solid ${(props) => props.theme.colors.gray6};
    }
  }
  .gray-labels {
    color: ${(props) => props.theme.colors.blue};
  }
  .max-count {
    color: ${(props) => props.theme.colors.gray8};
  }
`;

type Props = {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  portfolio?: any;
};

const AddPortfolioModal = ({ show, onClose, onUpdate, portfolio }: Props) => {
  const [attachments, setAttachments] = useState<AttachmentProps[]>([]);

  const jsonData = portfolio?.project_skills;
  const parsedSkills = jsonData?.startsWith("[") && JSON.parse(jsonData);

  const [skills, setSkills] = useState<any[]>(parsedSkills);

  const formInitials = {
    project_name: portfolio?.project_name ?? "",
    project_year: portfolio?.project_year ?? "",
    project_skills: skills ?? "",
    project_description: portfolio?.project_description ?? "",
  };

  const getDefaultSkillOptions = useMemo(() => {
    if (skills?.length > 0) {
      return skills?.map((item: any) => {
        return { label: item.name, value: item.id };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSkills]);

  const { useForm }: any = useFormPg;
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: formInitials,
    resolver: yupResolver(portfolioValidation),
  });

  const onSubmit = (data: any) => {
    if (attachments?.length === 0) {
      toast.error("Please upload at least one attachment.");
      return;
    }

    const attachmentUrls = attachments?.map((attachment: any) => {
      return attachment.fileUrl;
    });

    const body: any = {
      action: "add_portfolio",
      project_name: data.project_name?.replace(/'/g, `''`),
      project_year: data.project_year,
      project_description: data.project_description?.replace(/'/g, `''`),
      project_skills: JSON.stringify(skills),
      image_urls: attachmentUrls,
    };

    if (portfolio) {
      body.action = "edit_portfolio";
      body.portfolio_id = portfolio.portfolio_id;
    }

    // Converting project year to string
    body.project_year = String(body.project_year);

    const promise = addEditPortfolio(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res: { message: string }) => {
        onCloseModal();
        onUpdate();

        return res.message;
      },
      error: (err) => {
        if (err && err?.response && err?.response?.data)
          return err?.response?.data?.message ?? "Unexpected Error Occured.";
      },
    });
  };

  /** @function This will reset the form and close the modal */
  const onCloseModal = () => {
    reset();
    setAttachments([]);
    onClose();
  };

  /** @function This will append the uploaded file urls to current ones */
  const onFileUpload = (uploads: { fileUrl: string; fileName: string }[]) => {
    setAttachments([...attachments, ...uploads]);
  };

  /** @function This will remove the attachment from the list */
  const removeAttachment = (index: number) => () => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const { errors }: any = formState;

  const handler = () => {
    if (!portfolio) return null;

    const attData = portfolio?.image_urls?.map((url: string) => {
      return {
        fileUrl: url,
        fileName: url.split("/")[url.split("/").length - 1],
      };
    });

    setAttachments(attData);
  };

  useEffect(() => {
    handler();
  }, [portfolio]);

  const multiSelectProps = {
    closeMenuOnSelect: true,
    isMulti: true,
    styles: MultiSelectCustomStyle,
  };

  const skillOptions = (inputValue: string) => {
    const skills: any = [];
    return getSkills(inputValue || "").then((res) => {
      res.data.forEach(function (item: any) {
        const obj = {
          label: item.skill_name,
          value: item.skill_id,
        };
        skills.push(obj);
      });
      return skills;
    });
  };

  const onSelectSkill = (selected: any) => {
    const data = selected.map((item: any) => {
      return {
        id: item.value,
        name: item.label,
      };
    });
    setSkills(data);
  };

  return (
    <StyledModal
      maxwidth={678}
      show={show}
      size="sm"
      onHide={onCloseModal}
      centered
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onCloseModal}>
          &times;
        </Button>
        <Wrapper
          className="content flex flex-column gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="modal-title fs-28 font-normal">
            {portfolio ? "Edit" : "Add New"} Portfolio Album
          </div>

          {/* START ----------------------------------------- Album Name */}
          <div className="mt-0 styled-form">
            <div className="fs-sm font-normal">
              Album Name<span className="mandatory">&nbsp;*</span>
            </div>
            <Form.Control
              placeholder="Enter album name"
              className="form-input"
              maxLength={100}
              {...register("project_name")}
            />
            <ErrorMessage>{errors.project_name?.message}</ErrorMessage>
          </div>
          {/* END ------------------------------------------- Album Name */}

          {/* START ----------------------------------------- Album Year */}
          <div className="mt-0 styled-form">
            <div className="fs-sm font-normal">Album Year</div>
            <Form.Control
              placeholder="Enter album year"
              className="form-input"
              type="number"
              {...register("project_year", {
                max: 4,
                onChange: (e) => {
                  const value = e.target.value;
                  e.target.value = Number(value.toString().slice(0, 4)) || "";
                  return e;
                },
              })}
            />
            <ErrorMessage>{errors.project_year?.message}</ErrorMessage>
          </div>
          {/* END ------------------------------------------- Album Year */}

          {/* START ----------------------------------------- Album Skills */}
          <div className="mt-0 styled-form">
            <div className="fs-sm font-normal">Album Skills</div>
            <AsyncSelect
              {...multiSelectProps}
              placeholder={"Enter your skills"}
              components={{ NoOptionsMessage }}
              loadOptions={skillOptions}
              onChange={onSelectSkill}
              value={getDefaultSkillOptions}
              isOptionDisabled={() => skills?.length > 14}
              defaultOptions={true}
            />
          </div>
          {/* END ------------------------------------------- Album Skills */}

          {/* START ----------------------------------------- Album Description */}
          <div className="mt-0 styled-form">
            <div className="fs-sm font-normal">Enter Album Description</div>
            <textarea
              // style={{resize: 'none'}}
              placeholder="Enter album description"
              className="w-100 form-input form-control"
              maxLength={500}
              {...register("project_description")}
            />
            <ErrorMessage>{errors.project_description?.message}</ErrorMessage>
          </div>
          {/* END ------------------------------------------- Album Description */}

          <div>
            {/* START ----------------------------------------- Attachments */}
            <div className="images-upload flex items-center justify-content-between">
              <div>
                <div className="fs-18 font-normal">
                  Add album&apos;s images, videos, audio, or document files{" "}
                  <span className="fw-300">(25 max)</span>
                </div>
                <div className="fs-1rem fw-300 mt-2">
                  To add files: click the &apos;+&apos; below, or drag and drop
                  them into this window.{" "}
                </div>
                <div className="fs-1rem fw-300 mt-0">
                  Supported file types:{" "}
                  <span className="text-lowercase">
                    {CONSTANTS.PORTFOLIO_ATTACHMENT_SUPPORTED_TYPES.join(", ")}
                  </span>
                </div>
                <div className="fs-1rem fw-300 mt-0">
                  Max size: {CONSTANTS.FILE_SIZE[30]}MB
                </div>
              </div>
              <div className="max-count fs-18 font-normal">
                {attachments?.length}/25
              </div>
            </div>
            {/* END ------------------------------------------- Attachments */}

            {/* Uploads preview and option to add new one at last */}
            <div className="uploads-attached flex flex-wrap mt-3 gap-3">
              {attachments?.map((item: AttachmentProps, index: number) => {
                if (!item.fileName || !item.fileUrl) {
                  return null;
                }
                return (
                  <AttachmentPreview
                    uploadedFile={item.fileUrl}
                    fileName={item.fileName}
                    key={item.fileUrl}
                    onDelete={removeAttachment(index)}
                  />
                );
              })}

              {/* An option to add new one - File uploader */}
              {attachments?.length !== 25 && (
                <FileUploadToAws
                  onFileUpload={onFileUpload}
                  attachments={attachments}
                />
              )}
            </div>
          </div>

          <div className="flex justify-content-end">
            <StyledButton type="submit">Continue</StyledButton>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default AddPortfolioModal;

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
