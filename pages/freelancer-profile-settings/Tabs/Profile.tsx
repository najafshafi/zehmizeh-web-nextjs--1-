import { useEffect, useState } from 'react';
import Tooltip from '@/components/ui/Tooltip';
import { Col, Row, Spinner } from 'react-bootstrap';
import ProfileDetailSection from '../partials/ProfileDetailSection';
import StyledHtmlText from '@/components/ui/StyledHtmlText';
import { useQueryData, useRefetch } from '@/helpers/hooks/useQueryData';
import { convertToTitleCase } from '@/helpers/utils/misc';
import styled from 'styled-components';
import EditIcon from '../../../public/icons/edit-blue-outline.svg';
import DeleteIcon from "../../../public/icons/trash.svg";
import cns from 'classnames';
import toast from 'react-hot-toast';
import { manageCourse, manageEducation } from '@/helpers/http/freelancer';
import HeadlineEditModal from '@/pages/freelancer-profile-settings/edit-modals/headlineEditModal';
import AboutUsEditModal from '@/pages/freelancer-profile-settings/edit-modals/AboutUsEditModal';
import SkillsEditModal from '@/pages/freelancer-profile-settings/edit-modals/SkillsEditModal';
import LanguagesEditModal from '@/pages/freelancer-profile-settings/edit-modals/LanguagesEditModal';
import EducationEditModal from '@/pages/freelancer-profile-settings/edit-modals/EducationEditModal';
import CourseEditModal from '@/pages/freelancer-profile-settings/edit-modals/CourseEditModal';
import ProfileBanner from '../partials/ProfileBanner';
import { queryKeys } from '@/helpers/const/queryKeys';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getSkills } from '@/helpers/utils/helper';
import Image from 'next/image';

const Wrapper = styled.div`
  .col-lg-6,
  .col-lg-12 {
    margin-bottom: 2rem;
  }
`;

const SkillItem = styled.div`
  padding: 0.625rem 0.75rem;
  background: #f6f6f6;
  border-radius: 0.5rem;
  text-transform: capitalize;
`;

const EducationItem = styled.div`
  border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
  border-radius: 0.875rem;
  .education-content {
    word-break: break-word;
  }
`;

