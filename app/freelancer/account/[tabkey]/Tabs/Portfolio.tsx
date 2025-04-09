"use client"; // Ensure this is a client component
import { useEffect, useState } from "react";
import {
  MainPortfolioWrapper,
  PortSkillItem,
} from "../partials/portfolioStyles";
import DeleteIcon from "@/public/icons/trash.svg";
import EditIcon from "@/public/icons/edit-blue-outline.svg";
import DragIcon from "@/public/icons/drag.svg";
import DeletePrompt from "@/components/ui/DeletePropmpt";
import { toast } from "react-hot-toast";
import { addEditPortfolio, deletePortfolio } from "@/helpers/http/portfolio";
import usePortfolio from "@/controllers/usePortfolio";
import AddPortfolioModal from "@/components/portfolio/AddPortfolioModal";
import Loader from "@/components/Loader";
import PortfolioFiles from "../partials/PortfolioFiles";
import ReArrangePorfolioItems from "../partials/ReArrangePorfolioItems";
import CustomButton from "@/components/custombutton/CustomButton";
export const Portfolio = ({ allowEdit = true, freelancerId }: any) => {
  const {
    refetch,
    portfolioData: portfolios,
    isLoading,
    isRefetching,
  } = usePortfolio(freelancerId);

  const [portfolio, setPortfolio] = useState<any>({});
  const [showAddPortfolioModal, setShowAddPortfolioModal] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ignoreLoading, setIgnoreLoading] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false);
  const [isPorfolioRearrangeModal, setIsPorfolioRearrangeModal] =
    useState(false);

  const handler = () => {
    if (isPorfolioRearrangeModal) return null;
    setSelectedPortfolio(null);
    refetch();
  };
  useEffect(() => {
    handler();
  }, [isPorfolioRearrangeModal]);

  const toggleDeletePrompt = () => {
    setShowDeletePrompt(!showDeletePrompt);
  };

  const openDeletePrompt = (e: any, port: any) => {
    e.stopPropagation();
    toggleDeletePrompt();
    setPortfolio(port);
  };

  /** @function - This function will delete the project */
  const onDelete = () => {
    if (loading) return;

    setLoading(true);
    const body = {
      action: "delete_portfolio",
      portfolio_id: portfolio.portfolio_id,
    };

    const promise = deletePortfolio(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        refetch();
        setShowDeletePrompt(false);
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return (portfolio ? err?.response : err?.message) || "error";
      },
    });
  };

  const toggleAddPortfolioModal = () => {
    setShowAddPortfolioModal(!showAddPortfolioModal);
  };

  const onPosChange = (portfolio: any, images: any) => {
    const body: any = {
      action: "edit_portfolio",
      project_name: portfolio.project_name,
      image_urls: images,
      portfolio_id: portfolio.portfolio_id,
      project_year: portfolio.project_year,
      project_description: portfolio.project_description,
      project_skills: portfolio.project_skills,
    };

    setIgnoreLoading(true);
    const promise = addEditPortfolio(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        setIgnoreLoading(false);
        return res.message;
      },
      error: (err) => {
        console.log(err);
        setIgnoreLoading(false);
        return err?.message || "error";
      },
    });
  };

  if ((isRefetching || isLoading) && !ignoreLoading)
    return <Loader height={250} />;

  return (
    <div className="mb-5 ">
      {allowEdit && (
        <div className="flex items-center justify-center mb-5">
          <CustomButton
            className="px-9 py-4 transition-transform duration-200 hover:scale-105 font-normal text-black rounded-full bg-primary text-[18px]"
            onClick={() => {
              setSelectedPortfolio(null);
              toggleAddPortfolioModal();
            }}
            text="Add New Portfolio Album"
          />
        </div>
      )}

      {(!isRefetching || !isLoading) &&
        portfolios?.map((port: any) => (
          <MainPortfolioWrapper key={`port-id-${port.portfolio_id}`}>
            <div className="flex items-center mb-2">
              <h3 className="line-break project-name font-bold capitalize mb-1 text-[28px] break-words whitespace-pre-wrap overflow-hidden">
                {port.project_name}{" "}
                {port?.project_year && `(${port?.project_year})`}
              </h3>

              {allowEdit && (
                <>
                  <div
                    className="delete-btn p-2 cursor-pointer flex items-center"
                    onClick={() => {
                      setSelectedPortfolio(port);
                      toggleAddPortfolioModal();
                    }}
                  >
                    <EditIcon />
                  </div>
                  <div
                    className="delete-btn p-2 cursor-pointer flex items-center"
                    onClick={() => {
                      setSelectedPortfolio(port);
                      setIsPorfolioRearrangeModal(true);
                    }}
                  >
                    <DragIcon />

                    {/* <DragIcon stroke="#0067FF" fill="#0067FF" /> */}
                  </div>

                  <div
                    className="delete-btn p-2 cursor-pointer flex items-center"
                    onClick={(e) => openDeletePrompt(e, port)}
                  >
                    <DeleteIcon />
                  </div>
                </>
              )}
            </div>

            {/* Portfolio Skills */}
            {port?.project_skills && (
              <div className="mb-4">
                <p className="font-bold mb-2">
                  {port?.project_skills !== "[]" && "Project Skills"}
                </p>
                <div className="flex">
                  {typeof port?.project_skills === "string" ? (
                    port?.project_skills === "[]" ? (
                      <></>
                    ) : port?.project_skills.startsWith("[") ? (
                      JSON.parse(port?.project_skills).map(
                        (data: any, index: number) => (
                          <PortSkillItem
                            className="me-3"
                            key={`skill-item-port-${index}`}
                          >
                            {data.name}
                          </PortSkillItem>
                        )
                      )
                    ) : (
                      port?.project_skills
                        .split(",")
                        .map((data: any, index: number) => (
                          <PortSkillItem
                            className="me-3"
                            key={`skill-item-port-${index}`}
                          >
                            {data}
                          </PortSkillItem>
                        ))
                    )
                  ) : (
                    <PortSkillItem className="me-3" key={`skill-item-port`}>
                      {port?.project_skills}
                    </PortSkillItem>
                  )}
                </div>
              </div>
            )}

            {port?.project_description && (
              <div className="mb-4">
                <p className="font-bold mb-2 ">Project Description</p>
                <p className="line-break break-words whitespace-pre-wrap overflow-hidden">
                  {port?.project_description}
                </p>
              </div>
            )}

            <div className="px-5">
              <PortfolioFiles
                allowEdit={allowEdit}
                onPosChange={(updateImages) => onPosChange(port, updateImages)}
                files={port.image_urls}
              />
            </div>
          </MainPortfolioWrapper>
        ))}

      {allowEdit && (
        <>
          <DeletePrompt
            loading={loading}
            show={showDeletePrompt}
            toggle={toggleDeletePrompt}
            text="Are you sure you want to delete this album?"
            onDelete={() => onDelete()}
            cancelButtonText="Cancel"
          />

          {/* Add Portfolio Modal */}
          {showAddPortfolioModal && (
            <AddPortfolioModal
              portfolio={selectedPortfolio}
              show={showAddPortfolioModal}
              onClose={toggleAddPortfolioModal}
              onUpdate={refetch}
            />
          )}

          {isPorfolioRearrangeModal && (
            <ReArrangePorfolioItems
              refetch={refetch}
              freelancerId={freelancerId}
              show={isPorfolioRearrangeModal}
              onUpdate={() => {
                // console.log('on update')
              }}
              onClose={() => setIsPorfolioRearrangeModal(false)}
              portfolio={selectedPortfolio}
            />
          )}
        </>
      )}
    </div>
  );
};
