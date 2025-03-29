import React from "react";
import styled from "styled-components";
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

export const PostForm = styled.div`
  .heading {
    margin-top: 1.25rem;
  }
  .search {
    margin-top: 1.5rem;
  }
  .templates-list {
    max-height: 400px;
    overflow-y: auto;
  }
  .template {
    position: relative;
    padding: 1.5rem;
    margin-top: 1.25rem;
    border: 1px solid #dddddd;
    border-radius: 0.875rem;
    .title {
      line-height: 140%;
    }
    .description {
      opacity: 0.7;
      margin-top: 4px;
      line-height: 160%;
    }
    .skills {
      margin-top: 0.875rem;
    }
    .budget-row {
      margin-top: 1.25rem;
      letter-spacing: -0.01em;
    }
    .incomplete-badge {
      background: #ff1662;
      padding: 5px 12px;
      color: #fff;
      border-radius: 0.5rem;
      position: absolute;
      bottom: 1.5rem;
      right: 1.5rem;
    }
  }
  .active {
    border: ${(props) => `2px solid ${props.theme.colors.blue}`};
  }
  .no-data {
    min-height: 200px;
  }
`;

export const ChooseTemplateOrDraft = () => {
  const { selectedOption, selectedPost, setSelectedPost } = usePostJobContext();

  const [postData, setPostData] = React.useState<any>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchQuery = useDebounce(searchTerm, 500);
  const [loading, setLoading] = React.useState<boolean>(true);
  const postsRef = React.useRef();
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
        setPostData(res.data);
        postsRef.current = res.data;
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
          setPostData(res.data);
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

  const handleSelectPost = (item) => () => {
    setSelectedPost(item);
  };

  return (
    <PostForm>
      <h1 className="text-center">
        {selectedOption == "template" ? "Choose a Template" : "Choose a Draft"}
      </h1>
      <div className="search">
        <Search
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="templates-list d-flex-column text-start">
          {postData.length > 0 ? (
            postData.map((item) => (
              <div
                className={
                  selectedPost == item
                    ? "template pointer active"
                    : "template pointer"
                }
                key={
                  selectedOption == "template"
                    ? item.post_template_id
                    : item.job_post_id
                }
                onClick={handleSelectPost(item)}
              >
                <div className="title fs-24 fw-400 capital-first-ltr">
                  {convertToTitleCase(item.job_title)}
                </div>
                <div className="description fs-1rem fw-300">
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
                  <div className="skills d-flex flex-wrap gap-2">
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
                  <div className="incomplete-badge">Incomplete</div>
                )}
              </div>
            ))
          ) : (
            <NoDataFound className="mt-5" />
          )}
        </div>
      )}
      <FooterButtons />
    </PostForm>
  );
};

const BudgetAndDate = ({ budget, expectedDate }: any) => {
  if (budget.type == "fixed") {
    return (
      <div className="budget-row fs-20 fw-400">
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
      <div className="budget-row fs-20 fw-400">
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
