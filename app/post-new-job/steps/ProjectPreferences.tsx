"use client";

import { CONSTANTS } from "@/helpers/const/constants";
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
import { MdDelete } from "react-icons/md";
import ErrorMessage from "@/components/ui/ErrorMessage";

// Define types
type LanguageOption = { label: string; value: string };
type LanguageItem = { language_name: string; language_id: string };

const multiSelectProps = {
  closeMenuOnSelect: true,
  isMulti: true,
  classNamePrefix: "react-select",
};

export const ProjectPreferences = () => {
  const { formData, setFormData, errors, setIsImageUploading } =
    usePostJobContext();

  const getDefaultLanguagesOptions = useMemo(() => {
    if (formData?.languages && formData.languages.length > 0) {
      return formData.languages.map((item) => {
        return { label: item.name, value: item.id };
      });
    }
    return undefined;
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
  }, [formData, setFormData]);

  const referenceLinks = useMemo(() => {
    const refLinks = [...(formData?.reference_links || [])];
    if (refLinks.length < CONSTANTS.POST_JOB_MAX_REFERENCE_LINKS) {
      refLinks.push("");
    }
    return refLinks;
  }, [formData?.reference_links]);

  const languageOptions = (inputValue: string) => {
    const languages: LanguageOption[] = [];
    return getLanguages(inputValue || "").then((res) => {
      res.data.forEach(function (item: LanguageItem) {
        const obj = {
          label: item.language_name,
          value: item.language_id,
        };
        languages.push(obj);
      });
      return languages;
    });
  };

  const onSelectLanguage = (selected: LanguageOption[]) => {
    const data = selected.map((item: LanguageOption) => {
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
    <div className="flex flex-col space-y-6">
      {/* START ----------------------------------------- Preferred Location */}
      <div className="mb-6">
        <label className="block text-base font-bold mb-1 text-left">
          Preferred Freelancer Location (Optional)
        </label>
        <span className="block text-sm text-gray-600 mb-2 text-left">
          Where would you prefer your freelancer to be living?
        </span>
        <div className="flex flex-wrap mt-3 gap-2.5">
          {CONSTANTS.POST_JOB_LOCATIONS.map((item: string) => (
            <button
              className={`py-4 px-5 rounded-xl border  transition-all duration-200 text-base ${
                formData?.preferred_location?.includes(item)
                  ? "text-black border-black"
                  : ""
              }`}
              type="button"
              key={item}
              onClick={() => handleLocationSelection(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      {/* END ------------------------------------------- Preferred Location */}

      {/* START ----------------------------------------- Languages */}
      <div className="mb-6" id="languages">
        <label className="block text-base font-bold mb-1 text-left">
          Language (Optional)
        </label>
        <span className="block text-sm text-gray-600 mb-2 text-left">
          Which languages do you need your freelancer to speak to complete this
          project?
        </span>
        <AsyncSelect
          {...multiSelectProps}
          placeholder="Select languages"
          components={{ NoOptionsMessage }}
          loadOptions={languageOptions}
          onChange={(options) => onSelectLanguage(options as LanguageOption[])}
          defaultValue={getDefaultLanguagesOptions}
          defaultOptions={true}
          className="text-left"
        />
      </div>
      {/* END ------------------------------------------- Languages */}

      <div className="mb-6">
        <label className="block text-base font-bold mb-1 text-left">
          Style Samples (Optional)
        </label>
        <span className="block text-sm text-gray-600 mb-2 text-left">
          Are you aware of other projects with a similar style to what
          you&apos;re looking for? Add links or attachments below to give the
          freelancer a better idea of your vision.
        </span>

        <div className="flex flex-col md:flex-row gap-6 mt-3">
          {/* START ----------------------------------------- Style attachments */}
          <div className="flex-1">
            <span className="block text-sm text-gray-600 mb-2 text-left">
              Upload similar projects here
            </span>
            <div className="mt-2 ">
              <CustomUploader
                multiple
                handleMultipleUploadImage={handleUploadImage}
                attachments={
                  formData?.reference_attachments &&
                  formData.reference_attachments.length > 0
                    ? formData.reference_attachments.map((url) =>
                        getFileNameAndFileUrlFromAttachmentUrl(url)
                      )
                    : []
                }
                removeAttachment={(index?: number) => {
                  if (typeof index === "number") {
                    removeAttachment(index);
                  }
                }}
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
            <span className="block text-sm text-gray-600 mb-2 text-left">
              Add similar project links here
            </span>
            <div className="flex flex-col mt-2">
              {referenceLinks.map((referenceLink, i) => {
                return (
                  <React.Fragment key={i}>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add links to similar projects here."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="absolute top-1/4 right-2.5 cursor-pointer"
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
                    {errors &&
                      errors[
                        `reference_links[${i}]` as keyof typeof errors
                      ] && (
                        <ErrorMessage
                          className="mb-2"
                          message={
                            errors[
                              `reference_links[${i}]` as keyof typeof errors
                            ]
                          }
                        />
                      )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
          {/* END ------------------------------------------- Style links */}
        </div>
      </div>

      <FooterButtons />
    </div>
  );
};
