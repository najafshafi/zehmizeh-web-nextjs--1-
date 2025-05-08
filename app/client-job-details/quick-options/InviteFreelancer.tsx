/*
 * This is the Invite freelacner modal - This will list some recommended freelancers in the modal
 */
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import CustomButton from "@/components/custombutton/CustomButton";
import Loader from "@/components/Loader";
import TalentComponent from "./talent-component";
import PaginationComponent from "@/components/ui/Pagination";
import { getRecommendedFreelancers } from "@/helpers/http/search";
import NoDataFound from "@/components/ui/NoDataFound";

type Props = {
  show: boolean;
  jobPostId: string;
  toggle: () => void;
  onNext: (jobId: string) => void;
};

const RECORDS_PER_PAGE = 10;

const InviteFreelancer = ({ show, jobPostId, toggle, onNext }: Props) => {
  const [selectedFreelancers, setSelectedFreelancers] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

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

  const listContainerRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    if (typeof window === "undefined") return;

    const listContainer = listContainerRef.current;
    if (
      listContainer &&
      Math.ceil(listContainer.scrollTop + listContainer.clientHeight) >=
        listContainer.scrollHeight - 100 &&
      !isLoading &&
      data?.total > page * RECORDS_PER_PAGE &&
      !loadingMore
    ) {
      setLoadingMore(true);
      setPage(page + 1);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={toggle}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div id="main-container">
              <div className="my-jobs">
                <h3 className="text-4xl font-bold">Recommended Freelancers</h3>
                {isLoading && <Loader />}
                <div
                  ref={listContainerRef}
                  id="list"
                  className="h-[50vh] overflow-y-auto px-4 sm:px-0"
                  onScroll={onScroll}
                >
                  {data?.data?.length
                    ? data?.data?.map((item: any) => (
                        <TalentComponent
                          key={item.user_id}
                          data={item}
                          onSelect={onSelect(item.user_id)}
                          isSelected={selectedFreelancers?.includes(
                            item.user_id
                          )}
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
                <CustomButton
                  text="Invite"
                  className="px-8 py-4 text-base font-normal rounded-full bg-primary text-black transition-transform duration-200 hover:scale-105"
                  onClick={onContinue}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFreelancer;
