import { StyledButton } from '@/components/forms/Buttons';
import Checkbox from '@/components/forms/CheckBox';
import LoadingButtons from '@/components/LoadingButtons';
import { useAuth } from '@/helpers/contexts/auth-context';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { TRegisterProps } from '../types/commonProp';

type Props = {
  payload: Partial<IFreelancerDetails>;
} & TRegisterProps;

const RegistrationCheckboxes = ({ shouldShow, payload, setStep }: Props) => {
  const { submitRegisterUser, isLoading } = useAuth();

  const [termsChecked, setTermsChecked] = useState<boolean>(false);
  const [isAllBoxesChecked, setIsAllBoxesChecked] = useState(false);

  const [checked, setChecked] = useState({
    box1: false,
    box2: false,
    box3: false,
  });

  const toggleCheckBoxHandler = (key: string) => {
    setChecked({ ...checked, [key]: !checked[key] });
  };

  useEffect(() => {
    setIsAllBoxesChecked(!Object.values(checked).includes(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  const handleSubmit = () => {
    if (!termsChecked) {
      toast.error("Accept 'Terms & Conditions' to continue.");
      return;
    }

    if (!isAllBoxesChecked) {
      toast.error('Users must agree to all Terms and acknowledgments to register.');
      return;
    }

    submitRegisterUser(payload);
  };

  if (!shouldShow) return <></>;

  return (
    <div>
      <div className="d-flex align-items-center mt-4">
        <Checkbox checked={termsChecked} toggle={() => setTermsChecked((prev) => !prev)} />
        <span className="ms-2">
          I agree to all of ZehMizeh’s
          <Link className="yellow-link" to="/terms-of-service" target="_blank">
            {' '}
            Terms & Conditions.
          </Link>
        </span>
      </div>

      <div className="d-flex align-items-center mt-4">
        <Checkbox toggle={() => toggleCheckBoxHandler('box1')} checked={checked.box1} />
        <span className="ms-2">
          I am aware that ZMZ is intended for hiring freelancers to complete projects and not as a job portal for hiring
          permanent employees.
        </span>
      </div>

      <div className="d-flex align-items-center mt-4">
        <Checkbox toggle={() => toggleCheckBoxHandler('box2')} checked={checked.box2} />
        <span className="ms-2">
          I understand that the work on ZMZ <b>must be deliverable online </b>
          and that ZMZ does not platform work that would require users to meet in person.
        </span>
      </div>

      <div className="d-flex align-items-center mt-4">
        <Checkbox toggle={() => toggleCheckBoxHandler('box3')} checked={checked.box3} />
        <span className="ms-2">
          I understand that payment for projects found on ZMZ <b>must be made through ZMZ’s payment system</b> and that
          payment through any other method constitutes theft from the company (a violation of our Terms of Service and
          Halacha).
        </span>
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
        <StyledButton disabled={isLoading} variant="secondary" onClick={() => setStep(2)}>
          Back
        </StyledButton>
        <StyledButton disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? <LoadingButtons /> : 'Submit'}
        </StyledButton>
      </div>
      {/* END ------------------------------------------- Footer */}
      {/* recaptcha removed after this commit f281e64690f49d3f37d41c5fbee8765ca3551d3e */}
    </div>
  );
};

export default RegistrationCheckboxes;
