import React from "react";
import Search from "@/components/forms/Search";
import Loader from "@/components/Loader";
import { StatusBadge } from "@/components/styled/Badges";
import { getMyJobs, getPostTemplates } from "@/helpers/http/post-job";
import useDebounce from "@/helpers/hooks/useDebounce";
import NoDataFound from "@/components/ui/NoDataFound";
import StyledHtmlText from "@/components/ui/StyledHtmlText";
import { convertToTitleCase, showFormattedBudget } from "@/helpers/utils/misc";
import { FooterButtons } from "../partials/FooterButtons";
import { usePostJobContext } from "../context";

interface HourlyBudget {
  type: "hourly";
  isProposal: boolean;
  amount?: number;
  max_amount?: number;
  min_amount?: number;
}

interface FixedBudget {
  type: "fixed";
  isProposal: boolean;
  amount?: number;
  max_amount?: number;
  min_amount?: number;
}

type PostItem = {
  post_template_id?: string;
  job_post_id?: string;
  job_title: string;
  job_description: string;
  skills?: Array<{
    id: string;
    skill_name?: string;
    category_name?: string;
    name?: string;
  }>;
  budget: HourlyBudget | FixedBudget;
  expected_delivery_date?: string;
  incomplete?: boolean;
};

type BudgetAndDateProps = {
  budget: HourlyBudget | FixedBudget;
  expectedDate?: string;
};

export const ChooseTemplateOrDraft = () => {
  const { selectedOption, selectedPost, setSelectedPost } = usePostJobContext();

  const [postData, setPostData] = React.useState<PostItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const [loading, setLoading] = React.useState<boolean>(true);
  const postsRef = React.useRef<PostItem[]>([]);
  const COLORS = ["orange", "green", "blue"];

  /* START ----------------------------------------- Get Templates and draft posts */
  React.useEffect(() => {
    if (selectedOption == "template") {
      getTemplates();
    } else {
      getPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* END ------------------------------------------- Get Templates and draft posts */

  const getPosts = () => {
    getMyJobs("draft").then((res) => {
      if (res.status) {
        // Ensure each item has the required isProposal property
        const formattedData = res.data.map(
          (
            item: Omit<PostItem, "budget"> & {
              budget: Partial<HourlyBudget | FixedBudget>;
            }
          ) => ({
            ...item,
            budget: {
              ...item.budget,
              isProposal: item.budget.isProposal ?? false,
            },
          })
        );
        setPostData(formattedData);
        postsRef.current = formattedData;
      } else {
        setPostData([]);
      }
      setLoading(false);
    });
  };

  const getTemplates = React.useCallback(() => {
    if (selectedOption == "template") {
      setLoading(true);
      getPostTemplates(debouncedSearchQuery || "").then((res) => {
        if (res.status) {
          // Ensure each item has the required isProposal property
          const formattedData = res.data.map(
            (
              item: Omit<PostItem, "budget"> & {
                budget: Partial<HourlyBudget | FixedBudget>;
              }
            ) => ({
              ...item,
              budget: {
                ...item.budget,
                isProposal: item.budget.isProposal ?? false,
              },
            })
          );
          setPostData(formattedData);
        } else {
          setPostData([]);
        }
        setLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  React.useEffect(() => {
    if (debouncedSearchQuery !== null) {
      getTemplates();
    }
  }, [debouncedSearchQuery, getTemplates]);

  const handleSelectPost = (item: PostItem) => () => {
    setSelectedPost(item);
  };

  return (
    <div className="mt-5">
      <h1 className="text-3xl font-bold text-center">
        {selectedOption == "template" ? "Choose a Template" : "Choose a Draft"}
      </h1>
      <div className="mt-6">
        <Search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col text-start max-h-[400px] overflow-y-auto">
          {postData.length > 0 ? (
            postData.map((item) => (
              <div
                className={`relative p-6 mt-5 border rounded-[0.875rem] cursor-pointer ${
                  selectedPost == item
                    ? "border-2 border-black"
                    : "border-[#dddddd]"
                }`}
                key={
                  selectedOption == "template"
                    ? item.post_template_id
                    : item.job_post_id
                }
                onClick={handleSelectPost(item)}
              >
                <div className="text-2xl font-normal leading-[140%] first-letter:capitalize">
                  {convertToTitleCase(item.job_title)}
                </div>
                <div className="mt-1 text-base font-light leading-[160%] opacity-70">
                  <StyledHtmlText
                    htmlString={item.job_description}
                    needToBeShorten={true}
                    id={
                      selectedOption == "template"
                        ? `template_${item.post_template_id}`
                        : `job_${item.job_post_id}`
                    }
                  />
                </div>

                {item?.skills && (
                  <div className="flex flex-wrap gap-2 mt-3.5">
                    {item?.skills?.map((skill, index) => (
                      <StatusBadge
                        key={skill.id}
                        color={COLORS[index % COLORS.length]}
                      >
                        {skill?.skill_name ??
                          skill?.category_name ??
                          skill?.name}
                      </StatusBadge>
                    ))}
                  </div>
                )}
                <BudgetAndDate
                  budget={item?.budget}
                  expectedDate={item?.expected_delivery_date}
                />
                {item.incomplete && (
                  <div className="absolute bottom-6 right-6 bg-[#ff1662] text-white py-[5px] px-3 rounded-lg">
                    Incomplete
                  </div>
                )}
              </div>
            ))
          ) : (
            <NoDataFound className="mt-5" />
          )}
        </div>
      )}
      <FooterButtons />
    </div>
  );
};

const BudgetAndDate = ({ budget, expectedDate }: BudgetAndDateProps) => {
  if (budget.type == "fixed") {
    return (
      <div className="mt-5 text-xl font-normal tracking-[-0.01em]">
        {budget?.amount == 1 ? (
          <>Open to proposals</>
        ) : (
          <>{showFormattedBudget(budget)} </>
        )}{" "}
        (Project-Based)
      </div>
    );
  } else if (budget.type == "hourly") {
    return (
      <div className="mt-5 text-xl font-normal tracking-[-0.01em]">
        {budget?.min_amount == 1 && budget?.max_amount == 1 ? (
          <>Open to proposals </>
        ) : (
          <>{showFormattedBudget(budget)}</>
        )}{" "}
        ({budget.type})
        {expectedDate && <span>&nbsp; | &nbsp;{expectedDate}</span>}
      </div>
    );
  } else return null;
};
