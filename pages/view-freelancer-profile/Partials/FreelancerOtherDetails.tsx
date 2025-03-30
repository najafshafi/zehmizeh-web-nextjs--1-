import styled from "styled-components";
import cns from "classnames";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import { transition } from "@/styles/transitions";
import { convertToTitleCase } from "@/helpers/utils/misc";
import Image from "next/image";

const DetailsWrapper = styled.div`
  padding: 3.25rem;
  border-radius: 0.875rem;
  background: ${(props) => props.theme.colors.white};
  box-shadow: 0px 4px 61px rgba(0, 0, 0, 0.04);
  .description {
    margin-top: 1.25rem;
    opacity: 0.8;
    line-height: 160%;
  }
  .skills {
    margin-top: 1.25rem;
    gap: 10px;
  }
  .education-details {
    gap: 22px;
    max-width: 100%;
    word-break: break-word;
  }
  .course-name {
    line-height: 1.6rem;
  }
  .education-description {
    opacity: 0.7;
    margin-top: 10px;
    line-height: 1.44rem;
  }
  .education-school-img {
    height: 92px;
    width: 92px;
  }
  .courrse-certi-details {
    padding: 1.5rem;
    border: 1px solid #dddddd;
    border-radius: 15px;
    margin-top: 1.25rem;
    word-wrap: break-word;
  }
  .box-shadow {
    ${() => transition()}
  }
  .portfolio {
    color: ${(props) => props.theme.colors.yellow};
  }
  .portfolio {
    color: ${(props) => props.theme.colors.yellow};
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  opacity: 0.1;
  border: 1px solid #000000;
  margin: 2.75rem 0rem;
`;

const SkillItem = styled.div`
  padding: 0.625rem 0.75rem;
  background: #f6f6f6;
  border-radius: 0.5rem;
  width: fit-content;
  text-transform: capitalize;
`;

// Define types for education item
interface EducationItem {
  education_id: string | number;
  course_name?: string;
  school_name?: string;
  education_year?: string;
}

// Define types for course/certificate item
interface CourseItem {
  course_id: string | number;
  course_name?: string;
  school_name?: string;
  certificate_link?: string;
}

// Define types for skill item
interface SkillItem {
  skill_id?: string | number;
  skill_name?: string;
  category_id?: string | number;
  category_name?: string;
  id?: string | number; // For languages
  name?: string; // For languages
}

// Define the data structure
interface FreelancerDetailsData {
  about_me?: string;
  is_agency?: number;
  skills?: SkillItem[];
  languages?: SkillItem[];
  education?: EducationItem[];
  certificate_course?: CourseItem[];
  [key: string]: any; // Allow other properties
}

interface FreelancerOtherDetailsProps {
  data: FreelancerDetailsData;
  handleAuthenticatedAction?: (action: string) => boolean;
}

