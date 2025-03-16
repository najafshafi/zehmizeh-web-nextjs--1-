import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  getCategories,
  getRelevantSkillsBasedOnCategory,
  getSkills,
} from "@/helpers/utils/helper";
import { editUser } from "@/helpers/http/auth";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { CategorySkillSelectModal } from "@/components/skills-form/CategorySelectModal";

type Props = {
  show: boolean;
  onClose: () => void;
  selectedCategories: IFreelancerDetails["skills"];
  selectedSkills: IFreelancerDetails["skills"];
  onUpdate: () => void;
};

const initialErrorMessages = { skills: "", categories: "" } as const;

const SkillsEditModal = ({
  show,
  selectedCategories,
  selectedSkills,
  onClose,
  onUpdate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryAndSkillData, setCategoryAndSkillData] = useState<
    IFreelancerDetails["skills"]
  >([...selectedCategories, ...selectedSkills]);
  const [error, setError] =
    useState<typeof initialErrorMessages>(initialErrorMessages);
  const [isSkillCategorySelectModalOpen, setIsSkillCategorySelectModalOpen] =
    useState(false);

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

  // Memoized handleUpdate to avoid recreation on every render
  const handleUpdate = useCallback(() => {
    setError(initialErrorMessages);
    const categories = getCategories(categoryAndSkillData);
    const skills = getSkills(categoryAndSkillData);

    if (categories.length === 0) {
      setError((prev) => ({
        ...prev,
        categories: "Please add at least one skill category.",
      }));
      return;
    }

    if (skills.length === 0) {
      setError((prev) => ({
        ...prev,
        skills: "Please add at least one skill for each skill category.",
      }));
      return;
    }

    setLoading(true);
    const promise = editUser({ skills: categoryAndSkillData });

    toast.promise(promise, {
      loading: "Updating your skills - please wait...",
      success: (res) => {
        onUpdate();
        setLoading(false);
        onClose();
        return res.message || "Skills updated successfully!";
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "Failed to update skills.";
      },
    });
  }, [categoryAndSkillData, onUpdate, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      {/* Backdrop */}
      <div
        className="w-screen h-screen fixed inset-0 backdrop-blur-sm z-40 p-0 m-0"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-white rounded-xl max-w-[678px] max-h-[90vh] w-full py-8 px-4 md:p-12 relative z-50 m-2">
        {/* Close Button */}
        <VscClose
          className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="space-y-5">
          <h2 className="text-[#212529] text-2xl sm:text-[28px] font-normal text-center sm:text-left">
            My Skills
          </h2>

          <div className="space-y-5">
            {/* Skill Categories Section */}
            <div>
              <CategorySkillSelectModal
                type="CATEGORY"
                label="Skill Categories"
                labelClassName="font-bold text-xl"
                subText={{
                  content:
                    "Which of the categories listed below include the skills you want to offer on ZMZ? Select all that apply.",
                  className: "text-base text-[#212529]",
                }}
                errorMessage={error.categories}
                formData={getCategories(categoryAndSkillData)}
                setFormData={(categories) => {
                  const updatedSkills = getRelevantSkillsBasedOnCategory([
                    ...getSkills(categoryAndSkillData),
                    ...categories,
                  ])
                    .filter((x) => "skills" in x)
                    .map((x) => x.skills)
                    .flat();
                  setCategoryAndSkillData([...updatedSkills, ...categories]);
                }}
                isMandatory
                modalOpenCloseListener={(value) =>
                  setIsSkillCategorySelectModalOpen(value)
                }
              />
              {error.categories && <ErrorMessage message={error.categories} />}
            </div>

            {/* Skills Section */}
            <div>
              <CategorySkillSelectModal
                type="SKILL"
                label="Add Skills"
                labelClassName="font-bold text-xl"
                subText={{
                  content:
                    "Select the freelancing skills that you intend to offer as a service on ZMZ. Include all that apply.",
                  className: "text-base text-[#212529]",
                }}
                errorMessage={error.skills}
                categories={getCategories(categoryAndSkillData)}
                formData={getSkills(categoryAndSkillData)}
                setFormData={(skills) => {
                  const categories = getCategories(categoryAndSkillData);
                  setCategoryAndSkillData([...categories, ...skills]);
                }}
                noResultFoundText="No skills available. Please select a category first."
                isMandatory
                modalOpenCloseListener={(value) =>
                  setIsSkillCategorySelectModalOpen(value)
                }
              />
              {error.skills && <ErrorMessage message={error.skills} />}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-center md:justify-end">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`bg-[#F2B420] text-[#212529] mt-[18px] px-9 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:bg-[#F2A420] ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ lineHeight: 1.6875 }}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsEditModal;
