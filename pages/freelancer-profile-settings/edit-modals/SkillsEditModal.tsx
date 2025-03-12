/*
 * This component is a modal to edit skills
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { Modal, Button } from "react-bootstrap";
import { EditFormWrapper } from "./edit-modals.styled";
import { StyledModal } from "@/components/styled/StyledModal";
import { StyledButton } from "@/components/forms/Buttons";
import { editUser } from "@/helpers/http/auth";
import { CategorySkillSelectModal } from "@/components/skills-form/CategorySelectModal";
import {
  getCategories,
  getRelevantSkillsBasedOnCategory,
  getSkills,
} from "@/helpers/utils/helper";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";

type Props = {
  show: boolean;
  onClose: () => void;
  selectedCategories: IFreelancerDetails["skills"];
  selectedSkills: IFreelancerDetails["skills"];
  onUpdate: () => void;
};

const initialErrorMessages = { skills: "", categories: "" };

const SkillsEditModal = ({
  show,
  selectedCategories,
  selectedSkills,
  onClose,
  onUpdate,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryAndSkillData, setCategoryAndSkillData] = useState<
    typeof selectedCategories
  >([...selectedCategories, ...selectedSkills]);
  const [error, setError] = useState(initialErrorMessages);

  const [isSkillCategorySelectModalOpen, setIsSkillCategorySelectModalOpen] =
    useState(false);

  const handleUpdate = () => {
    setError(initialErrorMessages);
    if (getCategories(categoryAndSkillData)?.length === 0)
      return setError((prev) => ({
        ...prev,
        categories: "Please add at least one skill category.",
      }));

    if (getSkills(categoryAndSkillData)?.length === 0)
      return setError((prev) => ({
        ...prev,
        skills: "Please add at least one skill for each skill category.",
      }));

    // Edit Skills api call
    setLoading(true);

    const promise = editUser({ skills: categoryAndSkillData });

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

  return (
    <StyledModal
      maxwidth={678}
      show={show}
      size="sm"
      onHide={onClose}
      centered
      $hideModal={isSkillCategorySelectModalOpen}
    >
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <EditFormWrapper>
          <div className="content flex flex-column">
            <div className="modal-title fs-28 fw-400">My Skills</div>
            <CategorySkillSelectModal
              type="CATEGORY"
              label="Skill Categories"
              labelClassName="fw-bold fs-20"
              subText={{
                content:
                  "Which of the categories listed below include the skills you want to offer on ZMZ? Select all that apply.",
                className: "fs-16",
              }}
              errorMessage={error.categories}
              formData={getCategories(categoryAndSkillData)}
              setFormData={(categories) => {
                const skills = getRelevantSkillsBasedOnCategory([
                  ...getSkills(categoryAndSkillData),
                  ...categories,
                ])
                  .filter((x) => "skills" in x)
                  .map((x) => x.skills)
                  .flat();

                setCategoryAndSkillData([...skills, ...categories]);
              }}
              isMandatory
              modalOpenCloseListener={(value) => {
                setIsSkillCategorySelectModalOpen(value);
              }}
            />
            <CategorySkillSelectModal
              type="SKILL"
              label="Add Skills"
              labelClassName="fw-bold fs-20"
              subText={{
                content:
                  "Select the freelancing skills that you intend to offer as a service on ZMZ. Include all that apply.",
                className: "fs-16",
              }}
              errorMessage={error.skills}
              categories={getCategories(categoryAndSkillData)}
              formData={getSkills(categoryAndSkillData)}
              setFormData={(skills) => {
                const categories = getCategories(categoryAndSkillData);
                setCategoryAndSkillData([...categories, ...skills]);
              }}
              noResultFoundText="No Results Found. Please Select Category first to See Skills."
              isMandatory
              modalOpenCloseListener={(value) => {
                setIsSkillCategorySelectModalOpen(value);
              }}
            />
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

export default SkillsEditModal;
