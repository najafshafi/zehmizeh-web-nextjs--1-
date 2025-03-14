/*
 * This component is a modal to edit headline
 */
"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { VscClose } from "react-icons/vsc";
import { editUser } from "@/helpers/http/auth";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { SeeMore } from "@/components/ui/SeeMore";
import { useWebSpellChecker } from "@/helpers/hooks/useWebSpellChecker";
import { CONSTANTS } from "@/helpers/const/constants";

type Props = {
  headline: string;
  show: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

const HeadlineEditModal = ({ show, headline, onClose, onUpdate }: Props) => {
  useWebSpellChecker(show, [show]);

  const [loading, setLoading] = useState(false);
  const [headlineText, setHeadlineText] = useState(headline || "");
  const [error, setError] = useState("");
  const [seeMore, setSeeMore] = useState(false);

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

  useEffect(() => {
    if (!show) {
      setHeadlineText(headline || "");
      setError("");
      setSeeMore(false);
    }
  }, [headline, show]);

  const handleUpdate = () => {
    if (!headlineText) {
      setError("Please enter headline");
      return;
    }
    setLoading(true);
    const body = {
      job_title: headlineText,
    };
    const promise = editUser(body);
    toast.promise(promise, {
      loading: "Updating headline - please wait...",
      success: (res: { message: string }) => {
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
  };

  const countCharactersWithoutSpaces = (text: string) => {
    return text.replace(/\s+/g, "").length;
  };

  const handleChange = (inputValue: string) => {
    if (countCharactersWithoutSpaces(inputValue) <= 150) {
      setHeadlineText(inputValue);
      setError(""); // Clear error on valid input
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center bg-black/40 justify-center z-50">
      <div
        className="w-screen h-screen fixed inset-0 backdrop-blur-sm z-40 p-0 m-0"
        onClick={onClose}
      ></div>

      <div className="bg-white rounded-xl max-w-[678px] max-h-[643px] w-full py-8 px-4 md:p-12 relative z-50 m-2">
        <VscClose
          type="button"
          className="absolute top-4 md:top-0 right-4 md:-right-8 text-2xl text-black md:text-white hover:text-gray-200 cursor-pointer"
          onClick={onClose}
        />
        <div className="space-y-6">
          <div className="space-y-2">
            <h3
              className="font-bold text-[1.75rem]"
              style={{ lineHeight: 1.5 }}
            >
              Headline
            </h3>
            <p className="text-base text-gray-600">
              Your headline should introduce your work as a freelancer. When
              clients search for freelancers, they’ll see it directly under your
              name as a personal subtitle or slogan.
            </p>
            {seeMore && (
              <p className="text-base text-gray-600">
                The simplest way to introduce yourself would be to mention your
                job title (“Ghostwriter” or “Accountant”). Alternatively, you
                could list your freelancing skills (“Photoshop | Adobe |
                FinalCut Pro”). Or you could even use a tagline that makes it
                clear what you do (“Editing You Can Count On”).
              </p>
            )}
            <SeeMore onClick={() => setSeeMore((prev) => !prev)}>
              {seeMore ? "See Less" : "See More"}
            </SeeMore>
          </div>

          <div className="space-y-5 px-3">
            <div>
              <label className="text-sm font-normal mb-1 block">
                Add headline below<span className="text-red-500">*</span>
              </label>
              <input
                id={CONSTANTS.WEB_SPELL_CHECKER_DOM_ID}
                type="text"
                placeholder="Enter your headline"
                className="mt-1.5 w-full p-4 border border-black rounded-lg"
                value={headlineText}
                onChange={(e) => handleChange(e.target.value)}
                maxLength={150}
              />
              <div className="text-right text-sm text-[#F2B420] mt-2">
                {150 - countCharactersWithoutSpaces(headlineText)}/150
                characters
              </div>
              {error && <ErrorMessage message={error} />}
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

export default HeadlineEditModal;
