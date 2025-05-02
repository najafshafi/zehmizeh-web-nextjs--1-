import NoPortfolio from "@/public/icons/no-portfolio.svg";
import CustomButton from "../custombutton/CustomButton";

const NoPortfolioView = ({
  onAddProject,
  allowEdit,
}: {
  onAddProject: () => void;
  allowEdit: boolean;
}) => {
  return (
    <div className="my-5 flex flex-col justify-center items-center gap-5">
      <NoPortfolio />

      {allowEdit && (
        <div>
          <CustomButton
            text="Add Portfolio Album"
            className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={onAddProject}
          />
        </div>
      )}
    </div>
  );
};

export default NoPortfolioView;
