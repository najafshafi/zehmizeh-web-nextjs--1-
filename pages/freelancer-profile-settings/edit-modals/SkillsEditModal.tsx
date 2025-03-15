/*
 * This component is a modal to edit a freelancer's skills, allowing selection of categories
 * and specific skills, with validation and API integration for updates.
 */

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import { editUser } from "@/helpers/http/auth";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  getCategories,
  getRelevantSkillsBasedOnCategory,
  getSkills,
} from "@/helpers/utils/helper";
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
        onClose(); // Automatically close modal on success
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
      <div className="bg-white rounded-xl max-w-[678px] max-h-[643px] w-full py-8 px-4 md:p-12 relative z-50 m-2 overflow-y-auto">
        {/* Close Button */}
        <VscClose
          className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl sm:text-[28px] font-normal text-center sm:text-left">
            My Skills
          </h2>

          {/* Skill Categories Section */}
          <CategorySkillSelectModal
            type="CATEGORY"
            label="Skill Categories"
            labelClassName="font-bold text-xl"
            subText={{
              content:
                "Which categories include the skills you offer on ZMZ? Select all that apply.",
              className: "text-base text-gray-600",
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

          {/* Skills Section */}
          <CategorySkillSelectModal
            type="SKILL"
            label="Add Skills"
            labelClassName="font-bold text-xl"
            subText={{
              content:
                "Which of the categories listed below include the skills you want to offer on ZMZ? Select all that apply.",
              className: "text-base text-gray-600",
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

          {/* Update Button */}
          <div className="flex justify-end mt-5">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`px-9 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
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
