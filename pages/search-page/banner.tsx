/*
 * This is the banner of the search page which has title and background spiral images
 */
import styled from "styled-components";
import PageTitle from "@/components/styled/PageTitle";
import SearchBannerLeftIcon from "@/public/icons/search-banner-left.svg";
import SearchBannerRightIcon from "@/public/icons/search-banner-right.svg";
import { useAuth } from "@/helpers/contexts/auth-context";
import Link from "next/link";

export const BannerWrapper = styled.div`
  padding: 5.75rem 0rem;
  position: relative;
  .banner-left-spiral {
    position: absolute;
    left: 10.8125rem;
    top: 2rem;
    z-index: -1;
  }
  .banner-right-spiral {
    position: absolute;
    right: 12.5rem;
    bottom: 0rem;
    z-index: -1;
  }
  a {
    color: ${(props) => props.theme.colors.yellow};
  }
`;

export default function Banner(props: any) {
  const { user } = useAuth();

  let searchHeader = "";

  if (props?.searchType == "jobs") searchHeader = "Find your next project now!";
  if (props?.searchType == "freelancers")
    searchHeader = "Hire top professionals from around the world!";
  if (props?.searchType == "freelancers" && user.user_type === "freelancer")
    searchHeader = "";

  return (
    <BannerWrapper>
      {/* banner left spiral background image */}
      <SearchBannerLeftIcon className="banner-left-spiral" />

      {/* Page title */}
      <PageTitle fontSize="2.25rem" className="text-center">
        {searchHeader}
      </PageTitle>

      {props?.searchType == "jobs" && (
        <div className="block text-center">
          Check{" "}
          <Link href={"/support/faq/getting_hired"}>How to Get Hired</Link>{" "}
          Faq&apos;s section for more info
        </div>
      )}

      {/* banner right spiral background image */}

      <SearchBannerRightIcon className="banner-right-spiral" />
      {props.children}
    </BannerWrapper>
  );
}
