"use client"; // Ensure this is a client component
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Tooltip from "@/components/ui/Tooltip";
import ProfileDetailSection from "../partials/ProfileDetailSection";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import { useQueryData, useRefetch } from "@/helpers/hooks/useQueryData";
import { convertToTitleCase } from "@/helpers/utils/misc";
import styled from "styled-components";
import EditIcon from "../../../public/icons/edit-blue-outline.svg";
import DeleteIcon from "../../../public/icons/trash.svg";
import cns from "classnames";
import toast from "react-hot-toast";
import { manageCourse, manageEducation } from "@/helpers/http/freelancer";
import HeadlineEditModal from "@/pages/freelancer-profile-settings/edit-modals/headlineEditModal";
import AboutUsEditModal from "@/pages/freelancer-profile-settings/edit-modals/AboutUsEditModal";
import SkillsEditModal from "@/pages/freelancer-profile-settings/edit-modals/SkillsEditModal";
import LanguagesEditModal from "@/pages/freelancer-profile-settings/edit-modals/LanguagesEditModal";
import EducationEditModal from "@/pages/freelancer-profile-settings/edit-modals/EducationEditModal";
import CourseEditModal from "@/pages/freelancer-profile-settings/edit-modals/CourseEditModal";
import ProfileBanner from "../partials/ProfileBanner";
import { queryKeys } from "@/helpers/const/queryKeys";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { getCategories, getSkills } from "@/helpers/utils/helper";
import Image from "next/image";

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

interface Category {
  category_id?: number;
  category_name: string;
  skill_id?: number;
  categories?: number[];
  skill_name?: string;
}

interface EditModalData {
  education_id?: number;
  course_id?: number;
  course_name?: string;
  school_name?: string;
  education_year?: string;
  certificate_link?: string;
}

interface EditModalType {
  modal: string;
  data?: EditModalData | null;
}

