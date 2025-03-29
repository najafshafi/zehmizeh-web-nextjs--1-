import { CONSTANTS } from "@/helpers/const/constants";
import {
  FormLabel,
  FormLabelSubText,
  MultiSelectCustomStyle,
  PostForm,
} from "../postJob.styled";
import { OptionButton } from "@/components/forms/OptionButton";
import { usePostJobContext } from "../context";
import AsyncSelect from "react-select/async";
import { NoOptionsMessage } from "@/components/NoOptionsMessage";
import { getLanguages } from "@/helpers/http/common";
import React, { useMemo } from "react";
import CustomUploader, {
  TCustomUploaderFile,
} from "@/components/ui/CustomUploader";
import { FooterButtons } from "../partials/FooterButtons";
import { getFileNameAndFileUrlFromAttachmentUrl } from "@/helpers/utils/misc";
import { Form, InputGroup } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import ErrorMessage from "@/components/ui/ErrorMessage";

const multiSelectProps = {
  closeMenuOnSelect: true,
  isMulti: true,
  styles: MultiSelectCustomStyle,
};

export const ProjectPreferences = () => {
  const { formData, setFormData, errors, setIsImageUploading } =
    usePostJobContext();

  const getDefaultLanguagesOptions = useMemo(() => {
    if (formData?.languages?.length > 0) {
      return formData?.languages?.map((item) => {
        return { label: item.name, value: item.id };
      });
    }
  }, [formData?.languages]);

  React.useEffect(() => {
    if (
      !formData?.preferred_location ||
      formData.preferred_location.length === 0
    ) {
      setFormData({
        ...formData,
        preferred_location: CONSTANTS.POST_JOB_DEFAULT_LOCATION,
      });
    }
  }, []);

  const referenceLinks = useMemo(() => {
    const refLinks = [...(formData?.reference_links || [])];
    if (refLinks.length < CONSTANTS.POST_JOB_MAX_REFERENCE_LINKS) {
      refLinks.push("");
    }
    return refLinks;
  }, [formData?.reference_links]);

  const languageOptions = (inputValue: string) => {
    const languages: { label: string; value: string }[] = [];
    return getLanguages(inputValue || "").then((res) => {
      res.data.forEach(function (item) {
        const obj = {
          label: item.language_name,
          value: item.language_id,
        };
        languages.push(obj);
      });
      return languages;
    });
  };

  const onSelectLanguage = (selected) => {
    const data = selected.map((item) => {
      return { id: item.value, name: item.label };
    });
    setFormData({ languages: data });
  };

  const handleUploadImage = (files: TCustomUploaderFile[]) => {
    const attachmentsUrls = [
      ...(formData?.reference_attachments || []),
      ...files.map(({ file, fileName }) => `${file}#docname=${fileName}`),
    ];
    setFormData({ reference_attachments: attachmentsUrls });
  };

  const removeAttachment = (index: number) => {
    const attachmentsUrls = [...(formData?.reference_attachments || [])];
    attachmentsUrls.splice(index, 1);
    setFormData({ reference_attachments: attachmentsUrls });
  };

  const handleLocationSelection = (selectedLocation: string) => {
    let modifiedPreferredLocation = [...(formData?.preferred_location || [])];

    if (selectedLocation === "Anywhere") {
      // If "Anywhere" is clicked
      if (modifiedPreferredLocation.includes("Anywhere")) {
        // If "Anywhere" is already selected, deselect everything
        modifiedPreferredLocation = [];
      } else {
        // If "Anywhere" is not selected, select all locations
        modifiedPreferredLocation = [...CONSTANTS.POST_JOB_LOCATIONS];
      }
    } else {
      // If any other location is clicked
      if (modifiedPreferredLocation.includes(selectedLocation)) {
        // Remove the location if it's already selected
        modifiedPreferredLocation = modifiedPreferredLocation.filter(
          (x) => x !== selectedLocation && x !== "Anywhere"
        );
      } else {
        // Add the location if it's not selected
        modifiedPreferredLocation = modifiedPreferredLocation.filter(
          (x) => x !== "Anywhere"
        );
        modifiedPreferredLocation.push(selectedLocation);

        // Check if all locations except "Anywhere" are selected
        const allOtherLocationsSelected = CONSTANTS.POST_JOB_LOCATIONS.filter(
          (loc) => loc !== "Anywhere"
        ).every((loc) => modifiedPreferredLocation.includes(loc));

        if (allOtherLocationsSelected) {
          // If all other locations are selected, add "Anywhere"
          modifiedPreferredLocation.push("Anywhere");
        }
      }
    }

    setFormData({ preferred_location: modifiedPreferredLocation });
  };

  return (
    <PostForm>
      {/* START ----------------------------------------- Preferred Location */}
      <div className="form-group">
        <FormLabel>Preferred Freelancer Location (Optional)</FormLabel>
        <FormLabelSubText>
          Where would you prefer your freelancer to be living?
        </FormLabelSubText>
        <br />
        <div className="d-flex flex-wrap mt-3" style={{ gap: "10px" }}>
          {CONSTANTS.POST_JOB_LOCATIONS.map((item: string) => (
            <OptionButton
              selected={formData?.preferred_location?.includes(item)}
              key={item}
              onClick={() => handleLocationSelection(item)}
              margin="0px"
              $fontSize="1rem"
            >
              {item}
            </OptionButton>
          ))}
        </div>
      </div>
      {/* END ------------------------------------------- Preferred Location */}

      {/* START ----------------------------------------- Languages */}
      <div className="form-group" id="languages">
        <FormLabel>Language (Optional)</FormLabel>
        <FormLabelSubText>
          Which languages do you need your freelancer to speak to complete this
          project?
        </FormLabelSubText>
        <AsyncSelect
          {...multiSelectProps}
          placeholder="Select languages"
          components={{ NoOptionsMessage }}
          loadOptions={languageOptions}
          onChange={(options) => onSelectLanguage(options)}
          defaultValue={getDefaultLanguagesOptions}
          defaultOptions={true}
        />
      </div>
      {/* END ------------------------------------------- Languages */}

      <div className="form-group">
        <FormLabel>Style Samples (Optional)</FormLabel>
        <FormLabelSubText>
          Are you aware of other projects with a similar style to what you’re
          looking for? Add links or attachments below to give the freelancer a
          better idea of your vision.
        </FormLabelSubText>
        <br />
        <div className="style-links-wrapper">
          {/* START ----------------------------------------- Style attachments */}
          <div className="flex-1">
            <FormLabelSubText>Upload similar projects here</FormLabelSubText>
            <div className="mt-2">
              <CustomUploader
                multiple
                handleMultipleUploadImage={handleUploadImage}
                attachments={
                  formData?.reference_attachments?.length > 0
                    ? formData.reference_attachments.map((url) =>
                        getFileNameAndFileUrlFromAttachmentUrl(url)
                      )
                    : []
                }
                removeAttachment={removeAttachment}
                limit={CONSTANTS.ATTACHMENTS_LIMIT}
                acceptedFormats={[
                  ...CONSTANTS.DEFAULT_ATTACHMENT_SUPPORTED_TYPES,
                  "audio/*",
                  "video/*",
                ].join(", ")}
                suggestions="File type: PDF, DOC, DOCX, XLS, XLSX, Image Files, Audio Files, Video Files"
                shouldShowFileNameAndExtension={false}
                imageUploadingListener={(value) => {
                  setIsImageUploading(value);
                }}
              />
            </div>
          </div>
          {/* END ------------------------------------------- Style attachments */}

          {/* START ----------------------------------------- Style links */}
          <div className="flex-1">
            <FormLabelSubText>Add similar project links here</FormLabelSubText>
            <InputGroup className="flex-column mt-2">
              {referenceLinks.map((referenceLink, i) => {
                return (
                  <React.Fragment key={i}>
                    <div className="position-relative">
                      <Form.Control
                        placeholder="Add links to similar projects here."
                        className="w-100"
                        value={referenceLink}
                        onChange={(e) => {
                          if (e.target.value.length > 200) return;
                          const modifiedReferenceLinks = [
                            ...(formData?.reference_links || []),
                          ];
                          if (modifiedReferenceLinks?.[i])
                            modifiedReferenceLinks[i] = e.target.value;
                          else modifiedReferenceLinks.push(e.target.value);

                          // If user removes link then removing that inputbox
                          if (
                            e.target.value === "" &&
                            i < modifiedReferenceLinks.length
                          )
                            modifiedReferenceLinks.splice(i, 1);

                          setFormData({
                            reference_links: modifiedReferenceLinks,
                          });
                        }}
                      />
                      {referenceLink !== "" && (
                        <MdDelete
                          className="position-absolute pointer"
                          style={{ top: "30%", right: "10px" }}
                          onClick={() => {
                            const modifiedReferenceLinks = [
                              ...(formData?.reference_links || []),
                            ];
                            modifiedReferenceLinks.splice(i, 1);
                            setFormData({
                              reference_links: modifiedReferenceLinks,
                            });
                          }}
                        />
                      )}
                    </div>
                    {errors?.[`reference_links[${i}]`] && (
                      <ErrorMessage
                        className="mb-2"
                        message={errors[`reference_links[${i}]`]}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </InputGroup>
          </div>
          {/* END ------------------------------------------- Style links */}
        </div>
      </div>

      <FooterButtons />
    </PostForm>
  );
};
