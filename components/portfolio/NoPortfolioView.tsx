import NoPortfolio from "@/public/icons/no-portfolio.svg";
import { StyledButton } from "@/components/forms/Buttons";

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
          <StyledButton onClick={onAddProject}>
            Add Portfolio Album
          </StyledButton>
        </div>
      )}
    </div>
  );
};

export default NoPortfolioView;
