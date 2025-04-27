"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { VscClose } from "react-icons/vsc";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import ErrorMessage from "@/components/ui/ErrorMessage";
import useResponsive from "@/helpers/hooks/useResponsive";
import { useAuth } from "@/helpers/contexts/auth-context";
import { addNewMessage } from "@/store/redux/slices/talkjsSlice";
import { AppDispatch } from "@/store/redux/store";
import { AddMessagePayload } from "@/store/redux/slices/chat.interface";
import CustomButton from "../custombutton/CustomButton";

interface FormProp {
  message: string;
}

interface ProposalData {
  _client_user_id?: string;
  user_id?: string;
  invite_id?: string;
  proposal_id?: string;
}

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  freelancerName: string;
  proposal: ProposalData;
  jobId: string;
  messagePopupCount: number;
}

const ProposalMessageModal = ({
  show,
  setShow,
  freelancerName,
  proposal,
  jobId,
}: Props) => {
  const router = useRouter();
  const closeModal = () => setShow(false);
  const dispatch: AppDispatch = useDispatch();
  const { isMobile } = useResponsive();
  const { user } = useAuth();

  const schema = yup.object({
    message: yup.string().required("Message is required"),
  });

  const { formState, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const { errors } = formState;

  const onSubmit = async ({ message }: FormProp) => {
    const message_text = message.replaceAll("\n", " <br>");
    const payload: AddMessagePayload = {
      job_post_id: jobId,
      message_text,
      to_user_id:
        user.user_type === "freelancer"
          ? proposal?._client_user_id || ""
          : proposal?.user_id || "",
      type: "TEXT",
      tab: "invities",
      custom_chat_id: new Date().getTime(),
    };

    if (proposal.invite_id) {
      payload.invite_id = Number(proposal.invite_id);
    } else if (proposal.proposal_id) {
      payload.proposal_id = Number(proposal.proposal_id);
    }

    toast.loading("sending...");

    dispatch(addNewMessage({ message: payload })).then(() => {
      toast.remove();
      if (proposal?.invite_id) {
        router.push(`/messages-new/invite_${proposal?.invite_id}`);
        return "Message sent successfully.";
      } else if (proposal?.proposal_id) {
        router.push(`/messages-new/proposal_${proposal?.proposal_id}`);
        return "Message sent successfully.";
      }
      return "Message sent successfully.";
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeModal}
      />
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <div className="relative w-full max-w-[767px] transform  rounded-2xl bg-white px-4 py-8 md:p-12 text-left align-middle shadow-xl transition-all">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 md:top-0 md:-right-8 md:text-white text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <VscClose className="h-6 w-6" />
            </button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-2xl font-normal">
                Write <span className="capitalize">{freelancerName}</span> a
                message
              </div>

              <div className="mt-4">
                <textarea
                  className={`w-full p-3 rounded-lg border ${
                    errors?.message?.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-amber-500"
                  } focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200`}
                  placeholder="Write here..."
                  rows={5}
                  onChange={(e) =>
                    setValue("message", e.target.value, {
                      shouldValidate: true,
                    })
                  }
                />
                {errors?.message?.message && (
                  <ErrorMessage>{errors.message.message}</ErrorMessage>
                )}
              </div>

              <div className="flex justify-center">
                {/* <button
                  type="submit"
                  className={`px-8 py-4 text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors duration-200 ${
                    isMobile ? "w-full" : ""
                  }`}
                >
                  Send
                </button> */}

                <CustomButton
                  text="Send"
                  className={`px-10 py-4 text-base font-normal  bg-primary rounded-full transition-transform duration-200 hover:scale-105   ${
                    isMobile ? "w-full" : ""
                  }`}
                  onClick={handleSubmit(onSubmit)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalMessageModal;
