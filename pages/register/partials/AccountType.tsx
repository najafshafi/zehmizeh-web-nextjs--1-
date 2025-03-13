import { Link, useParams } from 'react-router-dom';
import css from 'classnames';
import { StyledButton } from '@/components/forms/Buttons';
import { TRegisterProps } from '../types/commonProp';

type Props = TRegisterProps;

export const AccountType = ({ shouldShow, setStep }: Props) => {
  const { userType } = useParams();
  const isClient = userType === 'employer';

  if (!shouldShow) return <></>;

  return (
    <div>
      <h1>Welcome! First things first:</h1>
      <h3>What type of ZehMizeh account would you like to open?</h3>
      <p>
        If you would like to post projects and hire freelancers, continue with a Client account. If you would like to be
        hired and paid for your work, continue with a Freelancer account.
      </p>
      <div>
        <div className="d-flex mt-4 planing flex-wrap gap-md-4 gap-3">
          <Link
            to="/register/employer"
            replace={true}
            className={css('text-start d-flex align-items-center justify-content-center option-button', {
              'active-button': isClient,
            })}
          >
            <span>Client - I Want to Hire Freelancers</span>
          </Link>

          <Link
            to="/register/freelancer"
            className={css('text-start d-flex align-items-center justify-content-center option-button', {
              'active-button': !isClient,
            })}
            replace={true}
          >
            <span>Freelancer - I Want to Be Hired</span>
          </Link>
        </div>
      </div>

      {/* START ----------------------------------------- Footer */}
      <div className="text-center my-3 mt-4">
        <br />
        <h4 className="align-self-center">
          Already have an account?{' '}
          <Link to="/login" className="yellow-link">
            Log in
          </Link>
        </h4>
      </div>
      <div className="d-flex flex-row justify-content-between">
        <div></div>
        <StyledButton onClick={() => setStep(2)}>Next</StyledButton>
      </div>
      {/* END ------------------------------------------- Footer */}
    </div>
  );
};
