import { StyledModal } from '@/components/styled/StyledModal';
import { Modal, Button } from 'react-bootstrap';
import { IDENTITY_DOCS } from '@/helpers/const/constants';

const StripeAcceptableIDList = ({ show, toggle, country }: any) => {
  return (
    <StyledModal onHide={toggle} show={show} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <h4 className="fs-36 fw-700">Acceptable ID Documents include:</h4>
        <div>
          <ul className="ps-3 mt-1">
            {country &&
              IDENTITY_DOCS?.[country] &&
              IDENTITY_DOCS?.[country].map((item, index) => (
                <li className="mt-1" key={index}>
                  {item}
                </li>
              ))}
          </ul>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default StripeAcceptableIDList;
