"use client";
/*
 * This is edit about me modal
 */
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FormWrapper } from "./steps.styled";
import styled from "styled-components";
import TextEditor from "@/components/forms/TextEditor";
import { getPlainText, showErr } from "@/helpers/utils/misc";
import { useAuth } from "@/helpers/contexts/auth-context";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import { IClientDetails } from "@/helpers/types/client.type";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { CONSTANTS } from "@/helpers/const/constants";
import CustomButton from "@/components/custombutton/CustomButton";

const Container = styled.div`
  .ck-editor__main {
    min-height: 250px;
  }
  [role="textbox"] {
    min-height: 250px;
  }
  .helper {
    color: ${(props) => props.theme.colors.gray8};
  }
`;

type Props = {
  aboutMe?: Partial<IClientDetails & IFreelancerDetails>["about_me"];
  onUpdate: (data: Partial<IClientDetails & IFreelancerDetails>) => void;
  onPrevious: () => void;
  skipForNow: () => void;
};

const AboutMe = ({ aboutMe, onUpdate, onPrevious, skipForNow }: Props) => {
  const router = useRouter(); // Changed from useNavigate
  const [content, setContent] = useState(aboutMe);
  const [loading, setLoading] = useState(false);
  const [isMaxLimitReached, setIsMaxLimitReached] = useState(false);
  const {
    user: { is_agency, user_type },
  } = useAuth();

  useEffect(() => {
    // This will store the about me if already entered when coming back to this step
    if (aboutMe) {
      setContent(aboutMe);
    }
  }, [aboutMe]);

  const wordCount = useMemo(() => {
    return content ? getPlainText(content).length : 0;
  }, [content]);

  const onDescriptionChange = (data: typeof aboutMe) => {
    setContent(data);
    if (
      (getPlainText(data || "") || "").length <=
      CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS
    ) {
      if (isMaxLimitReached) {
        setIsMaxLimitReached(false);
      }
    } else {
      if (!isMaxLimitReached) {
        setIsMaxLimitReached(true);
      }
    }
  };

  const handleUpdate = (skip = false) => {
    if (skip) return router.push("/client/account/profile"); // Changed from navigate
    if (isMaxLimitReached) {
      showErr(
        `Maximum ${CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS} characters are allowed.`
      );
      return;
    }
    if (wordCount < CONSTANTS.ABOUT_ME_MINIMUM_CHARACTERS) {
      showErr(
        `${is_agency ? "About the Agency" : "About Me"} needs at least ${
          CONSTANTS.ABOUT_ME_MINIMUM_CHARACTERS
        } characters.`
      );
      return;
    }
    // Validation and props function call to store the data in parent
    if (content) {
      setLoading(true);
      onUpdate({ about_me: content });
    } else {
      toast.error("Please enter a description.");
    }
  };

  const titleHandler = () => {
    let title = is_agency ? "About the Agency" : "About Me";
    if (!is_agency && user_type === "client") {
      title = "About Me";
    }
    return title;
  };

  return (
    <Container>
      <FormWrapper className="flex flex-col">
        <div className={user_type === "client" ? "mt-4" : ""}>
          <div className={`fs-18 font-weight-bold mb-2`}>
            {titleHandler()}
            {!is_agency && user_type === "client" ? (
              <span className="fs-14 font-weight-normal"> (Optional)</span>
            ) : (
              <span className="mandatory"> *</span>
            )}
          </div>
          {user_type === "client" ? (
            <div>
              <h4 className="fs-18 font-normal">
                You can use this box to introduce yourself to prospective
                freelancers. Share any details you may consider important, like:
              </h4>
              <ul className="fs-10 fw-350 mt-3">
                <li className="mt-1">What industry are you in?</li>
                <li className="mt-1">
                  Do you have specific needs from freelancers? (Certain times
                  they need to be available, have specific professional
                  training, etc.)
                </li>
                <li className="mt-1">
                  Is there anything a freelancer may need to know about you?
                  (You travel frequently, English is not your first language,
                  etc.)
                </li>
              </ul>
              <p>This information can always be changed or updated later.</p>
            </div>
          ) : (
            <div className={`helper fs-base font-normal mb-5`}>
              The “{is_agency ? "About the Agency" : "About Me"}” section is
              your primary way of introducing yourself to potential clients. Use
              this text to make a good impression, tell your story, and
              demonstrate your expertise. (There is no pressure to make the text
              perfect right away - you can continue to edit and update this
              section after your registration.)
            </div>
          )}
          <TextEditor
            value={aboutMe || ""}
            onChange={onDescriptionChange}
            placeholder=""
            maxChars={CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS}
          />
        </div>
        <div className="flex justify-center md:justify-end gap-4">
          {user_type !== "client" && (
            <CustomButton
              text="Previous"
              className="px-8 py-3 transition-transform duration-200 hover:scale-105 font-normal  rounded-full hover:bg-black hover:text-white text-[18px] border border-black "
              disabled={loading}
              onClick={onPrevious}
            />
          )}
          {user_type === "client" ? (
            <CustomButton
              text="Skip"
              className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal  rounded-full bg-black text-white text-[18px]"
              disabled={loading}
              onClick={() => handleUpdate(true)}
            />
          ) : (
            <CustomButton
              text="Skip"
              className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal  rounded-full bg-black text-white text-[18px]"
              disabled={loading}
              onClick={skipForNow}
            />
          )}

          <CustomButton
            text={user_type === "client" ? "Save & Go to Profile" : "Next"}
            className="px-8 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={() => handleUpdate()}
          />
        </div>
      </FormWrapper>
    </Container>
  );
};

export default AboutMe;