export const Profile = () => {
  const { data } = useQueryData<IFreelancerDetails>(
    queryKeys.getFreelancerProfile
  );
  const { refetch } = useRefetch(queryKeys.getFreelancerProfile);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedEducationId, setSelectedEducationId] = useState<string>('');
  const [categories, setCategories] = useState<any[]>([]);
  const [editModalType, setEditModalType] = useState<{
    modal: string;
    data?: any;
  }>({ modal: '' });

  const [searchParams] = useSearchParams();
  const tab: string = (searchParams.get('openModal') || '').toLowerCase();

  // open popup when user click from "Profile [X] Complete" button
  useEffect(() => {
    if (tab) setEditModalType({ modal: tab });
  }, [tab]);

  const onUpdate = () => {
    /*
     * This funciton will be called after anything is edited / added
     * This will close the modal and refetch the profile
     */
    setEditModalType({ modal: '' });
    refetch();
  };

  const onDeleteEducation = (id: string) => {
    /* Delete education api call */

    setSelectedEducationId(id);
    const body: any = {
      action: 'delete_education',
      education_id: id,
    };

    const promise = manageEducation(body);

    toast.promise(promise, {
      loading: 'Please wait...',
      success: (res: any) => {
        onUpdate();
        setSelectedEducationId('');
        return data ? res.response : res.message;
      },
      error: (err:any) => {
        setSelectedEducationId('');
        return (data ? err?.response : err?.message) || 'error';
      },
    });
  };

  const openCertificate = (link: any) => {
    // This function will open the certificate link
    if (link) {
      window.open(link, 'blank');
    }
  };

  const onDeleteCourse = (id: string) => {
    /* Delete course api call */

    setSelectedCourseId(id);
    const body: any = {
      action: 'delete_course',
      course_id: id,
    };

    const promise = manageCourse(body);

    toast.promise(promise, {
      loading: 'Please wait...',
      success: (res: any) => {
        onUpdate();
        setSelectedCourseId('');
        return data ? res.response : res.message;
      },
      error: (err) => {
        setSelectedCourseId('');
        return (data ? err?.response : err?.message) || 'error';
      },
    });
  };

  const getCategoryHandler = () => {
    let categories: any[] = [];

    data?.skills?.forEach(({ category_name }: { category_name: string }) => {
      if (category_name && !categories.includes(category_name))
        categories.push(category_name);
    });

    categories = categories.map((catName) => {
      const catObj = data?.skills?.filter(
        (skill: any) => skill.category_name === catName
      )[0];
      return catObj;
    });

    setCategories(categories);
  };
  useEffect(() => {
    getCategoryHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Wrapper>
      <Row>
        <Col lg="12">
          <ProfileBanner data={data} refetch={refetch} />
        </Col>
        <Col lg="12">
          {/* START ----------------------------------------- Headline */}
          <ProfileDetailSection
            onEdit={() => setEditModalType({ modal: 'headline' })}
            isRequired={!data?.job_title}
            title={
              <div className="d-flex align-items-center gap-2">
                Headline
                <Tooltip>
                  <div>
                    <p>
                      Your headline is meant to be the space where you can
                      introduce what you do professionally. When clients are
                      doing a freelancer search, they&apos;ll see it displayed just
                      below your name as a sort of personal subtitle or tagline.
                    </p>
                    <p>
                      The simplest ways to introduce yourself would be to name
                      your project title, (“Ghostwriter” or “Accountant”). You
                      could list your main freelancing skills, (“Photoshop |
                      Adobe | FinalCut Pro”). Or you could share a slogan that
                      makes it clear what you do, (“Editing You Can Count On”)
                    </p>
                  </div>
                </Tooltip>
              </div>
            }
            details={
              <div>
                {data?.job_title ? (
                  <div className="headline fs-18 fw-400">
                    <StyledHtmlText
                      htmlString={data?.job_title}
                      needToBeShorten={true}
                      minLines={5}
                      id="headline"
                    />
                  </div>
                ) : (
                  <p className="text-center fs-18">
                    Tell clients what you do - here!
                  </p>
                )}
              </div>
            }
          />
        </Col>
        {/* END ------------------------------------------- Headline */}

        {/* START ----------------------------------------- About me */}
        <Col lg="12">
          <ProfileDetailSection
            onEdit={() => setEditModalType({ modal: 'about_me' })}
            isRequired={!data?.about_me}
            title={
              <div className="d-flex align-items-center gap-2">
                {data?.is_agency ? 'About the Agency' : 'About Me'}
                {data?.is_agency == 1 ? (
                  <Tooltip>
                    The “About the “Agency” section is the primary place for
                    agencies to introduce themselves. You can describe your work
                    history and experience, your style, specialties, or unique
                    services. Focus on making a good impression and
                    demonstrating your expertise.
                  </Tooltip>
                ) : (
                  <Tooltip>
                    The “About Me&quot; section is the primary place for freelancers
                    to introduce themselves. You can describe your work history
                    and experience, your style, specialties, or unique services.
                    Focus on making a good impression and demonstrating your
                    expertise.
                  </Tooltip>
                )}
              </div>
            }
            details={
              <div>
                {data?.about_me ? (
                  <div className="about-me fs-18 fw-400">
                    <StyledHtmlText
                      htmlString={data?.about_me}
                      needToBeShorten={true}
                      minLines={5}
                      id="about-me"
                    />
                  </div>
                ) : (
                  <p className="text-center fs-18">
                    Tell clients who you are - here!
                  </p>
                )}
              </div>
            }
          />
          {/* END ------------------------------------------- About me */}
        </Col>
        <Col lg="6" md={6} xl={6} xxl={6}>
          {/* START ----------------------------------------- Skills */}
          <ProfileDetailSection
            onEdit={() => setEditModalType({ modal: 'skills' })}
            isRequired={!categories || categories?.length === 0}
            title={
              <div className="d-flex align-items-center gap-2">
                Skills
                <Tooltip>
                  Click the edit button to the right to add your skills and let
                  clients know what talents you can provide!
                </Tooltip>
              </div>
            }
            details={
              <div className="skills d-flex align-items-center flex-wrap">
                {categories?.map((skill: any, index) => (
                  <SkillItem key={`skll-${index}`}>
                    <div>{skill.category_name}</div>
                  </SkillItem>
                ))}

                {data?.skills?.map(
                  (skill: any) =>
                    skill.skill_id && (
                      <SkillItem key={skill.skill_id}>
                        <div>{skill.skill_name}</div>
                      </SkillItem>
                    )
                )}
                {!data?.skills?.length && (
                  <>
                    <p className="text-center fs-18 my-3">
                      Add your skills here to help clients find you AND to get
                      updates about projects for you
                    </p>
                  </>
                )}
              </div>
            }
          />
          {/* END ------------------------------------------- Skills */}
        </Col>

        <Col lg="6" md={6} xl={6} xxl={6}>
          {/* START ----------------------------------------- Language */}
          <ProfileDetailSection
            title={
              <div className="d-flex align-items-center gap-2">
                Language
                <Tooltip>
                  To list the languages you can work in, click the edit button
                  to the right.
                </Tooltip>
              </div>
            }
            onEdit={() => setEditModalType({ modal: 'languages' })}
            details={
              <div className="skills list d-flex align-items-center flex-wrap">
                {data?.languages?.map((language: any) => (
                  <SkillItem key={`key-${language.id}`}>
                    <div>{language.name}</div>
                  </SkillItem>
                ))}
              </div>
            }
          />
          {/* END ------------------------------------------- Language */}
        </Col>

        {/* START ----------------------------------------- Education */}
        {data?.is_agency == 0 && (
          <>
            <Col lg="6">
              <ProfileDetailSection
                add={true}
                onEdit={() =>
                  setEditModalType({ modal: 'education', data: null })
                }
                title="Education"
                details={
                  data?.education?.length > 0 && (
                    <div className="list d-flex flex-column gap-3">
                      {data?.education?.map((eduItem: any) => (
                        <EducationItem
                          className="d-flex p-3 gap-2"
                          key={eduItem?.education_id}
                        >
                          <div className="education-details d-flex align-items-center flex-1">
                            <Image
                              src="/images/school.png"
                              className="education-school-img"
                              alt="education-img"
                              width={40}
                              height={40}
                            />
                            <div className="education-content">
                              <div className="course-name fs-20 fw-400 capital-first-ltr">
                                {convertToTitleCase(eduItem?.course_name)}
                              </div>
                              <div className="education-description fs-18 fw-400 capital-first-ltr">
                                {convertToTitleCase(eduItem?.school_name)}
                              </div>
                              {eduItem?.education_year &&
                                eduItem?.education_year !== '-' && (
                                  <div className="education-description fs-18 fw-400">
                                    {eduItem?.education_year}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div>
                            <div className="button pointer">
                              <EditIcon
                                onClick={() =>
                                  setEditModalType({
                                    modal: 'education',
                                    data: eduItem,
                                  })
                                }
                              />
                            </div>
                            <div className="button delete-btn pointer">
                              {selectedEducationId == eduItem?.education_id ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <DeleteIcon
                                  onClick={() =>
                                    onDeleteEducation(eduItem?.education_id)
                                  }
                                />
                              )}
                            </div>
                          </div>
                        </EducationItem>
                      ))}
                    </div>
                  )
                }
              />
            </Col>
            <Col lg="6">
              <ProfileDetailSection
                onEdit={() => setEditModalType({ modal: 'course', data: null })}
                fullWidth={true}
                add={true}
                title="Courses and Certifications"
                details={
                  data?.certificate_course?.length > 0 && (
                    <div className="list d-flex flex-column gap-3">
                      {data?.certificate_course?.map((courseItem: any) => (
                        <EducationItem
                          className={cns(
                            'p-4 d-flex justify-content-between align-items-center gap-2',
                            { pointer: courseItem?.certificate_link }
                          )}
                          key={courseItem?.course_id}
                          onClick={() =>
                            openCertificate(courseItem?.certificate_link)
                          }
                        >
                          <div className="education-content">
                            <div className="course-name fs-20 fw-400 capital-first-ltr">
                              {convertToTitleCase(courseItem?.course_name)}
                            </div>
                            <div className="education-description fs-18 fw-400 mt-2 capital-first-ltr">
                              {convertToTitleCase(courseItem?.school_name)}
                            </div>
                          </div>
                          <div>
                            <div className="button pointer">
                              <EditIcon
                                onClick={(e:any) => {
                                  e.stopPropagation();
                                  setEditModalType({
                                    modal: 'course',
                                    data: courseItem,
                                  });
                                }}
                              />
                            </div>
                            <div className="button delete-btn pointer">
                              {selectedCourseId == courseItem?.course_id ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <DeleteIcon
                                  onClick={(e:any) => {
                                    e.stopPropagation();
                                    onDeleteCourse(courseItem?.course_id);
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </EducationItem>
                      ))}
                    </div>
                  )
                }
              />
            </Col>
          </>
        )}
        {/* END ------------------------------------------- Education */}
        {/* START ----------------------------------------- Modals */}
        {/* Headline */}
        <HeadlineEditModal
          headline={data?.job_title}
          show={editModalType?.modal == 'headline'}
          onClose={() => setEditModalType({ modal: '' })}
          onUpdate={onUpdate}
        />

        {/* Edit about me modal */}
        <AboutUsEditModal
          show={editModalType?.modal == 'about_me'}
          data={{
            is_agency: !!data.is_agency,
            aboutMe: data.about_me,
            portfolioLink: data.portfolio_link,
          }}
          onClose={() => setEditModalType({ modal: '' })}
          onUpdate={onUpdate}
          user_type={data?.user_type}
        />

        {/* Edit Skills modal */}
        <SkillsEditModal
          show={editModalType?.modal == 'skills'}
          selectedCategories={getCategories(data?.skills || [])}
          selectedSkills={getSkills(data?.skills || [])}
          onClose={() => setEditModalType({ modal: '' })}
          onUpdate={onUpdate}
        />

        {/* Edit languages modal */}
        <LanguagesEditModal
          languagesProps={data.languages}
          show={editModalType?.modal == 'languages'}
          onClose={() => setEditModalType({ modal: '' })}
          onUpdate={onUpdate}
        />

        {/* Edit education modal */}
        <EducationEditModal
          show={editModalType?.modal == 'education'}
          onClose={() => setEditModalType({ modal: '' })}
          data={editModalType?.data}
          onUpdate={onUpdate}
        />

        {/* Edit course modal */}
        <CourseEditModal
          show={editModalType?.modal == 'course'}
          onClose={() => setEditModalType({ modal: '' })}
          data={editModalType?.data}
          onUpdate={onUpdate}
        />
        {/* END ------------------------------------------- Modals */}
      </Row>
    </Wrapper>
  );
};
