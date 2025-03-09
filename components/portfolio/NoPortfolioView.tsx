import { ReactComponent as NoPortfolio } from 'assets/icons/no-portfolio.svg';
import { StyledButton } from 'components/forms/Buttons';

const NoPortfolioView = ({
  onAddProject,
  allowEdit,
}: {
  onAddProject: () => void;
  allowEdit: boolean;
}) => {
  return (
    <div className="my-5 d-flex flex-column justify-content-center align-items-center gap-5">
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
