import { useNavigate } from 'react-router-dom';
import BackArrow from "../../public/icons/back-arrow.svg";
import { goBack } from '@/helpers/utils/goBack';

type Props = {
  className?: string;
  children?: React.ReactNode;
  onBack?: () => void;
  route?: string;
};

const BackButton = ({ className, children, onBack, route }: Props) => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack(navigate, route);
    }
  };

  return (
    <div className={`${className ? className : ''} d-flex`}>
      <div
        className="d-flex back-button d-flex align-items-center pointer"
        onClick={handleGoBack}
      >
        <BackArrow /> &nbsp;<span className="fs-18 fw-400">Back</span>
        {children}
      </div>
    </div>
  );
};

export default BackButton;
