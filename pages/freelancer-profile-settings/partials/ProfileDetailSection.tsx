/*
 * This component is a skeleton for the different sections in profile - freelancer side,
 * which will have title and add/edit icon at top
 */
import EditIcon from '../../public/icons/edit-blue-outline.svg';
import DeleteIcon from '../../public/icons/trash.svg';

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
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <div 
        className={`
          flex flex-col gap-3 bg-white/70 h-full p-6 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.05)]
          ${isRequired ? 'border border-gray-500' : ''}
          ${stripeStatus === 'pending' ? 'stripe-pending' : ''}
          ${stripeStatus === 'inprogress' ? 'stripe-inprogress' : ''}
          ${stripeStatus === 'stripe-verified' ? 'stripe-verified' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="text-2xl font-normal">{title}</div>
          <div className="flex items-center gap-2">
            {isRequired && (
              <div className="w-fit px-6 py-1.5 rounded-md text-[13px] font-medium uppercase flex items-center justify-center text-gray-500 bg-gray-100">
                Required
              </div>
            )}
            {add ? (
              <div
                className="transition-all duration-200 ease-in-out hover:-translate-y-0.5 text-blue-300 cursor-pointer text-base font-normal"
                onClick={onEdit}
              >
                Add
              </div>
            ) : edit ? (
              <EditIcon 
                className="transition-all duration-200 ease-in-out hover:-translate-y-0.5 cursor-pointer" 
                onClick={onEdit} 
              />
            ) : null}
            {deleteOption && (
              <DeleteIcon 
                className="transition-all duration-200 ease-in-out hover:-translate-y-0.5 cursor-pointer" 
                onClick={onDelete} 
              />
            )}
          </div>
        </div>
        {details}
      </div>
    </div>
  );
};

// Example usage of the nested classes:
/*
<div className="about-me leading-9" />
<div className="description text-[#595959] leading-[180%]" />
<div className="skills flex gap-2.5" />
<div className="education-details flex flex-col gap-5" />
<div className="course-name leading-6" />
<div className="education-description opacity-70 mt-2.5 leading-5" />
<img className="education-school-img h-[92px] w-[92px]" />
<div className="view-more-btn text-blue-300" />
<div className="delete-btn mt-3" />
<div className="portfolio text-yellow-400" />
<div className="list max-h-[300px] overflow-y-auto" />
*/

export default ProfileDetailSection;