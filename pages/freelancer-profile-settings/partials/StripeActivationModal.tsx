import { StyledButton } from '@/components/forms/Buttons';
import Checkbox from '@/components/forms/Checkbox';
import CountryDropdown from '@/components/forms/country-dropdown/CountryDropdown';
import { StyledModal } from '@/components/styled/StyledModal';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { IDENTITY_DOCS } from '@/helpers/const/constants';

const A = styled.a`
  color: ${(props) => props.theme.colors.lightBlue};
`;

const StripeActivationModal = ({ onVerify, step, setStep }: any) => {
  const [check, setCheck] = useState(false);
  const [checkErr, setCheckErr] = useState(false);
  const [countryErr, setCountryErr] = useState(false);
  const [currIndex, setCurrIndex] = useState(step - 1);
  const [country, setCountry] = useState<any>();
  const modalContent = [
    {
      id: 1,
      title: 'Getting Paid on ZMZ',
      content: (
        <div>
          <p>
            To get paid on ZehMizeh, all freelancers have to register for an
            account with our payment processing service,{' '}
            <A href="https://stripe.com/" target="_blank">
              Stripe
            </A>
            . They do the work of transporting the freelancers' fees, crossing
            country borders, and delivering precisely according to your
            country's banking customs.
          </p>
          <p>
            <b>If you are from Israel, or any non-American country</b>- you can
            still get paid on ZehMizeh! While the normal Stripe account may not
            be available in your country, all ZehMizeh users can get paid
            through the special partnership we have with Stripe.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Preferred Banking Country',
      content: (
        <div>
          <p>
            Before registering for Stripe, you have to decide:
            <b> where would you like your payments to arrive?</b>
          </p>
          <p>
            You can have your payments sent to a country you’re not living in,
            as long as:
            <ol>
              <li className="mt-1">
                It’s an approved ZehMizeh country (listed in the options below)
              </li>
              <li className="mt-1">You have a bank account there.</li>
            </ol>
          </p>
          <p>
            Select below the country <b>of the bank account</b> where you would
            like your payments to be sent. (If that's the country you live in,
            select that country.){' '}
            <b className="text-danger">This choice cannot be changed later.</b>
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: 'How to Register',
      content: (
        <div>
          <p>
            Stripe will verify user info in phases, asking for and verifying
            information up to three times. They’ll be asking for basic
            information, like:
          </p>
          <ul>
            <li className="mt-1">Name</li>
            <li className="mt-1">Birthdate</li>
            {country?.country_short_name &&
              country?.country_short_name == 'US' && (
                <span>
                  <li className="mt-1">Address</li>
                  <li className="mt-1">Phone Number</li>
                  <li className="mt-1">
                    Last 4 Digits of your SSN or Identity document
                  </li>
                </span>
              )}
            <li className="mt-1">Bank Account Details</li>
          </ul>
          <p>
            Most important is your <b>proof of identity document</b>, a
            government-issued document that matches the information you've
            entered. This is essential for verification purposes.
          </p>
          <div>Your Preferred Banking Country is: {country?.country_name}</div>
          <div>Acceptable ID Documents include:</div>
          <ul>
            {country?.country_short_name &&
              IDENTITY_DOCS?.[country?.country_short_name] &&
              IDENTITY_DOCS?.[country?.country_short_name].map(
                (item, index) => (
                  <li className="mt-1" key={index}>
                    {item}
                  </li>
                )
              )}
          </ul>
          For more details, please click{' '}
          <span>
            {country?.country_short_name && (
              <a
                href={`https://docs.stripe.com/acceptable-verification-documents?country=${country.country_short_name}`}
                className="text-primary"
                target="_blank"
                rel="noreferrer"
              >
                {' '}
                (here) .
              </a>
            )}
          </span>
        </div>
      ),
    },
    {
      id: 4,
      title: "If you don't have texting on your phone...",
      content: (
        <div>
          <p>
            Stripe requires users to have access to texting to verify their
            identity. There is no way around this in their design.
          </p>
          <p>
            This is only necessary for registration, so we recommend that users
            without texting temporarily borrow the phone number of a friend with
            texting. Once you have your ID Document in hand, the whole
            registration should be simple to complete in one sitting, without
            having to borrow the phone number again.
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => setCurrIndex(step - 1), [step]);

  const onHide = () => {
    setStep();
    setCountry('');
    setCheckErr(false);
  };
  return (
    <StyledModal onHide={() => onHide()} show={!step ? false : true}>
      <Modal.Body>
        <Button
          variant="transparent"
          className="close"
          onClick={() => onHide()}
        >
          &times;
        </Button>
        <div className="text-end">
          {step}/{modalContent.length}
        </div>
        <h3
          className="fw-700 mb-3"
          style={{ fontSize: '2rem', padding: '0.5rem 0' }}
        >
          {modalContent[currIndex]?.title}
        </h3>
        <div>{modalContent[currIndex]?.content}</div>

        {/* Actions for Step 1 */}
        {step === 1 && (
          <div className="pt-2">
            <StyledButton onClick={() => setStep((prev: any) => prev + 1)}>
              Next
            </StyledButton>
          </div>
        )}

        {/* Actions for step 2 */}
        {step === 2 && (
          <>
            <div className="pt-3">
              <p className="mb-2">
                Preferred Banking Country
                <span className="mandatory">&nbsp;*</span>
              </p>
              <CountryDropdown
                placeholder="Enter the country that your payments will be sent to"
                selectedCountry={country}
                onSelectCountry={(item: any) => setCountry(item)}
              />
              {countryErr && !country && (
                <p className="text-danger">This field is required</p>
              )}
            </div>
            <div className="mt-4">
              <StyledButton
                style={{ marginRight: '20px' }}
                onClick={() => setStep((prev: any) => prev - 1)}
              >
                Previous
              </StyledButton>
              <StyledButton
                onClick={() => {
                  setCountryErr(true);
                  if (country) setStep((prev: any) => prev + 1);
                }}
              >
                Next
              </StyledButton>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="d-flex align-items-center mt-4">
              <Checkbox
                checked={check}
                toggle={(e) => setCheck(e.target.checked)}
              />
              <span>
                &nbsp;&nbsp; I have read these instructions and I understand.{' '}
              </span>
            </div>
            {checkErr && !check && (
              <p className="text-danger">
                <small>Please confirm that the instructions are read.</small>
              </p>
            )}
            <div className="mt-4">
              <StyledButton
                style={{ marginRight: '20px' }}
                onClick={() => setStep((prev: any) => prev - 1)}
              >
                Previous
              </StyledButton>
              <StyledButton
                onClick={() => {
                  setCheckErr(true);
                  if (check) setStep((prev: any) => prev + 1);
                }}
              >
                Next
              </StyledButton>
            </div>
          </>
        )}

        {/* Actions for Step 4 */}
        {step === 4 && (
          <div className="mt-4">
            <StyledButton
              style={{ marginRight: '20px' }}
              onClick={() => setStep((prev: any) => prev - 1)}
            >
              Previous
            </StyledButton>
            <StyledButton
              onClick={() => {
                if (check && country) onVerify ? onVerify(country) : '';
              }}
            >
              Continue to Stripe Registration
            </StyledButton>
          </div>
        )}
      </Modal.Body>
    </StyledModal>
  );
};

export default StripeActivationModal;
