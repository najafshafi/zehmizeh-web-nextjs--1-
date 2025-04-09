import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as useFormPg from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addEditPortfolio } from "@/helpers/http/portfolio";
import ErrorMessage from "@/components/ui/ErrorMessage";
import AttachmentPreview from "@/components/ui/AttachmentPreview";
import FileUploadToAws from "./FileUploadToAws";
import { components } from "react-select";
import AsyncSelect from "react-select/async";
import { MultiSelectCustomStyle } from "@/app/freelancer/account/[tabkey]/edit-modals/multiSelectCustomStyle";
import { getSkills } from "@/helpers/http/common";
import { CONSTANTS } from "@/helpers/const/constants";
import { portfolioValidation } from "@/helpers/validation/portfolioValidation";
import { VscClose } from "react-icons/vsc";
import { MultiValue, SingleValue } from "react-select";

interface AttachmentProps {
  fileUrl?: string;
  fileName?: string;
}

interface Portfolio {
  portfolio_id?: string;
  project_name?: string;
  project_year?: string;
  project_description?: string;
  project_skills?: string;
  image_urls?: string[];
}

interface Props {
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
  portfolio?: Portfolio;
}

interface FormData {
  project_name: string;
  project_year: string;
  project_skills: Array<{ id: string; name: string }>;
  project_description: string;
}

interface PortfolioBody {
  action: string;
  project_name: string;
  project_year: string;
  project_description: string;
  project_skills: string;
  image_urls: string[];
  portfolio_id?: string;
}

