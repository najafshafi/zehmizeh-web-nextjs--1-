"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { transition } from "@/styles/transitions";
import DeletePrompt from "@/components/ui/DeletePropmpt";
import { deletePortfolio } from "@/helpers/http/portfolio";
import { capitalizeFirstLetter } from "@/helpers/utils/misc";
import GalleryIcon from "@/public/icons/gallery.svg";
import DeleteIcon from "@/public/icons/trash.svg";
import { coverImgHandler } from "@/helpers/utils/coverImgHandler";

type Props = {
  data: {
    date_created: string;
    image_urls: string[];
    portfolio_id: number;
    project_name: string;
  };
  onUpdate: () => void;
  allowEdit: boolean;
};

const StyledPortfolioListItem = styled.div<{ $coverImage: string }>`
  border-radius: 0.5rem;
  .cover-img {
    border-radius: 0.5rem;
    background-image: ${(props) => `linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0) 50%,
        rgba(0, 0, 0, 0.85) 100%
      ),
      url(${props.$coverImage})`};
    width: 100%;
    position: relative;
    aspect-ratio: 1;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .project-name {
    font-size: 1.6rem !important;
    color: ${(props) => props.theme.colors.white};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .project-images-count {
    text-wrap: nowrap;
    background: rgba(0, 0, 0, 0.27);
    backdrop-filter: blur(7px);
    border-radius: 3rem;
    color: ${(props) => props.theme.colors.white};
  }
  .delete-btn {
    background-color: #fbf5e8;
    border-radius: 0.5rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
    ${() => transition()}
  }
  ${() => transition()}
`;

const PortfolioListItem = ({ data, onUpdate, allowEdit }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false);

  /** @function - This function will delete the project */
  const onDelete = () => {
    if (loading) return;

    setLoading(true);
    const body = {
      action: "delete_portfolio",
      portfolio_id: data.portfolio_id,
    };

    const promise = deletePortfolio(body);
    toast.promise(promise, {
      loading: "Please wait...",
      success: (res) => {
        onUpdate();
        setLoading(false);
        return res.message;
      },
      error: (err) => {
        setLoading(false);
        return (data ? err?.response : err?.message) || "error";
      },
    });
  };

  /** @function - This function will navigate to the project details page */
  const goToDetailsPage = () => {
    router.push(`/freelancer/portfolio/${data.portfolio_id}`);
  };

  /** @function - This will stop propagation of parent click and will open the delete prompt */
  const openDeletePrompt = (e: any) => {
    e.stopPropagation();
    toggleDeletePrompt();
  };

  /** @function - This will toggle the delete prompt */
  const toggleDeletePrompt = () => {
    setShowDeletePrompt(!showDeletePrompt);
  };

  return (
    <>
      <StyledPortfolioListItem
        $coverImage={coverImgHandler(data.image_urls[0])}
        className="cursor-pointer"
        onClick={goToDetailsPage}
      >
        <div className="cover-img flex items-end gap-3">
          <div className="flex justify-between items-center p-3 gap-3 flex-1">
            <div className="project-name text-xl font-bold ">
              {data.project_name && capitalizeFirstLetter(data.project_name)}
            </div>

            <div className="project-images-count py-2 px-3 flex items-center gap-1">
              <GalleryIcon /> {data.image_urls?.length}
            </div>

            {allowEdit && (
              <div
                className="delete-btn p-3 cursor-pointer"
                onClick={openDeletePrompt}
              >
                <DeleteIcon />
              </div>
            )}
          </div>
        </div>
      </StyledPortfolioListItem>
      <DeletePrompt
        loading={loading}
        show={showDeletePrompt}
        toggle={toggleDeletePrompt}
        text="Are you sure you want to delete this album?"
        onDelete={onDelete}
        cancelButtonText="Cancel"
      />
    </>
  );
};

export default PortfolioListItem;