const FreelancerOtherDetails = ({
  data,
  handleAuthenticatedAction,
}: FreelancerOtherDetailsProps) => {
  const openCertificate = (link: string | undefined) => {
    // Check if user is authenticated before performing this action
    if (
      handleAuthenticatedAction &&
      !handleAuthenticatedAction("view_certificate")
    ) {
      return;
    }

    // This function will open the certificate link
    if (link) {
      window.open(link, "blank");
    }
  };

  const AboutMe = data?.about_me && (
    <div className="profile-detail-block">
      <div className="title text-[28px] font-normal">
        {data?.is_agency ? "About the Agency" : "About Me"}
      </div>
      <div className="description text-[18px] font-light">
        <StyledHtmlText
          htmlString={data?.about_me}
          id="freelancer-profile"
          needToBeShorten={true}
        />
      </div>
    </div>
  );

  const Categories = data?.skills && data?.skills?.length > 0 && (
    <div className="profile-detail-block">
      <div className="title text-[28px] font-normal">Skill Categories</div>
      <div className="skills flex flex-wrap">
        {data?.skills?.map((skill: SkillItem) => {
          if (!skill.category_id) return null;
          return (
            <SkillItem key={skill.category_id}>
              <div>{skill.category_name}</div>
            </SkillItem>
          );
        })}
      </div>
    </div>
  );

  const Skills = data?.skills && data?.skills?.length > 0 && (
    <div className="profile-detail-block">
      <div className="title text-[28px] font-normal">Skills</div>
      <div className="skills flex flex-wrap">
        {data?.skills?.map((skill: SkillItem) => {
          if (!skill.skill_id) return null;
          return (
            <SkillItem key={skill.skill_id}>
              <div>{skill.skill_name}</div>
            </SkillItem>
          );
        })}
      </div>
    </div>
  );

  const Languages = data?.languages && data?.languages?.length > 0 && (
    <div className="profile-detail-block">
      <div className="title text-[28px] font-normal">Languages</div>
      <div className="skills flex flex-wrap">
        {data?.languages?.map((skill: SkillItem) => (
          <SkillItem key={skill.id}>
            <div>{skill.name}</div>
          </SkillItem>
        ))}
      </div>
    </div>
  );

  const Education = data?.is_agency === 0 &&
    data?.education &&
    data?.education?.length > 0 && (
      <div className="profile-detail-block">
        <div className="title text-[28px] font-normal">Education</div>
        {data.education.map((eduItem: EducationItem) => (
          <div
            className="education-details flex mt-3"
            key={eduItem?.education_id}
          >
            <Image
              src="/images/school.png"
              className="education-school-img"
              alt="education-img"
              width={92}
              height={92}
            />
            <div className="flex flex-col justify-center">
              <div className="course-name text-[20px] font-normal">
                {convertToTitleCase(eduItem?.course_name || "")}
              </div>
              <div className="education-description text-[18px] font-normal">
                {convertToTitleCase(eduItem?.school_name || "")}
              </div>
              {eduItem?.education_year && eduItem?.education_year !== "-" && (
                <div className="education-description text-[18px] font-normal">
                  {eduItem?.education_year}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );

  const CoursesAndCertifications = data?.is_agency === 0 &&
    data?.certificate_course &&
    data?.certificate_course?.length > 0 && (
      <div className="course-certificate-block">
        <div className="title text-[28px] font-normal">
          Courses and Certifications
        </div>
        {data.certificate_course?.map((courseItem: CourseItem) => (
          <div
            className={cns("courrse-certi-details flex flex-col", {
              "cursor-pointer box-shadow": courseItem?.certificate_link,
            })}
            key={courseItem?.course_id}
            onClick={() => openCertificate(courseItem?.certificate_link)}
          >
            <div className="course-name text-[20px] font-normal">
              {convertToTitleCase(courseItem?.course_name || "")}
            </div>
            <div className="education-description text-[18px] font-normal mt-2">
              {convertToTitleCase(courseItem?.school_name || "")}
            </div>
          </div>
        ))}
      </div>
    );

  // Define section types for generating stable keys
  const sectionTypes = {
    ABOUT: "about",
    CATEGORIES: "categories",
    SKILLS: "skills",
    LANGUAGES: "languages",
    EDUCATION: "education",
    COURSES: "courses",
  };

  // Create UI array with sectionType information
  const uiSections = [
    { element: AboutMe, type: sectionTypes.ABOUT },
    { element: Categories, type: sectionTypes.CATEGORIES },
    { element: Skills, type: sectionTypes.SKILLS },
    { element: Languages, type: sectionTypes.LANGUAGES },
    { element: Education, type: sectionTypes.EDUCATION },
    { element: CoursesAndCertifications, type: sectionTypes.COURSES },
  ].filter((section) => section.element);

  const UI = uiSections.map((section, i) => (
    <div key={section.type}>
      {section.element}
      {i < uiSections.length - 1 && <Divider />}
    </div>
  ));

  if (UI.length === 0) return <></>;

  return (
    <>
      <DetailsWrapper className="mt-4">{UI}</DetailsWrapper>
    </>
  );
};

export default FreelancerOtherDetails;
