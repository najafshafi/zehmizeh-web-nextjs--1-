/*
 * This is Add / Edit course modal
 */

"use client";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import ErrorMessage from "@/components/ui/ErrorMessage";
import CustomUploader from "@/components/ui/CustomUploader";
import { validateCourse } from "@/helpers/validation/common";
import { getYupErrors } from "@/helpers/utils/misc";
import { manageCourse } from "@/helpers/http/freelancer";
import { REGEX } from "@/helpers/const/regex";

type CourseEditModalProps = {
  show: boolean;
  onClose: () => void;
  data?: {
    course_id?: string;
    course_name?: string;
    school_name?: string;
    certificate_link?: string;
  } | null;
  onUpdate: () => void;
};

type FormStateType = {
  course_name: string;
  school_name: string;
  certificate_link: Array<{ fileUrl?: string; fileName?: string }>;
};

type ErrorsType = {
  course_name?: string;
  school_name?: string;
  certificate_link?: string;
};

const CourseEditModal = ({
  show,
  onClose,
  data,
  onUpdate,
}: CourseEditModalProps) => {
  const [formState, setFormState] = useState<FormStateType>({
    course_name: "",
    school_name: "",
    certificate_link: [],
  });
  const [errors, setErrors] = useState<ErrorsType>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  useEffect(() => {
    if (data && show) {
      setFormState({
        course_name: data?.course_name || "",
        school_name: data?.school_name || "",
        certificate_link: data?.certificate_link
          ? [{ fileUrl: data?.certificate_link }]
          : [],
      });
    } else {
      setFormState({
        course_name: "",
        school_name: "",
        certificate_link: [],
      });
      setErrors({});
    }
  }, [data, show]);

  const handleChange = useCallback(
    (
      field: keyof FormStateType,
      value: string | Array<{ fileUrl?: string; fileName?: string }>
    ) => {
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  // This is a wrapper function to adapt our interface to the CustomUploader component
  const handleUploadImage = (uploadData: {
    file: string;
    fileName?: string;
  }) => {
    handleChange("certificate_link", [
      { fileUrl: uploadData.file, fileName: uploadData.fileName },
    ]);
  };

  const removeAttachment = () => {
    handleChange("certificate_link", []);
  };

  const validate = () => {
    validateCourse.isValid(formState).then((valid) => {
      if (!valid) {
        validateCourse
          .validate(formState, { abortEarly: false })
          .catch((err) => {
            const errors = getYupErrors(err);
            setErrors({ ...errors });
          });
      } else {
        setErrors({});
        handleUpdate();
      }
    });
  };

  const handleUpdate = () => {
    /* Add / Edit course api call */
    setLoading(true);
    const body: {
      action: string;
      course_name: string;
      school_name: string;
      certificate_link: string;
      course_id?: string;
    } = {
      action: data ? "edit_course" : "add_course",
      course_name: formState.course_name,
      school_name: formState.school_name,
      certificate_link:
        formState.certificate_link.length > 0
          ? formState.certificate_link[0]?.fileUrl || ""
          : "",
    };

    if (data?.course_id) {
      body.course_id = data.course_id;
    }

    const promise = manageCourse(body);
    toast.promise(promise, {
      loading: data
        ? "Updating your details - please wait..."
        : "Please wait...",
      success: (res) => {
        onUpdate();
        setLoading(false);
        return data ? res.response : res.message;
      },
      error: (err) => {
        setLoading(false);
        return (data ? err?.response : err?.message) || "error";
      },
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      {/* Backdrop */}
      <div
        className="w-screen h-screen fixed inset-0 backdrop-blur-sm z-40 p-0 m-0"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-xl w-full max-w-[678px] max-h-[90vh] py-[2rem] px-[1rem] md:py-[3.20rem] md:px-12 relative z-50 m-2">
        {/* Close Button */}
        <VscClose
          className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="space-y-5">
          <h2 className="text-[#212529] text-[1.75rem] font-medium text-left">
            Courses / Certifications
          </h2>

          <div className="space-y-5">
            {/* Course Name Field */}
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">
                Course / Certificate Name
                <span className="text-red-500">&nbsp;*</span>
              </label>
              <input
                type="text"
                placeholder="Enter course / certificate name"
                className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                value={formState.course_name}
                onChange={(e) =>
                  handleChange(
                    "course_name",
                    e.target.value.replace(REGEX.TITLE, "")
                  )
                }
                maxLength={100}
              />
              {errors?.course_name && (
                <ErrorMessage message={errors.course_name} />
              )}
            </div>

            {/* School Name Field */}
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">
                Certifying Institution / College:
                <span className="text-red-500">&nbsp;*</span>
              </label>
              <input
                type="text"
                placeholder="Where did you complete your course or receive your certificate from?"
                className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                value={formState.school_name}
                onChange={(e) =>
                  handleChange(
                    "school_name",
                    e.target.value.replace(REGEX.TITLE, "")
                  )
                }
                maxLength={100}
              />
              {errors?.school_name && (
                <ErrorMessage message={errors.school_name} />
              )}
            </div>

            {/* Certificate Upload */}
            <div className="form-group">
              <CustomUploader
                handleUploadImage={handleUploadImage}
                attachments={formState.certificate_link}
                removeAttachment={removeAttachment}
                suggestions="File type: PDF, JPG, PNG, JPEG"
                placeholder="Upload certificate"
                acceptedFormats="image/*, .pdf"
              />
              {errors?.certificate_link && (
                <ErrorMessage message={errors.certificate_link} />
              )}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center md:justify-end !mt-9">
            <button
              onClick={validate}
              disabled={loading}
              className={`bg-[#f2b420] text-[#212529] px-9 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:opacity-70 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ lineHeight: 1.6875 }}
            >
              {data ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditModal;