export const Profile = () => {
  const { data } = useQueryData<IFreelancerDetails>(
    queryKeys.getFreelancerProfile
  );
  const { refetch } = useRefetch(queryKeys.getFreelancerProfile);

  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedEducationId, setSelectedEducationId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editModalType, setEditModalType] = useState<EditModalType>({
    modal: "",
  });

  const searchParams = useSearchParams();
  const tab = searchParams?.get("openModal")?.toLowerCase() || "";

  // Open popup when user clicks from "Profile [X] Complete" button
  useEffect(() => {
    if (tab) setEditModalType({ modal: tab });
  }, [tab]);

  const onUpdate = () => {
    setEditModalType({ modal: "" });
    refetch();
  };

  const onDeleteEducation = (id: string) => {
    setSelectedEducationId(id);
    const body = { action: "delete_education", education_id: id };

    const promise = manageEducation(body);

    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        onUpdate();
        setSelectedEducationId("");
        return data ? res.response : res.message;
      },
      error: (err) => {
        setSelectedEducationId("");
        return (data ? err?.response : err?.message) || "error";
      },
    });
  };

  const openCertificate = (link: string) => {
    if (link) {
      window.open(link, "_blank");
    }
  };

  const onDeleteCourse = (id: string) => {
    setSelectedCourseId(id);
    const body = { action: "delete_course", course_id: id };

    const promise = manageCourse(body);

    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        onUpdate();
        setSelectedCourseId("");
        return data ? res.response : res.message;
      },
      error: (err) => {
        setSelectedCourseId("");
        return (data ? err?.response : err?.message) || "error";
      },
    });
  };

  const getCategoryHandler = () => {
    let categories: Category[] = [];

    data?.skills?.forEach(({ category_name }) => {
      if (
        category_name &&
        !categories.some((cat) => cat.category_name === category_name)
      )
        categories.push({ category_name });
    });

    categories = categories.map((cat) => {
      const catObj = data?.skills?.filter(
        (skill) => skill.category_name === cat.category_name
      )[0];
      return { ...cat, ...catObj };
    });

    setCategories(categories);
  };

  useEffect(() => {
    getCategoryHandler();
  }, [data]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-8">
        <div className="col-span-1">
          <ProfileBanner data={data!} refetch={refetch} />
        </div>
        <div className="col-span-1">
          {/* START ----------------------------------------- Headline */}
          <ProfileDetailSection
            onEdit={() => setEditModalType({ modal: "headline" })}
            isrequired={!data?.job_title}
            title={
              <div className="flex items-center gap-2">
                Headline
                <Tooltip>
                  <div>
                    <p>
                      Your headline is meant to be the space where you can
                      introduce what you do professionally. When clients are
                      doing a freelancer search, they&apos;ll see it displayed
                      just below your name as a sort of personal subtitle or
                      tagline.
                    </p>
                    <p>
                      The simplest ways to introduce yourself would be to name
                      your project title, (&quot;Ghostwriter&quot; or
                      &quot;Accountant&quot;). You could list your main
                      freelancing skills, (&quot;Photoshop | Adobe | FinalCut
                      Pro&quot;). Or you could share a slogan that makes it
                      clear what you do, (&quot;Editing You Can Count On&quot;)
                    </p>
                  </div>
                </Tooltip>
              </div>
            }
            details={
              <div>
                {data?.job_title ? (
                  <div className="text-lg font-normal">
                    <StyledHtmlText
                      htmlString={data?.job_title}
                      needToBeShorten={true}
                      minlines={5}
                      id="headline"
                    />
                  </div>
                ) : (
                  <p className="text-center font-normal">
                    Tell clients what you do - here!
                  </p>
                )}
              </div>
            }
          />
        </div>

        {/* START ----------------------------------------- About me */}
        <div className="col-span-1">
          <ProfileDetailSection
            onEdit={() => setEditModalType({ modal: "about_me" })}
            isrequired={!data?.about_me}
            title={
              <div className="flex items-center gap-2">
                {data?.is_agency ? "About the Agency" : "About Me"}
                <Tooltip>
                  {data?.is_agency ? (
                    <div>
                      The &quot;About the Agency&quot; section is the primary
                      place for agencies to introduce themselves. You can
                      describe your work history and experience, your style,
                      specialties, or unique services. Focus on making a good
                      impression and demonstrating your expertise.
                    </div>
                  ) : (
                    <div>
                      The &quot;About Me&quot; section is the primary place for
                      freelancers to introduce themselves. You can describe your
                      work history and experience, your style, specialties, or
                      unique services. Focus on making a good impression and
                      demonstrating your expertise.
                    </div>
                  )}
                </Tooltip>
              </div>
            }
            details={
              <div>
                {data?.about_me ? (
                  <div
                    className="text-lg text-[#212529]"
                    style={{ lineHeight: 2.25 }}
                  >
                    <StyledHtmlText
                      htmlString={data?.about_me}
                      needToBeShorten={true}
                      minlines={5}
                      id="about-me"
                    />
                  </div>
                ) : (
                  <p className="text-center font-normal">
                    Tell clients who you are - here!
                  </p>
                )}
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1">
            {/* START ----------------------------------------- Skills */}
            <ProfileDetailSection
              onEdit={() => setEditModalType({ modal: "skills" })}
              isrequired={!categories || categories?.length === 0}
              title={
                <div className="flex items-center gap-2">
                  Skills
                  <Tooltip>
                    Click the edit button to the right to add your skills and
                    let clients know what talents you can provide!
                  </Tooltip>
                </div>
              }
              details={
                <div className="flex flex-wrap items-center gap-2.5">
                  {categories?.map((skill, index) => (
                    <SkillItem key={`skll-${index}`}>
                      <div>{skill.category_name}</div>
                    </SkillItem>
                  ))}

                  {data?.skills?.map(
                    (skill) =>
                      skill.skill_id && (
                        <SkillItem key={skill.skill_id}>
                          <div>{skill.skill_name}</div>
                        </SkillItem>
                      )
                  )}
                  {!data?.skills?.length && (
                    <p className="text-center font-normal my-3 w-full">
                      Add your skills here to help clients find you AND to get
                      updates about projects for you
                    </p>
                  )}
                </div>
              }
            />
          </div>

          <div className="col-span-1">
            {/* START ----------------------------------------- Language */}
            <ProfileDetailSection
              title={
                <div className="flex items-center gap-2">
                  Language
                  <Tooltip>
                    To list the languages you can work in, click the edit button
                    to the right.
                  </Tooltip>
                </div>
              }
              onEdit={() => setEditModalType({ modal: "languages" })}
              details={
                <div className="flex flex-wrap items-center gap-2.5">
                  {data?.languages?.map((language) => (
                    <SkillItem key={`key-${language.id}`}>
                      <div>{language.name}</div>
                    </SkillItem>
                  ))}
                </div>
              }
            />
          </div>
        </div>

        {/* START ----------------------------------------- Education */}
        {data?.is_agency == 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="col-span-1">
              <ProfileDetailSection
                add={true}
                onEdit={() =>
                  setEditModalType({ modal: "education", data: null })
                }
                title="Education"
                details={
                  data?.education?.length > 0 && (
                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                      {data?.education?.map((eduItem) => (
                        <EducationItem
                          className="flex p-3 gap-2"
                          key={eduItem?.education_id}
                        >
                          <div className="flex items-center flex-1 gap-4">
                            <Image
                              src="/images/school.png"
                              className="w-[40px] h-[40px] object-contain"
                              alt="education-img"
                              width={40}
                              height={40}
                            />
                            <div className="flex-1">
                              <div className="text-xl font-normal capitalize">
                                {convertToTitleCase(eduItem?.course_name)}
                              </div>
                              <div className="opacity-70 mt-2 font-normal capitalize">
                                {convertToTitleCase(eduItem?.school_name)}
                              </div>
                              {eduItem?.education_year &&
                                eduItem?.education_year !== "-" && (
                                  <div className="opacity-70 font-normal">
                                    {eduItem?.education_year}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              className="p-2 hover:-translate-y-0.5 transition-transform"
                              onClick={() => {
                                setEditModalType({
                                  modal: "education",
                                  data: eduItem,
                                });
                              }}
                            >
                              <EditIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 hover:-translate-y-0.5 transition-transform"
                              onClick={() =>
                                onDeleteEducation(
                                  eduItem?.education_id.toString()
                                )
                              }
                            >
                              {selectedEducationId ===
                              eduItem?.education_id.toString() ? (
                                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <DeleteIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </EducationItem>
                      ))}
                    </div>
                  )
                }
              />
            </div>

            <div className="col-span-1">
              <ProfileDetailSection
                onEdit={() => setEditModalType({ modal: "course", data: null })}
                fullwidth={true}
                add={true}
                title="Courses and Certifications"
                details={
                  data?.certificate_course?.length > 0 && (
                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                      {data?.certificate_course?.map((courseItem) => (
                        <EducationItem
                          className={cns(
                            "p-4 flex justify-between items-center gap-2",
                            { "cursor-pointer": courseItem?.certificate_link }
                          )}
                          key={courseItem?.course_id}
                          onClick={() =>
                            openCertificate(courseItem?.certificate_link)
                          }
                        >
                          <div className="flex-1">
                            <div className="text-xl font-normal capitalize">
                              {convertToTitleCase(courseItem?.course_name)}
                            </div>
                            <div className="opacity-70 mt-2 font-normal capitalize">
                              {convertToTitleCase(courseItem?.school_name)}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              className="p-2 hover:-translate-y-0.5 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditModalType({
                                  modal: "course",
                                  data: courseItem,
                                });
                              }}
                            >
                              <EditIcon className="w-5 h-5" />
                            </button>
                            <button
                              className="p-2 hover:-translate-y-0.5 transition-transform"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteCourse(
                                  courseItem?.course_id.toString()
                                );
                              }}
                            >
                              {selectedCourseId ===
                              courseItem?.course_id.toString() ? (
                                <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <DeleteIcon className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </EducationItem>
                      ))}
                    </div>
                  )
                }
              />
            </div>
          </div>
        )}

        {/* START ----------------------------------------- Modals */}
        <HeadlineEditModal
          headline={data?.job_title || ""}
          show={editModalType?.modal === "headline"}
          onClose={() => setEditModalType({ modal: "" })}
          onUpdate={onUpdate}
        />
        <AboutUsEditModal
          show={editModalType?.modal === "about_me"}
          data={{
            is_agency: !!data?.is_agency,
            aboutMe: data?.about_me || "",
            portfolioLink: data?.portfolio_link || "",
          }}
          onClose={() => setEditModalType({ modal: "" })}
          onUpdate={onUpdate}
          user_type={data?.user_type}
        />
        <SkillsEditModal
          show={editModalType?.modal === "skills"}
          selectedCategories={getCategories(data?.skills || [])}
          selectedSkills={getSkills(data?.skills || [])}
          onClose={() => setEditModalType({ modal: "" })}
          onUpdate={onUpdate}
        />
        <LanguagesEditModal
          languagesProps={data?.languages || []}
          show={editModalType?.modal === "languages"}
          onClose={() => setEditModalType({ modal: "" })}
          onUpdate={onUpdate}
        />
        <EducationEditModal
          show={editModalType?.modal === "education"}
          onClose={() => setEditModalType({ modal: "" })}
          data={editModalType?.data}
          onUpdate={onUpdate}
        />
        <CourseEditModal
          show={editModalType?.modal === "course"}
          onClose={() => setEditModalType({ modal: "" })}
          data={editModalType?.data}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
};
