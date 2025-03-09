/*
 * This is Add / Edit educaiton modal
 */

import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { StyledFormGroup, EditFormWrapper } from './edit-modals.styled';
import { StyledModal } from 'components/styled/StyledModal';
import { StyledButton } from 'components/forms/Buttons';
import ErrorMessage from 'components/ui/ErrorMessage';
import { validateEducation } from 'helpers/validation/common';
import { getYupErrors } from 'helpers/utils/misc';
import { manageEducation } from 'helpers/http/freelancer';
import { REGEX } from 'helpers/const/regex';

const EducationEditModal = ({ show, onClose, data, onUpdate }: any) => {
  const [formState, setFormState] = useState<any>({
    degreeName: '',
    university: '',
    from: '',
    to: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data && show) {
      setFormState({
        degreeName: data?.course_name,
        university: data?.school_name,
        from: data?.education_year?.split('-')[0],
        to: data?.education_year?.split('-')[1],
      });
    } else {
      setFormState({
        degreeName: '',
        university: '',
        from: '',
        to: '',
      });
      setErrors({});
    }
  }, [data, show]);

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const validate = () => {
    validateEducation.isValid(formState).then((valid) => {
      if (!valid) {
        validateEducation
          .validate(formState, { abortEarly: false })
          .catch((err) => {
            const errors = getYupErrors(err);
            setErrors({ ...errors });
          });
      } else {
        setErrors({});
        handleUpdate();
      }
    });
  };

  const handleUpdate = () => {
    // Add / Edit education modal

    setLoading(true);
    const body: any = {
      action: data ? 'edit_education' : 'add_education',
      course_name: formState?.degreeName,
      school_name: formState?.university,
      education_year: `${formState?.from}-${formState?.to}`,
    };
    if (data) {
      body.education_id = data?.education_id;
    }
    const promise = manageEducation(body);
    toast.promise(promise, {
      loading: data
        ? 'Updating your details - please wait...'
        : 'Please wait...',
      success: (res) => {
        onUpdate();
        setLoading(false);
        return data ? res.response : res.message;
      },
      error: (err) => {
        setLoading(false);
        return (data ? err?.response : err?.message) || 'error';
      },
    });
  };

  return (
    <StyledModal maxwidth={678} show={show} size="sm" onHide={onClose} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={onClose}>
          &times;
        </Button>
        <EditFormWrapper>
          <div className="content d-flex flex-column">
            <div className="modal-title fs-28 fw-400">Education</div>
            <div className="form">
              <StyledFormGroup className="mt-0">
                <div className="fs-sm fw-400">
                  Degree Earned<span className="mandatory">&nbsp;*</span>
                </div>
                <Form.Control
                  placeholder="Enter degree name"
                  className="form-input"
                  value={formState?.degreeName}
                  onChange={(e) =>
                    handleChange(
                      'degreeName',
                      e.target.value.replace(REGEX.TITLE, '')
                    )
                  }
                  maxLength={100}
                />
                {errors?.degreeName && (
                  <ErrorMessage message={errors.degreeName} />
                )}
              </StyledFormGroup>
              <StyledFormGroup>
                <div className="fs-sm fw-400">
                  University<span className="mandatory">&nbsp;*</span>
                </div>
                <Form.Control
                  placeholder="Enter university name"
                  className="form-input"
                  value={formState?.university}
                  onChange={(e) =>
                    handleChange(
                      'university',
                      e.target.value.replace(REGEX.TITLE, '')
                    )
                  }
                  maxLength={100}
                />
                {errors?.university && (
                  <ErrorMessage message={errors.university} />
                )}
              </StyledFormGroup>
              <Row>
                <Col md={6}>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400">From (Year)</div>
                    <Form.Control
                      placeholder="Year you began the program"
                      className="form-input"
                      value={formState?.from}
                      onChange={(e) => handleChange('from', e.target.value)}
                    />
                    {errors?.from && <ErrorMessage message={errors.from} />}
                  </StyledFormGroup>
                </Col>
                <Col md={6}>
                  <StyledFormGroup>
                    <div className="fs-sm fw-400">To (Year)</div>
                    <Form.Control
                      placeholder="Year you completed the program"
                      className="form-input"
                      value={formState?.to}
                      onChange={(e) => handleChange('to', e.target.value)}
                    />
                    {errors?.to && <ErrorMessage message={errors.to} />}
                  </StyledFormGroup>
                </Col>
              </Row>
            </div>
            <div className="bottom-buttons d-flex">
              <StyledButton
                padding="1.125rem 2.25rem"
                variant="primary"
                disabled={loading}
                onClick={validate}
              >
                {data ? 'Update' : 'Add'}
              </StyledButton>
            </div>
          </div>
        </EditFormWrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default EducationEditModal;
