/*
 * This will list all the featured companies which are static right now
 */

import styled from 'styled-components';

// Companies list - TODO: I think this list should come from api
const FEATURED_COMPANIES = [
  { key: 'chromatic', image: '/images/chromatic.png' },
  { key: 'slack', image: '/images/slack.png' },
  { key: 'netflix', image: '/images/netflix.png' },
  { key: 'drone', image: '/images/drone.png' },
  { key: 'udemy', image: '/images/udemy.png' },
  { key: 'sanity', image: '/images/sanity.png' },
  { key: 'marvel', image: '/images/marvel.png' },
  { key: 'section', image: '/images/section.png' },
];

const CopmaniesWrapper = styled.div`
  padding: 6.25rem 0rem;
  .featured-companies-title {
    font-size: 2.625rem;
    line-height: 3.5rem;
  }
  .featured-companies-description {
    margin-top: 1rem;
    opacity: 0.63;
    line-height: 1.6875rem;
  }
  .company-list {
    margin-top: 3.4375rem;
  }
`;

export const FeaturedCompanyItem = styled.div`
  padding: 2.5rem;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.white};
  max-width: 292px;
  max-height: 122px;
  .featured-company-logo {
    max-width: 100%;
    max-height: 100%;
    resize: auto;
  }
`;

export default function FeaturedCompanies() {
  return (
    <CopmaniesWrapper className="justify-content-center text-center">
      <div className="featured-companies-title fw-400">Featured Companies</div>
      <div className="featured-companies-description fs-18 fw-400">
        Lorem Ipsum is simply dummy text of the printing and typesetting
      </div>
      {/* // TODO ? Here all the images of companies have different height and width, so how to manage that? */}
      <div className="company-list d-flex justify-content-center align-items-center flex-wrap gap-3">
        {FEATURED_COMPANIES.map((item: any) => (
          <FeaturedCompanyItem
            key={item.key}
            className="d-flex justify-content-center align-items-center"
          >
            <img
              src={item.image}
              className="featured-company-logo"
              alt="featured-company"
            />
          </FeaturedCompanyItem>
        ))}
      </div>
    </CopmaniesWrapper>
  );
}
