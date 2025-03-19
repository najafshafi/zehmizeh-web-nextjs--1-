import styled from 'styled-components';
import { Dropdown } from 'react-bootstrap';
import { ReactComponent as DownArrowIcon } from 'assets/icons/chevronDown.svg';

const searchTypes = [
  {
    label: 'Projects',
    key: 'jobs',
  },
  {
    label: 'Freelancers',
    key: 'freelancers',
  },
];

const TypeDropdown = styled(Dropdown)`
  .dropdown-toggle {
    background: none;
    border: none;
    color: inherit;
    &::after {
      display: none;
    }
    margin-right: 1.5rem;
  }
  .dropdown-menu {
    border: 0;
    box-shadow: 0 0 15px rgb(0 0 0 / 25%);
    padding: 10px 20px;
    border-radius: 0.5rem;
    .dropdown-item {
      margin-top: 0.5rem;
      &:hover,
      &:active,
      &:focus,
      &:visited {
        background-color: transparent !important;
        color: ${({ theme }) => theme.colors.blue};
      }
    }
  }
`;
const TypeDropdownToggle = styled.div``;

const SearchTypeDropdown = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const searchType = params?.type;

  const changeSearchType = (type: string) => () => {
    window.location.href = `/search?type=${type}`;
  };

  return (
    <TypeDropdown className="pointer">
      <Dropdown.Toggle as={TypeDropdownToggle}>
        <div className="d-flex align-items-center">
          <div className="fs-18 mx-2">
            {searchType == 'jobs' ? 'Jobs' : 'Freelancers'}
          </div>
          <DownArrowIcon className="dropdown-arrow" />
        </div>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        {searchTypes.map((item: any) => (
          <Dropdown.Item
            key={item.key}
            className={`fs-20 ${searchType == item?.key ? 'fw-700' : 'fw-400'}`}
            onClick={changeSearchType(item.key)}
          >
            <div>{item.label}</div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </TypeDropdown>
  );
};

export default SearchTypeDropdown;
