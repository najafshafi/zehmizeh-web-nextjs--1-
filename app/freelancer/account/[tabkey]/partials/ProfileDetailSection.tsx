/*
 * This component is a skeleton for the different sections in profile - freelancer side,
  which will have title and add/edit icon at top
 */
import styled from "styled-components";
import EditIcon from "@/public/icons/edit-blue-outline.svg";
import DeleteIcon from "@/public/icons/trash.svg";

const ProfileDetailSectionStyled = styled.div<{
  $fullwidth?: boolean;
  $isrequired?: boolean;
}>`
  background: rgba(255, 255, 255, 0.7);
  height: 100%;
  padding: 2rem;
  border-radius: 0.875rem;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.05);
  border: ${(props) => (props?.$isrequired ? "1px solid #888" : "")};
  .button {
    transition: all 0.2s ease-in-out;
    &:hover {
      transform: translateY(-2px);
    }
  }
  .about-me {
    line-height: 2.25em;
  }
  .description {
    color: #595959;
    line-height: 180%;
  }
  .skills {
    gap: 10px;
  }
  .education-details {
    gap: 1.375rem;
  }
  .course-name {
    line-height: 1.6rem;
  }
  .education-description {
    opacity: 0.7;
    margin-top: 10px;
    line-height: 1.44rem;
  }
  .education-school-img {
    height: 92px;
    width: 92px;
  }
  .view-more-btn {
    color: ${(props) => props.theme.colors.lightBlue};
  }
  .add-btn {
    color: ${(props) => props.theme.colors.lightBlue};
  }
  .delete-btn {
    margin-top: 0.75rem;
  }
  .portfolio {
    color: ${(props) => props.theme.colors.yellow};
  }
  .list {
    max-height: 300px;
    overflow-y: auto;
  }
`;

const RequiredTag = styled.div`
  width: fit-content;
  position: relative;
  padding: 0.35rem 1.5rem;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #808080;
  background: #efefef;
`;

const ProfileDetailSection = ({
  title,
  details,
  fullwidth,
  onEdit,
  add,
  onDelete,
  deleteOption,
  edit = true,
  isrequired,
  stripeStatus,
}: {
  title: React.ReactNode;
  details?: React.ReactNode;
  fullwidth?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteOption?: boolean;
  add?: boolean;
  edit?: boolean;
  isrequired?: boolean;
  stripeStatus?: string;
}) => {
  return (
    <ProfileDetailSectionStyled
      $fullwidth={fullwidth}
      className={`flex flex-col gap-3 ${
        stripeStatus === "pending"
          ? "stripe-pending"
          : stripeStatus === "inprogress"
            ? "stripe-inprogress"
            : "stripe-verified"
      }`}
      $isrequired={isrequired}
    >
      <div className="flex items-center justify-between">
        <div className="fs-24 font-normal">{title}</div>
        <div className="flex items-center gap-2">
          {isrequired && <RequiredTag>Required</RequiredTag>}
          {add ? (
            <div
              className="button add-btn cursor-pointer fs-1rem font-normal"
              onClick={onEdit}
            >
              Add
            </div>
          ) : edit ? (
            <EditIcon className="cursor-pointer" onClick={onEdit} />
          ) : null}
          {deleteOption && (
            <DeleteIcon className="cursor-pointer" onClick={onDelete} />
          )}
        </div>
      </div>
      {details}
    </ProfileDetailSectionStyled>
  );
};

export default ProfileDetailSection;
