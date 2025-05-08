import { Dialog, Transition } from "@headlessui/react";
import useClientProfile from "@/controllers/useClientProfile";
import { CONSTANTS } from "@/helpers/const/constants";
import { editUser } from "@/helpers/http/auth";
import React, { Fragment, useEffect } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import CustomButton from "@/components/custombutton/CustomButton";

export const ModalAfterPostingProject = () => {
  const { profileData } = useClientProfile();
  const searchParams = useSearchParams();

  const [modalAfterPostingProject, setModalAfterPostingProject] =
    React.useState(false);
  const [isCheckedDoNotShowAgain, setIsCheckedDoNotShowAgain] =
    React.useState(false);

  // Check for hash in URL on component mount
  useEffect(() => {
    if (
      searchParams &&
      searchParams.has("modal") &&
      searchParams.get("modal") === CONSTANTS.PROJECT_POSTED_HASH_VALUE
    ) {
      setModalAfterPostingProject(true);
    }
  }, [searchParams]);

  const handleOkay = async () => {
    // closing modal without waiting for api call to finish
    setModalAfterPostingProject(false);

    /* START -----------------------------------------  
      if do not show again checkbox selected then
      making api call to set do not show flag to 1
    */
    if (isCheckedDoNotShowAgain) {
      try {
        const body = {
          settings: {
            do_not_show_post_project_modal: 1,
          },
        };
        await editUser(body);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Modal after posting project:", error);
        toast.error('Failed to update "Do not show this notice again" value');
      }
    }
    /* END -------------------------------------------  */
  };

  return (
    <Transition appear show={modalAfterPostingProject} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setModalAfterPostingProject(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform  rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                <div className="relative p-6">
                  <button
                    className="absolute -right-8 -top-4 text-white  text-3xl"
                    onClick={() => setModalAfterPostingProject(false)}
                  >
                    &times;
                  </button>
                  <div className="flex flex-col items-center text-center mb-6">
                    <h3 className="mb-4 text-xl font-bold">
                      You can now invite freelancers to your project!
                    </h3>
                    <ul className="list-disc text-left pl-6 space-y-2">
                      <li>
                        Freelancers you invite will know you&apos;re interested
                        in their proposals
                      </li>
                      <li>
                        Click their name from the list to see their profile
                        details
                      </li>
                      <li>
                        Use the filters on the left to find your ideal
                        candidates!
                      </li>
                    </ul>
                  </div>
                  {/* START ----------------------------------------- Do not show again checkbox */}
                  {Number(profileData?.settings?.posted_project_count || 0) >=
                    CONSTANTS.VALUE_TO_SHOW_POSTED_PROJECT_MODAL_CHECKBOX && (
                    <div className="flex items-center justify-center mb-6">
                      <label className="flex items-center space-x-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={isCheckedDoNotShowAgain}
                          onChange={(e) => {
                            setIsCheckedDoNotShowAgain(e.target.checked);
                          }}
                        />
                        <span>Please do not show this notice again</span>
                      </label>
                    </div>
                  )}
                  {/* END ------------------------------------------- Do not show again checkbox */}
                  <div className="flex justify-center">
                    <CustomButton
                      text={"Okay"}
                      className={`px-[2.5rem] py-[1.125rem] text-center transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full text-base border border-black hover:bg-black hover:text-white `}
                      onClick={handleOkay}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
