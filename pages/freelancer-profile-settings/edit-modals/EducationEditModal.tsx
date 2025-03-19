/*
 * This is Add / Edit education modal
 */

import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { validateEducation } from "@/helpers/validation/common";
import { getYupErrors } from "@/helpers/utils/misc";
import { manageEducation } from "@/helpers/http/freelancer";
import { REGEX } from "@/helpers/const/regex";

type EducationProps = {
  show: boolean;
  onClose: () => void;
  data?: {
    education_id?: string;
    course_name?: string;
    school_name?: string;
    education_year?: string;
  } | null;
  onUpdate: () => void;
};

type FormStateType = {
  degreeName: string;
  university: string;
  from: string;
  to: string;
};

type ErrorsType = {
  degreeName?: string;
  university?: string;
  from?: string;
  to?: string;
};

const EducationEditModal = ({
  show,
  onClose,
  data,
  onUpdate,
}: EducationProps) => {
  const [formState, setFormState] = useState<FormStateType>({
    degreeName: "",
    university: "",
    from: "",
    to: "",
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
        degreeName: data?.course_name || "",
        university: data?.school_name || "",
        from: data?.education_year?.split("-")[0] || "",
        to: data?.education_year?.split("-")[1] || "",
      });
    } else {
      setFormState({
        degreeName: "",
        university: "",
        from: "",
        to: "",
      });
      setErrors({});
    }
  }, [data, show]);

  const handleChange = useCallback(
    (field: keyof FormStateType, value: string) => {
      setFormState((prevFormState) => {
        return { ...prevFormState, [field]: value };
      });
    },
    []
  );

  const validate = () => {
    validateEducation.isValid(formState).then((valid) => {
      if (!valid) {
        validateEducation
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
    // Add / Edit education modal
    setLoading(true);
    const body: {
      action: string;
      course_name: string;
      school_name: string;
      education_year: string;
      education_id?: string;
    } = {
      action: data ? "edit_education" : "add_education",
      course_name: formState.degreeName,
      school_name: formState.university,
      education_year: `${formState.from}-${formState.to}`,
    };

    if (data?.education_id) {
      body.education_id = data.education_id;
    }

    const promise = manageEducation(body);
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
            Education
          </h2>

          <div className="space-y-5">
            {/* Degree Name Field */}
            <div className="form-group">
              <label className="block text-sm font-medium mb-2">
                Degree Earned<span className="text-red-500">&nbsp;*</span>
              </label>
              <input
                type="text"
                placeholder="Enter degree name"
                className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                value={formState.degreeName}
                onChange={(e) =>
                  handleChange(
                    "degreeName",
                    e.target.value.replace(REGEX.TITLE, "")
                  )
                }
                maxLength={100}
              />
              {errors?.degreeName && (
                <ErrorMessage message={errors.degreeName} />
              )}
            </div>

            {/* University Field */}
            <div className="form-group">
              <label className="block text-sm font-medium mb-2 text-[#212529]">
                University<span className="text-red-500">&nbsp;*</span>
              </label>
              <input
                type="text"
                placeholder="Enter university name"
                className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                value={formState.university}
                onChange={(e) =>
                  handleChange(
                    "university",
                    e.target.value.replace(REGEX.TITLE, "")
                  )
                }
                maxLength={100}
              />
              {errors?.university && (
                <ErrorMessage message={errors.university} />
              )}
            </div>

            {/* Year Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* From Year */}
              <div className="form-group">
                <label className="block text-sm font-medium mb-2">
                  From (Year)
                </label>
                <input
                  type="text"
                  placeholder="Year you began the program"
                  className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                  value={formState.from}
                  onChange={(e) => handleChange("from", e.target.value)}
                />
                {errors?.from && <ErrorMessage message={errors.from} />}
              </div>

              {/* To Year */}
              <div className="form-group">
                <label className="block text-sm font-medium mb-2">
                  To (Year)
                </label>
                <input
                  type="text"
                  placeholder="Year you completed the program"
                  className="w-full px-5 py-4 border rounded-md focus:outline-none border-black focus:ring-4 focus:ring-[#0d6efd40] transition-all"
                  value={formState.to}
                  onChange={(e) => handleChange("to", e.target.value)}
                />
                {errors?.to && <ErrorMessage message={errors.to} />}
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center lg:justify-end !mt-9">
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

export default EducationEditModal;
