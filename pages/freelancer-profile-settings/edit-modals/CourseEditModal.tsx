/*
 * This is Add / Edit course modal
 */

"use client";
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { StyledFormGroup, EditFormWrapper } from './edit-modals.styled';
import { StyledModal } from '@/components/styled/StyledModal';
import { StyledButton } from '@/components/forms/Buttons';
import ErrorMessage from '@/components/ui/ErrorMessage';
import CustomUploader from '@/components/ui/CustomUploader';
import { validateCourse } from '@/helpers/validation/common';
import { getYupErrors } from '@/helpers/utils/misc';
import { manageCourse } from '@/helpers/http/freelancer';
import { REGEX } from '@/helpers/const/regex';

const CourseEditModal = ({ show, onClose, data, onUpdate }: any) => {
  const [formState, setFormState] = useState<{
    course_name: string;
    school_name: string;
    certificate_link: { fileUrl?: string; fileName?: string }[];
  }>({
    course_name: '',
    school_name: '',
    certificate_link: [],
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (data && show) {
      setFormState({
        course_name: data?.course_name,
        school_name: data?.school_name,
        certificate_link: data?.certificate_link
          ? [{ fileUrl: data?.certificate_link }]
          : [],
      });
    } else {
      setFormState({
        course_name: '',
        school_name: '',
        certificate_link: [],
      });
      setErrors({});
    }
  }, [data, show]);

  const handleChange = useCallback((field, value) => {
    setFormState((prevFormState: any) => {
      return { ...prevFormState, [field]: value };
    });
  }, []);

  const handleUploadImage = ({
    file,
    fileName,
  }: {
    file: string;
    fileName?: string;
  }) => {
    handleChange('certificate_link', [{ fileUrl: file, fileName }]);
  };

  const removeAttachment = () => {
    handleChange('certificate_link', []);
  };

  const validate = () => {
    validateCourse.isValid(formState).then((valid) => {
      if (!valid) {
        validateCourse
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
    /* Add / Edit course api call */

    setLoading(true);
    const body: any = {
      action: data ? 'edit_course' : 'add_course',
      course_name: formState?.course_name,
      school_name: formState?.school_name,
      certificate_link:
        formState?.certificate_link?.length > 0
          ? formState?.certificate_link[0]?.fileUrl
          : '',
    };
    if (data) {
      body.course_id = data?.course_id;
    }
    const promise = manageCourse(body);
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
            <div className="modal-title fs-28 fw-400">
              Courses / Certifications
            </div>
            <div className="form">
              <StyledFormGroup className="mt-0">
                <div className="fs-sm fw-400">
                  Course / Certificate Name
                  <span className="mandatory">&nbsp;*</span>
                </div>
                <Form.Control
                  placeholder="Enter course / certificate name"
                  className="form-input"
                  value={formState?.course_name}
                  onChange={(e) =>
                    handleChange(
                      'course_name',
                      e.target.value.replace(REGEX.TITLE, '')
                    )
                  }
                  maxLength={100}
                />
                {errors?.course_name && (
                  <ErrorMessage message={errors.course_name} />
                )}
              </StyledFormGroup>
              <StyledFormGroup>
                <div className="fs-sm fw-400">
                  Certifying Institution / College:
                  <span className="mandatory">&nbsp;*</span>
                </div>
                <Form.Control
                  placeholder="Where did you complete your course or receive your certificate from?"
                  className="form-input"
                  value={formState?.school_name}
                  onChange={(e) =>
                    handleChange(
                      'school_name',
                      e.target.value.replace(REGEX.TITLE, '')
                    )
                  }
                  maxLength={100}
                />
                {errors?.school_name && (
                  <ErrorMessage message={errors.school_name} />
                )}
              </StyledFormGroup>
              <Row>
                <Col md={12}>
                  <StyledFormGroup>
                    <CustomUploader
                      handleUploadImage={handleUploadImage}
                      attachments={
                        formState?.certificate_link
                          ? formState?.certificate_link
                          : []
                      }
                      removeAttachment={removeAttachment}
                      suggestions="File type: PDF, JPG, PNG, JPEG"
                      placeholder="Upload certificate"
                      acceptedFormats="image/*, .pdf"
                    />
                    {errors?.certificate_link && (
                      <ErrorMessage message={errors.certificate_link} />
                    )}
                  </StyledFormGroup>
                  {/* <StyledFormGroup>
                    <div className="fs-sm fw-400">
                      Enter link to Certificate
                    </div>
                    <Form.Control
                      placeholder={'Enter link to Certificate'}
                      className="form-input"
                      value={formState?.certificate_link}
                      onChange={(e) =>
                        handleChange('certificate_link', e.target.value)
                      }
                    />
                    {errors?.certificate_link && (
                      <ErrorMessage message={errors.certificate_link} />
                    )}
                  </StyledFormGroup> */}
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

export default CourseEditModal;
