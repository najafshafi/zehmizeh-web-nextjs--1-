// /*
//  * This component is a skeleton for the different sections in profile - freelancer side,
//  * which will have title and add/edit icon at top
//  */
// import Image from 'next/image';
// import EditIcon from '../../../public/icons/edit-blue-outline.svg';
// import DeleteIcon from '../../../public/icons/trash.svg';

// const ProfileDetailSection = ({
//   title,
//   details,
//   fullWidth = false,
//   onEdit,
//   add,
//   onDelete,
//   deleteOption,
//   edit = true,
//   isRequired = false,
//   stripeStatus,
// }: {
//   title: React.ReactNode;
//   details?: React.ReactNode;
//   fullWidth?: boolean;
//   onEdit?: () => void;
//   onDelete?: () => void;
//   deleteOption?: boolean;
//   add?: boolean;
//   edit?: boolean;
//   isRequired?: boolean;
//   stripeStatus?: string;
// }) => {
//   return (
//     <div className={`${fullWidth ? 'w-full' : ''}`}>
//       <div
//         className={`
//           flex flex-col gap-3 bg-white/70 h-full p-6 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.05)]
//           ${isRequired ? 'border border-gray-500' : ''}
//           ${stripeStatus === 'pending' ? 'stripe-pending' : ''}
//           ${stripeStatus === 'inprogress' ? 'stripe-inprogress' : ''}
//           ${stripeStatus === 'stripe-verified' ? 'stripe-verified' : ''}
//         `}
//       >
//         <div className="flex items-center justify-between">
//           <div className="text-2xl font-normal">{title}</div>
//           <div className="flex items-center gap-2">
//             {isRequired && (
//               <div className="w-fit px-6 py-1.5 rounded-md text-[13px] font-medium uppercase flex items-center justify-center text-gray-500 bg-gray-100">
//                 Required
//               </div>
//             )}
//             {add ? (
//               <div>
//                 <div
//                   className="text-blue-300 cursor-pointer text-base font-normal"
//                   onClick={onEdit}
//                 >
//                   Add
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <Image
//                   src={EditIcon}
//                   alt="Edit Icon"
//                   className="cursor-pointer"
//                   onClick={onEdit}
//                 />
//                 <Image
//                   src={DeleteIcon}
//                   alt="Delete Icon"
//                   className="cursor-pointer"
//                   onClick={onDelete}
//                 />
//               </>
//             )}
//           </div>
//         </div>
//         {details}
//       </div>
//     </div>
//   );
// };

// // Example usage of the nested classes:
// /*
// <div className="about-me leading-9" />
// <div className="description text-[#595959] leading-[180%]" />
// <div className="skills flex gap-2.5" />
// <div className="education-details flex flex-col gap-5" />
// <div className="course-name leading-6" />
// <div className="education-description opacity-70 mt-2.5 leading-5" />
// <img className="education-school-img h-[92px] w-[92px]" />
// <div className="view-more-btn text-blue-300" />
// <div className="delete-btn mt-3" />
// <div className="portfolio text-yellow-400" />
// <div className="list max-h-[300px] overflow-y-auto" />
// */

// export default ProfileDetailSection;

/*
 * This component is a skeleton for the different sections in profile - freelancer side,
  which will have title and add/edit icon at top
 */
import styled from "styled-components";
import EditIcon from "../../../public/icons/edit-blue-outline.svg";
import DeleteIcon from "../../../public/icons/trash.svg";
import Image from "next/image";

const ProfileDetailSectionStyled = styled.div<{
  fullWidth: boolean;
  isRequired?: boolean;
}>`
  background: rgba(255, 255, 255, 0.7);
  height: 100%;
  padding: 2rem;
  border-radius: 0.875rem;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.05);
  border: ${(props) => (props?.isRequired ? "1px solid #888" : "")};
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
  fullWidth = false,
  onEdit,
  add,
  onDelete,
  deleteOption,
  edit = true,
  isRequired = false,
  stripeStatus,
}: {
  title: React.ReactNode;
  details?: React.ReactNode;
  fullWidth?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteOption?: boolean;
  add?: boolean;
  edit?: boolean;
  isRequired?: boolean;
  stripeStatus?: string;
}) => {
  return (
    // <div>
    <ProfileDetailSectionStyled
      fullWidth={fullWidth}
      className={`flex flex-col gap-3 ${
        stripeStatus === "pending"
          ? "stripe-pending"
          : stripeStatus === "inprogress"
          ? "stripe-inprogress"
          : "stripe-verified"
      }`}
      isRequired={isRequired}
    >
      <div className="flex items-center justify-between">
        <div className="fs-24 fw-400">{title}</div>
        <div className="flex items-center gap-2">
          {isRequired && <RequiredTag>Required</RequiredTag>}
          {add ? (
            <div
              className="button add-btn pointer fs-1rem fw-400"
              onClick={onEdit}
            >
              Add
            </div>
          ) : edit ? (
            <Image
              src={EditIcon}
              alt="Edit Icon"
              className="cursor-pointer"
              onClick={onEdit}
            />
          ) : null}
          {deleteOption && (
            <Image
              src={DeleteIcon}
              alt="Delete Icon"
              className="cursor-pointer"
              onClick={onDelete}
            />
          )}
        </div>
      </div>
      {details}
    </ProfileDetailSectionStyled>
    // </div>
  );
};

export default ProfileDetailSection;
