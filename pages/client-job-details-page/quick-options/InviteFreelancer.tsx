/*
 * This is the Invite freelacner modal - This will list some recommended freelancers in the modal
 */
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import styled from "styled-components";
import { StyledButton } from "@/components/forms/Buttons";
import Loader from "@/components/Loader";
import TalentComponent from "./talent-component";
import { StyledModal } from "@/components/styled/StyledModal";
import PaginationComponent from "@/components/ui/Pagination";
import { getRecommendedFreelancers } from "@/helpers/http/search";
import { breakpoints } from "@/helpers/hooks/useResponsive";
import NoDataFound from "@/components/ui/NoDataFound";

type Props = {
  show: boolean;
  jobPostId: string;
  toggle: () => void;
  onNext: (jobId: string) => void;
};

const RECORDS_PER_PAGE = 10;

const Wrapper = styled.div`
  .search-box {
    max-width: 100% !important;
    margin-top: 2.5rem;
  }
  .list {
    height: 50vh;
    overflow-y: auto;
    padding: 0rem 1rem;
    @media ${breakpoints.mobile} {
      padding: 0;
    }
  }
  .job-item {
    padding: 1.5rem;
    margin: 1.25rem 0 0 0;
    border-radius: 14px;
    border: ${(props) => `2px solid ${props.theme.colors.gray5}`};
  }
  .job-item__details__description {
    opacity: 0.7;
  }
  .skills {
    margin-top: 0.875rem;
  }
  .job-item__budget {
    margin-top: 1.25rem;
  }
`;

const InviteFreelancer = ({ show, jobPostId, toggle, onNext }: Props) => {
  const [selectedFreelancers, setSelectedFreelancers] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const onContinue = () => {
    if (selectedFreelancers.length == 0) {
      toast.error("Please select freelancer(s).");
      return;
    }
    onNext(selectedFreelancers);
    setSelectedFreelancers([]);
  };

  const { data, isLoading, isRefetching } = useQuery(
    ["recommended-freelancers", jobPostId, currentPage],
    () =>
      getRecommendedFreelancers({
        job_id: jobPostId,
        page: currentPage,
        limit: RECORDS_PER_PAGE,
      }),
    {
      enabled: !!jobPostId,
      keepPreviousData: true,
    }
  );

  const onSelect = (id: string) => () => {
    if (selectedFreelancers.includes(id)) {
      const index = selectedFreelancers.indexOf(id);
      const selecteds = [...selectedFreelancers];
      selecteds.splice(index, 1);
      setSelectedFreelancers(selecteds);
    } else {
      setSelectedFreelancers([...selectedFreelancers, id]);
    }
  };

  const onPageChange = (page: { selected: number }) => {
    /* This will set next page as active and load new page data - Pagination is implemented locally  */
    const listContainer = document.getElementById("list");
    if (listContainer) {
      listContainer.scroll({ top: 0, behavior: "smooth" });
    }
    setCurrentPage(page?.selected + 1);
  };

  return (
    <StyledModal show={show} size="lg" onHide={toggle} centered>
      <Modal.Body>
        <Button variant="transparent" className="close" onClick={toggle}>
          &times;
        </Button>
        <Wrapper id="main-container">
          <div className="my-jobs">
            <h3 className="fs-36 fw-700">Recommended Freelancers</h3>
            {isLoading && <Loader />}
            <div className="list" id="list">
              {data?.data?.length
                ? data?.data?.map((item: any) => (
                    <TalentComponent
                      key={item.user_id}
                      data={item}
                      onSelect={onSelect(item.user_id)}
                      isSelected={selectedFreelancers?.includes(item.user_id)}
                    />
                  ))
                : !isLoading && !isRefetching && <NoDataFound />}
            </div>
          </div>

          {/* Pagination */}
          {!isLoading && data?.data?.length > 0 && (
            <div className="flex justify-center mt-3">
              <PaginationComponent
                total={Math.ceil(data?.total / RECORDS_PER_PAGE)}
                onPageChange={onPageChange}
                currentPage={currentPage}
              />
            </div>
          )}

          <div className="flex g-2 bottom-buttons flex-wrap">
            <StyledButton
              className="fs-16 font-normal"
              variant="primary"
              padding="0.8125rem 2rem"
              onClick={onContinue}
            >
              Invite
            </StyledButton>
          </div>
        </Wrapper>
      </Modal.Body>
    </StyledModal>
  );
};

export default InviteFreelancer;
