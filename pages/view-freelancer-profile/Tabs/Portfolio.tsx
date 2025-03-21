"use client";
import { useState } from "react";
import styled from "styled-components";
import Loader from "@/components/Loader";
import AddPortfolioModal from "@/components/portfolio/AddPortfolioModal";
import NoPortfolioView from "@/components/portfolio/NoPortfolioView";
import PortfolioListItem from "@/components/portfolio/PortfolioListItem";
import { transition } from "@/styles/transitions";
import PlusIcon from "@/public/icons/plus-yellow.svg";
import { useQueryData, useRefetch } from "@/helpers/hooks/useQueryData";
import { usePathname } from "next/navigation";
import { queryKeys } from "@/helpers/const/queryKeys";
import { StyledButton } from "@/components/forms/Buttons";

const AddNewBlock = styled.div`
  background: ${(props) => props.theme.colors.white};
  height: 100%;
  color: ${(props) => props.theme.colors.gray8};
  border-radius: 0.5rem;
  border: 1.5px dashed ${(props) => props.theme.colors.gray8};
  ${() => transition()}
  min-height: 150px;
`;

// Define the portfolio item type based on what PortfolioListItem expects
type PortfolioItem = {
  date_created: string;
  image_urls: string[];
  portfolio_id: number;
  project_name: string;
};

export const Portfolio = ({ allowEdit = true }: { allowEdit?: boolean }) => {
  const pathname = usePathname();
  // Extract freelancerId from the pathname
  const freelancerId = pathname ? pathname.split("/").pop() || "" : "";

  const [showAddPortfolioModal, setShowAddPortfolioModal] =
    useState<boolean>(false);

  const { data: portfolioData = [], isLoading } = useQueryData<PortfolioItem[]>(
    queryKeys.getFreelancerPortfolio(freelancerId)
  ) || { data: [] };
  const { refetch } = useRefetch(
    queryKeys.getFreelancerPortfolio(freelancerId)
  );
  const initialCount = 6;
  const [count, setCount] = useState(initialCount);

  const toggleAddPortfolioModal = () => {
    setShowAddPortfolioModal(!showAddPortfolioModal);
  };

  const toggleCount = () => {
    setCount(count === initialCount ? portfolioData.length : initialCount);
  };

  return (
    <>
      <div className="title fs-28 fw-400">
        Portfolio {portfolioData.length === 0 && "(Not Added)"}
      </div>
      {isLoading && <Loader />}

      {allowEdit && (
        <AddPortfolioModal
          show={showAddPortfolioModal}
          onClose={toggleAddPortfolioModal}
          onUpdate={refetch}
        />
      )}

      {portfolioData.length === 0 && (
        <NoPortfolioView
          allowEdit={allowEdit}
          onAddProject={toggleAddPortfolioModal}
        />
      )}

      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${
          portfolioData.length > 0 ? "mt-4" : ""
        }`}
      >
        {allowEdit && !isLoading && portfolioData.length > 0 && (
          <div className="mb-4">
            <AddNewBlock
              className="flex flex-col items-center justify-center fs-1rem fw-400 cursor-pointer"
              onClick={toggleAddPortfolioModal}
            >
              <PlusIcon className="mb-3" />
              Add New Portfolio Album
            </AddNewBlock>
          </div>
        )}
        {!isLoading &&
          portfolioData.slice(0, count).map((item: PortfolioItem) => (
            <div key={item.portfolio_id} className="mb-4">
              <PortfolioListItem
                data={item}
                onUpdate={refetch}
                allowEdit={allowEdit}
              />
            </div>
          ))}
      </div>
      {portfolioData.length > initialCount && (
        <div className="flex items-center justify-center mt-2">
          <StyledButton variant="outline-dark" onClick={toggleCount}>
            See {count !== initialCount ? "Less" : "More"}
          </StyledButton>
        </div>
      )}
    </>
  );
};
