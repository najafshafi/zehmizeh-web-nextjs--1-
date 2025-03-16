import { StyledButton } from '@/components/forms/Buttons';
import { StyledModal } from '@/components/styled/StyledModal';
import Image from 'next/image';
import { Button, Modal } from 'react-bootstrap';
import styled from 'styled-components';

const InvoiceBody = styled.div`
  padding: 1rem;
`;

function InvoiceModal({ show, onClose }: any) {
  return (
    <StyledModal show={show} maxWidth={1000} onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <div>
          <div className="content flex flex-col">
            <div className="modal-title text-[28px] font-normal">Invoice</div>
            <InvoiceBody id="invoice">
              <header className="flex justify-between">
                <div>
                  John Smith <br />
                  john@gmail.com <br />
                  LA, USA
                </div>
                <figure>
                  <Image src="/logo.svg" alt="logo" width={100} height={100} />
                </figure>
              </header>
            </InvoiceBody>

            <div className="bottom-buttons flex">
              <StyledButton
                padding="1.125rem 2.25rem"
                variant="primary"
                // disabled={loading}
                // onClick={handleUpdate}
              >
                Download
              </StyledButton>
            </div>
          </div>
        </div>
      </Modal.Body>
    </StyledModal>
  );
}

export default InvoiceModal;
