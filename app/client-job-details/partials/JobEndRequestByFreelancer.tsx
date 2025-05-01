import { useState } from "react";
import toast from "react-hot-toast";
import CustomButton from "@/components/custombutton/CustomButton";
import { cancelClosureRequest } from "@/helpers/http/jobs";

type Props = {
  show: boolean;
  toggle: () => void;
  error?: string;
  jobPostId: string;
  refetch: () => void;
  onConfirmEndJob: (completionStatus: string) => void;
};

const JobEndRequestByFreelancer = ({
  show,
  toggle,
  jobPostId,
  refetch,
  onConfirmEndJob,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onCancelClosureRequest = () => {
    setLoading(true);
    const promise = cancelClosureRequest(jobPostId);

    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setLoading(false);
        refetch();
        toggle();
        return res.response;
      },
      error: (err) => {
        setLoading(false);
        return err?.response?.data?.message || "error";
      },
    });
  };

  const onConfirm = (status: string) => () => {
    onConfirmEndJob(status);
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg max-w-[540px] w-full relative z-10">
            <div className="p-[2rem] px-[1rem] md:p-[3rem]">
              <div className="flex flex-col justify-center items-center">
                <div className="text-[20px] font-normal text-center mb-2">
                  The freelancer is requesting that you end this project. What
                  would you like to do?
                </div>
                <ul>
                  <li className="mt-2 text-[18px] font-normal text-left">
                    If the project is finished, you can mark the project as
                    complete and close the project.
                  </li>
                  <li className="mt-2 text-[18px] font-normal text-left">
                    If the project is not finished but you still want to accept
                    the freelancer’s request, you can mark the project as
                    incomplete and close the project.
                  </li>
                  <li className="mt-2 text-[18px] font-normal text-left">
                    If you do not want to close the project, you can decline the
                    request and discuss next steps with your freelancer.
                  </li>
                </ul>

                <CustomButton
                  text={"Close project and mark “Complete”"}
                  className="px-[2rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px]"
                  onClick={onConfirm("closed")}
                />

                <CustomButton
                  text={"Close project and mark “Incomplete”"}
                  className="px-[2rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px]"
                  onClick={onConfirm("in-complete")}
                  disabled={loading}
                />

                <CustomButton
                  text={"Decline closure request and discuss"}
                  className="px-[2rem] py-[1rem] transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[16px]"
                  disabled={loading}
                  onClick={onCancelClosureRequest}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobEndRequestByFreelancer;
