import { StyledModal } from 'components/styled/StyledModal';
import { Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HowToRegisterAccModal = ({ show, toggle }: any) => {
  return (
    <StyledModal onHide={toggle} show={show}>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <h4 className="fs-36 fw-700">How to Register</h4>
        <div style={{ fontSize: '18px' }}>
          <p>
            All freelancers need to register with Stripe to be paid on ZehMizeh.
            Here’s what you need to know:
          </p>
          <p>
            <ol>
              <li className="mt-1">
                <b>No matter where you live</b> - you can get paid with Stripe
                on ZehMizeh.
              </li>
              <li className="mt-1">
                You can have your payments sent to a country that you don’t live
                in, as long as:
                <ol type="a">
                  <li>It’s an approved ZMZ country.</li>
                  <li>You have a bank account there.</li>
                </ol>
              </li>
              <li className="mt-1">
                Stripe will require you to upload a legal ID document to verify
                your identity. The documents that are accepted will depend on
                what country you’re from.
              </li>
              <li className="mt-1">
                You will need a phone that receives text to finish signing up
                for Stripe. You can borrow a phone for this.
              </li>
            </ol>
          </p>
          <p>
            For more details, visit out Help Center (by clicking the yellow icon
            in the bottom-right) or submit an inquiry -
            <Link className="text-primary" to={'/support'}>
              {' '}
              here.
            </Link>
          </p>
        </div>
      </Modal.Body>
    </StyledModal>
  );
};

export default HowToRegisterAccModal;
