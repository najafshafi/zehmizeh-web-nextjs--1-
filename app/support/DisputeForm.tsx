/*
 * This component serves the Dispute Form
 */
import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { FormLabel } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import CustomUploader from "@/components/ui/CustomUploader";
import ErrorMessage from "@/components/ui/ErrorMessage";
import ProjectDropdown from "./ProjectDropdown";
import ProjectMilestoneDropdown from "./ProjectMilestoneDropdown";
import { validateDispute } from "@/helpers/validation/common";
import { getPlainText, getYupErrors } from "@/helpers/utils/misc";
import { manageDispute } from "@/helpers/http/dispute";
import { Vaidations } from "./validations";
import { useAuth } from "@/helpers/contexts/auth-context";
import CustomButton from "@/components/custombutton/CustomButton";

type ValidationType = {
  fixed: {
    pending: string;
    released: string;
    under_dispute: string;
  };
  hourly: {
    paid: string;
    under_dispute: string;
    decline: string;
    declined: string;
  };
};

type CKEditorInstance = {
  editing: {
    view: {
      change: (callback: (writer: any) => void) => void;
      document: {
        getRoot: () => any;
      };
    };
  };
  getData: () => string;
};

type UploadFile = {
  file: string;
  fileName?: string;
  fileUrl?: string;
};

const DisputeForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [attachments, setAttachments] = useState<
    {
      fileName?: string;
      fileUrl: string;
    }[]
  >([]);
  const [errors, setErrors] = useState<any>({});
  const { user } = useAuth();

  const onSelectProject = (item: any) => {
    /* When the project is selected from the project dropdown,
     * it will set selected project and also make the selected milestone null to clear the old selection */
    setSelectedProject(item);
    setSelectedMilestone(null);
  };

  const onSelectMilestone = (item: any) => {
    /* When a milestone is selected from the milestone dropdown */
    setSelectedMilestone(item);
  };

  const handleUploadImage = (
    file: Partial<{ file: string; fileName: string; fileUrl: string }>
  ) => {
    if (file.file) {
      setAttachments([
        {
          fileUrl: file.file,
          fileName: file.fileName,
        },
      ]);
    }
  };

  const removeAttachment = () => {
    /* As currently back-end is supporting single file only,
     * when attachemnt is removed it will make the array empty.
     */
    setAttachments([]);
  };

  const validate = () => {
    /* This will validate the form:
     * Selected project, milestone and description are mandatory here
     */

    const formState = {
      selectedPeojectId: selectedProject?.job_post_id,
      selectedMilestoneId:
        selectedMilestone?.milestone_id || selectedMilestone?.hourly_id,
      description,
    };

    validateDispute.isValid(formState).then((valid) => {
      if (!valid) {
        validateDispute
          .validate(formState, { abortEarly: false })
          .catch((err) => {
            const errors = getYupErrors(err);
            setErrors({ ...errors });
          });
      } else {
        setErrors({});
        submitDisputeForm();
      }
    });
  };

  const submitDisputeForm = () => {
    if (wordCount > 2000) {
      toast.error("The character maximum is 2000.");
      return;
    }

    // Submit dispute api call
    const body: {
      action?: string;
      admin_id: string;
      job_post_id: string;
      description: string;
      action_log: any;
      attachment_file?: string;
      milestone_id?: string | number;
      hourly_id?: string | number;
    } = {
      action: "add_dispute",
      admin_id: "b9f3ee90-64fd-4e49-b21d-5fc751e55197",
      job_post_id: selectedProject?.job_post_id,
      description: description,
      action_log: {},
    };

    if (attachments?.length > 0) {
      body.attachment_file = `${attachments[0].fileUrl}#docname=${attachments[0].fileName}`;
    }

    let jobType = "";
    if (selectedMilestone?.milestone_id) {
      body.milestone_id = selectedMilestone?.milestone_id;
      jobType = "fixed";
    } else {
      body.hourly_id = selectedMilestone?.hourly_id;
      jobType = "hourly";
    }

    const milestoneStatus =
      jobType == "fixed"
        ? selectedMilestone.status
        : selectedMilestone?.hourly_status;

    const userType = user?.user_type;

    if (userType && jobType && milestoneStatus) {
      const validation = Vaidations[
        userType as keyof typeof Vaidations
      ] as ValidationType;
      if (validation[jobType as keyof ValidationType]) {
        const statusValidation =
          validation[jobType as keyof ValidationType][
            milestoneStatus as keyof (typeof validation)[keyof ValidationType]
          ];
        if (statusValidation) {
          toast.error(statusValidation);
          return;
        }
      }
    }

    const promise = manageDispute(body);
    setLoading(true);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        setSelectedProject(null);
        setSelectedMilestone(null);
        setDescription("");
        setAttachments([]);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const wordCount = useMemo(() => {
    return description ? getPlainText(description).length : 0;
  }, [description]);

  return (
    <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_4px_74px_rgba(0,0,0,0.04)] md:p-8">
      <h4 className="text-center mb-3 text-2xl font-semibold">
        Submit Dispute
      </h4>
      <div className="mt-4">
        <FormLabel className="text-base font-normal">
          Select Project<span className="mandatory text-red-500">&nbsp;*</span>
        </FormLabel>

        {/* Project dropdown */}

        <ProjectDropdown
          onSelectProject={onSelectProject}
          selectedProject={selectedProject}
        />
        {errors?.selectedPeojectId && (
          <ErrorMessage message={errors?.selectedPeojectId} />
        )}
      </div>

      <div className="mt-4">
        <FormLabel className="text-base font-normal">
          Select Milestone/Hours Submission
          <span className="mandatory text-red-500">&nbsp;*</span>
        </FormLabel>

        {/* Project milestone dropdown */}

        <ProjectMilestoneDropdown
          onSelectMilestone={onSelectMilestone}
          selectedProjectId={selectedProject?.job_post_id}
          selectedMilestone={selectedMilestone}
        />
        {errors?.selectedMilestoneId && (
          <ErrorMessage message={errors?.selectedMilestoneId} />
        )}
      </div>

      {/* Description CK Editor */}
      <div className="mt-4">
        <div className="mb-2">
          <FormLabel className="text-base font-normal ">
            Explain the reasons behind your dispute. Include all relevant
            details.
            <span className="mandatory text-red-500">&nbsp;*</span>
          </FormLabel>
        </div>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          config={{
            toolbar: ["bold", "italic", "numberedList", "bulletedList"],
          }}
          onReady={(editor: CKEditorInstance) => {
            editor?.editing?.view.change((writer: any) => {
              writer.setStyle(
                "max-height",
                "200px",
                editor.editing.view.document.getRoot()
              );
            });
          }}
          onChange={(event: any, editor: CKEditorInstance) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />

        {wordCount > 2000 ? (
          <div className="text-danger">The character maximum is 2000.</div>
        ) : null}

        {errors?.description && <ErrorMessage message={errors?.description} />}
      </div>

      {/* File Uploader */}

      <div className="mt-4">
        <CustomUploader
          handleUploadImage={handleUploadImage}
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      </div>

      {/* Submit button */}
      <div className="mt-4 flex justify-end">
        <CustomButton
          className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
          onClick={validate}
          disabled={loading}
          text="Submit"
        />
      </div>
    </div>
  );
};

export default DisputeForm;
