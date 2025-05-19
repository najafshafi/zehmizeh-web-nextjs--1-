import { usePathname, useRouter } from "next/navigation";
import { FAQ_QUESTIONS } from "@/helpers/const/faqQuestions";
import BackButton from "@/components/ui/BackButton";
import styled from "styled-components";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import { useState, Suspense } from "react";
import { useAuth } from "@/helpers/contexts/auth-context";
import CustomButton from "@/components/custombutton/CustomButton";

const FaqTopicContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  .faqBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100px;
    border: 1px solid #aaa;
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: ${(props) => props.theme.statusColors.yellow.bg};
      color: ${(props) => props.theme.statusColors.yellow.color};
      border-color: ${(props) => props.theme.statusColors.yellow.color};
    }
  }
  @media ${breakpoints.mobile} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const QuestionAnswerContainer = styled.div`
  p {
    margin: 0px 0px;
  }
`;

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const AccordionItem = ({ item }: { item: FaqItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" border border-gray-200 overflow-hidden">
      <button
        className={`w-full flex justify-between items-center p-4 font-medium text-left text-gray-700 ${
          isOpen ? "bg-[#FBF5E9] text-primary font-semibold" : "bg-white"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.question}</span>
        <svg
          className={`w-6 h-6 transform ${
            isOpen ? "rotate-180" : ""
          } transition-transform duration-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && <div className="p-4 bg-white">{item.answer}</div>}
    </div>
  );
};

// Loading component for Suspense fallback
const FaqLoading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-2">Loading FAQ content...</p>
  </div>
);

// Client component that uses the navigation hooks
const FaqFormClient = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Extract section ID from pathname
  // Pattern: /support/faq/[sectionId]
  const pathParts = pathname?.split("/") || [];
  const sectionId = pathParts.length > 3 ? pathParts[3] : undefined;

  const contentList = [
    { text: "ZMZ Basics", id: "basics" },
    { text: "Signing Up as a Freelancer", id: "signing_up_as_a_freelancer" },
    { text: "Stripe Questions", id: "stripe" },
    { text: "Getting Hired", id: "getting_hired" },
    { text: "Working a Project", id: "working_a_project" },
  ];

  const HaventSelectedAnySection = (
    <>
      <p className="my-5  px-3">
        Are you confused about something on ZehMizeh? We&apos;ve collected all
        the answers to our most frequently asked questions below. Click the
        topic you&apos;d like to learn more about
      </p>
      <FaqTopicContainer>
        {contentList.map(({ id, text }) => {
          return (
            <div
              className="faqBox"
              key={id}
              onClick={() => router.push(`/support/faq/${id}`)}
            >
              <b className="my-0">{text}</b>
            </div>
          );
        })}
      </FaqTopicContainer>
    </>
  );

  const data = sectionId && FAQ_QUESTIONS[sectionId];
  const SelectedSection = data && (
    <QuestionAnswerContainer>
      <BackButton className="mb-3" onBack={() => router.push("/support/faq")} />
      <div className="accordion">
        {data.map((item: FaqItem) => (
          <AccordionItem key={item.question} item={item} />
        ))}
      </div>
    </QuestionAnswerContainer>
  );

  if (user.user_type === "freelancer")
    return (
      <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_4px_74px_rgba(0,0,0,0.04)] md:p-8">
        <h4 className="text-center mb-3 text-2xl font-semibold">
          Frequently Asked Questions
        </h4>
        <div>
          {sectionId ? SelectedSection : HaventSelectedAnySection}
          <div className="my-4 text-center px-4">
            <p>
              If you don&apos;t see an answer to your question here, click the
              button below to see our ZMZ Help Center, where we keep the rest of
              our answers. (You can also can also directly submit questions to
              ZMZ staff there!)
            </p>
            <div className="flex justify-center my-4">
              <CustomButton
                className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
                onClick={() =>
                  window.open("https://intercom.help/zehmizehfaq/en", "_blank")
                }
                text="Take me to the Help Center!"
              />
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-[1.25rem] shadow-[0_4px_74px_rgba(0,0,0,0.04)] md:p-8">
      <h4 className="text-center mb-3 text-2xl font-semibold">
        Frequently Asked Questions
      </h4>
      <div>
        <p>
          Are you confused about something you see on ZehMizeh? Would you like
          to learn more about how the site works? Click the button below to see
          our ZMZ Help Center, where we&apos;ve collected answers to all of your
          most frequently asked questions!
        </p>
        <div className="my-4 flex justify-center">
          <CustomButton
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={() =>
              window.open("https://intercom.help/zehmizehfaq/en", "_blank")
            }
            text="Take me to the Help Center!"
          />
        </div>
      </div>
    </div>
  );
};

// Main component wrapped in Suspense boundary
const FaqForm = () => {
  return (
    <Suspense fallback={<FaqLoading />}>
      <FaqFormClient />
    </Suspense>
  );
};

export default FaqForm;
