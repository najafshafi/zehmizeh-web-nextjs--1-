/*
 * This is edit about me modal
 */
"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import { editUser } from "@/helpers/http/auth";
import TextEditor from "@/components/forms/TextEditor";
import { getPlainText, showErr } from "@/helpers/utils/misc";
import { CONSTANTS } from "@/helpers/const/constants";

type Props = {
  show: boolean;
  onClose: () => void;
  data: {
    is_agency?: boolean;
    aboutMe?: string;
    portfolioLink?: string;
  };
  onUpdate: () => void;
  user_type?: string;
};

const AboutUsEditModal = ({
  show,
  onClose,
  data,
  onUpdate,
  user_type,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isMaxLimitReached, setIsMaxLimitReached] = useState(false);
  const [formState, setFormState] = useState({
    description: data.aboutMe ?? "",
    link: data.portfolioLink ?? "",
  });

  const handleChange = useCallback((field: string, value: string) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [field]: value,
    }));
  }, []);

  useEffect(() => {
    if (!show) {
      setFormState({
        description: data.aboutMe ?? "",
        link: data.portfolioLink ?? "",
      });
    }
  }, [data.aboutMe, data.portfolioLink, show]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const handleUpdate = () => {
    const { description, link } = formState;
    if (wordCount > CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS) {
      showErr(
        `Maximum ${CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS} characters are allowed.`
      );
      return;
    }
    if (wordCount < CONSTANTS.ABOUT_ME_MINIMUM_CHARACTERS) {
      showErr(
        `${data?.is_agency ? "About the Agency" : "About Me"} needs at least ${
          CONSTANTS.ABOUT_ME_MINIMUM_CHARACTERS
        } characters.`
      );
      return;
    }
    if (description) {
      setLoading(true);
      const body = {
        about_me: description,
        portfolio_link: link,
      };
      const promise = editUser(body);
      toast.promise(promise, {
        loading: "Updating your details - please wait...",
        success: (res) => {
          onUpdate();
          onClose();
          setLoading(false);
          return res.message;
        },
        error: (err) => {
          setLoading(false);
          return err?.response?.data?.message || "error";
        },
      });
    } else {
      toast.error("Please enter a description.");
    }
  };

  const onDescriptionChange = (data: string) => {
    handleChange("description", data);
    if (data.length <= CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS) {
      if (isMaxLimitReached) {
        setIsMaxLimitReached(false);
      }
    } else {
      if (!isMaxLimitReached) {
        setIsMaxLimitReached(true);
      }
    }
  };

  const wordCount = useMemo(() => {
    return formState.description
      ? getPlainText(formState.description).length
      : 0;
  }, [formState.description]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center bg-black/40 justify-center z-50">
      <div
        className="w-screen h-screen fixed inset-0 backdrop-blur-sm z-40 p-0 m-0"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl max-w-[678px] max-h-[683px] w-full py-8 px-4 md:p-12 relative z-50 m-2">
        <VscClose
          type="button"
          className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
          onClick={onClose}
        />
        <div className="space-y-6">
          <h3
            className="font-normal mb-0 text-[1.75rem]"
            style={{ lineHeight: 1.5 }}
          >
            {data?.is_agency ? "About the Agency" : "About Me"}
            <span className="text-red-500">*</span>
          </h3>

          <div className="space-y-4">
            {/* Sub text for freelancers */}
            {user_type === "freelancer" && (
              <div className="space-y-4">
                {data?.is_agency ? (
                  <>
                    <p className="font-normal indent-8">
                      The &quot;About the Agency&quot; section is the primary
                      place for agencies to introduce themselves. You can
                      describe your work history and experience, your style,
                      specialties, or unique services. Focus on making a good
                      impression and demonstrating your expertise.
                    </p>
                    <p className="font-medium indent-8 mt-4">
                      Links to outside websites and contact information should
                      not be included.
                    </p>
                  </>
                ) : (
                  <>
                    <p className=" font-normal indent-8">
                      The &quot;About Me&quot; section is the primary place for
                      freelancers to introduce themselves. You can describe your
                      work history and experience, your style, specialties, or
                      unique services. Focus on making a good impression and
                      demonstrating your expertise.
                    </p>
                    <p className=" font-bold indent-8 mt-4">
                      Links to outside websites and personal contact information
                      should not be included.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Sub text for client */}
            {user_type === "client" && (
              <div className="space-y-3">
                <h4 className="text-base font-normal">
                  Use this box to introduce yourself to freelancers. Share any
                  details you think may be relevant, like:
                </h4>
                <ul className="text-xs font-normal list-disc pl-5">
                  <li className="mt-1">What type of work do you do?</li>
                  <li className="mt-1">
                    What expectations would you have for a freelancer you were
                    working with?
                  </li>
                  <li className="mt-1">What should they know about you?</li>
                </ul>
              </div>
            )}

            {/* Text Editor */}
            <div>
              <TextEditor
                value={formState.description}
                onChange={onDescriptionChange}
                placeholder="Enter your description"
                maxChars={CONSTANTS.ABOUT_ME_MAXIMUM_CHARACTERS}
              />
            </div>
          </div>

          <div className="flex justify-center md:justify-end mt-6">
            <button
              className="bg-[#F2B420] text-[#212529] px-10 py-[1.15rem] hover:scale-105 duration-300 text-lg rounded-full disabled:bg-[#F2A420]"
              style={{ lineHeight: 1.6875 }}
              disabled={loading}
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsEditModal;