const AddPortfolioModal = ({ show, onClose, onUpdate, portfolio }: Props) => {
  const [attachments, setAttachments] = useState<AttachmentProps[]>([]);
  const jsonData = portfolio?.project_skills;
  const parsedSkills = jsonData?.startsWith("[") ? JSON.parse(jsonData) : [];
  const [skills, setSkills] =
    useState<Array<{ id: string; name: string }>>(parsedSkills);

  const formInitials: FormData = {
    project_name: portfolio?.project_name ?? "",
    project_year: portfolio?.project_year ?? "",
    project_skills: skills ?? [],
    project_description: portfolio?.project_description ?? "",
  };

  const getDefaultSkillOptions = useMemo(() => {
    if (skills?.length > 0) {
      return skills.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    }
    return [];
  }, [skills]);

  const { useForm } = useFormPg;
  const { register, handleSubmit, formState, reset } = useForm<FormData>({
    defaultValues: formInitials,
    resolver: yupResolver(portfolioValidation as any),
  });

  const onSubmit: useFormPg.SubmitHandler<FormData> = async (data) => {
    if (attachments?.length === 0) {
      toast.error("Please upload at least one attachment.");
      return;
    }

    const attachmentUrls = attachments
      .map((attachment) => attachment.fileUrl)
      .filter((url): url is string => !!url);

    const body: PortfolioBody = {
      action: portfolio ? "edit_portfolio" : "add_portfolio",
      project_name: data.project_name?.replace(/'/g, `''`),
      project_year: String(data.project_year),
      project_description: data.project_description?.replace(/'/g, `''`),
      project_skills: JSON.stringify(skills),
      image_urls: attachmentUrls,
    };

    if (portfolio?.portfolio_id) {
      body.portfolio_id = portfolio.portfolio_id;
    }

    try {
      const promise = addEditPortfolio(body);
      toast.promise(promise, {
        loading: "Please wait...",
        success: (res: { message: string }) => {
          onCloseModal();
          onUpdate();
          return res.message;
        },
        error: (err) => {
          if (err?.response?.data?.message) {
            return err.response.data.message;
          }
          return "An unexpected error occurred.";
        },
      });
    } catch (error) {
      console.error("Error submitting portfolio:", error);
      toast.error("Failed to save portfolio");
    }
  };

  const onCloseModal = () => {
    reset();
    setAttachments([]);
    onClose();
  };

  const onFileUpload = (uploads: { fileUrl: string; fileName: string }[]) => {
    setAttachments((prev) => [...prev, ...uploads]);
  };

  const removeAttachment = (index: number) => () => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const { errors } = formState;

  useEffect(() => {
    if (portfolio?.image_urls) {
      const attData = portfolio.image_urls.map((url) => ({
        fileUrl: url,
        fileName: url.split("/")[url.split("/").length - 1],
      }));
      setAttachments(attData);
    }
  }, [portfolio]);

  const multiSelectProps = {
    closeMenuOnSelect: true,
    isMulti: true,
    styles: MultiSelectCustomStyle,
  };

  const skillOptions = async (inputValue: string) => {
    try {
      const res = await getSkills(inputValue || "");
      return res.data.map((item: { skill_name: string; skill_id: string }) => ({
        label: item.skill_name,
        value: item.skill_id,
      }));
    } catch (error) {
      console.error("Error fetching skills:", error);
      return [];
    }
  };

  const onSelectSkill = (
    selected:
      | MultiValue<{ value: string; label: string }>
      | SingleValue<{ value: string; label: string }>
  ) => {
    if (Array.isArray(selected)) {
      const data = selected.map((item) => ({
        id: item.value,
        name: item.label,
      }));
      setSkills(data);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onCloseModal}
        />

        <div className="inline-block transform text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-[678px] sm:align-middle">
          <div className="relative bg-white rounded-lg py-[2rem] px-[1rem] md:py-[3.20rem] md:px-12">
            <VscClose
              className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
              onClick={onClose}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="text-[#212529] text-[1.75rem] font-normal text-left">
                {portfolio ? "Edit" : "Add New"} Portfolio Album
              </h2>

              {/* Album Name */}
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-700">
                  Album Name<span className="text-red-500">&nbsp;*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter album name"
                  className="w-full rounded-lg border border-gray-300 px-5 py-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  maxLength={100}
                  {...register("project_name")}
                />
                <ErrorMessage>{errors.project_name?.message}</ErrorMessage>
              </div>

              {/* Album Year */}
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-700">
                  Album Year
                </label>
                <input
                  type="number"
                  placeholder="Enter album year"
                  className="w-full rounded-lg border border-gray-300 px-5 py-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  {...register("project_year", {
                    max: 4,
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      e.target.value = value.slice(0, 4);
                    },
                  })}
                />
                <ErrorMessage>{errors.project_year?.message}</ErrorMessage>
              </div>

              {/* Album Skills */}
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-700">
                  Album Skills
                </label>
                <AsyncSelect
                  {...multiSelectProps}
                  placeholder="Enter your skills"
                  components={{ NoOptionsMessage }}
                  loadOptions={skillOptions}
                  onChange={onSelectSkill}
                  value={getDefaultSkillOptions}
                  isOptionDisabled={() => skills?.length > 14}
                  defaultOptions={true}
                />
              </div>

              {/* Album Description */}
              <div className="space-y-2">
                <label className="text-sm font-normal text-gray-700">
                  Enter Album Description
                </label>
                <textarea
                  placeholder="Enter album description"
                  className="w-full rounded-lg border border-gray-300 px-5 py-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  maxLength={500}
                  {...register("project_description")}
                />
                <ErrorMessage>
                  {errors.project_description?.message}
                </ErrorMessage>
              </div>

              {/* Attachments Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-normal">
                      Add album&apos;s images, videos, audio, or document files{" "}
                      <span className="font-light">(25 max)</span>
                    </p>
                    <p className="text-sm font-light">
                      To add files: click the &apos;+&apos; below, or drag and
                      drop them into this window.
                    </p>
                    <p className="text-sm font-light">
                      Supported file types:{" "}
                      <span className="lowercase">
                        {CONSTANTS.PORTFOLIO_ATTACHMENT_SUPPORTED_TYPES.join(
                          ", "
                        )}
                      </span>
                    </p>
                    <p className="text-sm font-light">
                      Max size: {CONSTANTS.FILE_SIZE[30]}MB
                    </p>
                  </div>
                  <div className="text-lg font-normal text-gray-800">
                    {attachments?.length}/25
                  </div>
                </div>

                {/* Uploads preview */}
                <div className="flex flex-wrap gap-3">
                  {attachments?.map((item, index) => {
                    if (!item.fileName || !item.fileUrl) return null;
                    return (
                      <AttachmentPreview
                        key={item.fileUrl}
                        uploadedFile={item.fileUrl}
                        fileName={item.fileName}
                        onDelete={removeAttachment(index)}
                      />
                    );
                  })}

                  {/* Add new file option */}
                  {attachments?.length !== 25 && (
                    <FileUploadToAws
                      onFileUpload={onFileUpload}
                      attachments={attachments}
                    />
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[#F7B500] px-8 py-4 text-lg font-medium text-[#1d1e1b] hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-[#F7B500] focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPortfolioModal;

const NoOptionsMessage = (props: any) => {
  return (
    <components.NoOptionsMessage {...props}>
      <div>
        {props.selectProps.inputValue
          ? `No result found for '${props.selectProps.inputValue}'`
          : "Search..."}
      </div>
    </components.NoOptionsMessage>
  );
};
