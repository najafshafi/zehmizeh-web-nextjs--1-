import { Form, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import Search from '../../public/icons/searchIcon.svg';
import CrossIcon from '../../public/icons/cross-black.svg';

const SearchWrapper = styled.div<{
  height?: number;
  enableBorder?: boolean;
}>`
  border: ${(props) =>
    props.enableBorder ? `1px solid ${props.theme.colors.gray6}` : 'none'};

  margin: 0.5rem;
  border-radius: 0.35rem;
  overflow: hidden;
  padding-left: 0.65rem;
  display: flex;
  height: ${(props) => (props.height ? `${props.height}px` : 'initial')};
  align-items: center;
  input {
    border: none !important;
    outline: none !important;
    height: 44px;
    flex: 1;
    padding: 0 0.5rem;
  }
  .form-control:focus {
    box-shadow: none;
  }
  svg {
    stroke: ${(props) => props.theme.colors.gray7};
  }
  .spinner {
    border: 2px solid currentColor;
    border-right-color: transparent;
    margin-right: 0.5rem;
  }
`;

type Props = {
  onChange: (e) => void;
  value: string;
  placeholder?: string;
  isLoading?: boolean;
  id?: string;
  onClear?: () => void;
  maxLength?: number;
  enableBorder?: boolean;
  height?: number;
};

function SearchBox({
  onChange,
  value,
  placeholder,
  isLoading = false,
  id,
  onClear,
  maxLength,
  enableBorder = true,
  height,
}: Props) {
  return (
    <SearchWrapper
      className={enableBorder ? 'active' : ''}
      enableBorder={enableBorder}
      height={height}
    >
      <Search />
      <Form.Control
        placeholder={placeholder || 'Search'}
        value={value}
        onChange={onChange}
        id={id || 'search-box'}
        maxLength={maxLength || 500}
      />
      {isLoading && <Spinner animation="border" className="spinner" />}
      {onClear && value !== '' && (
        <div className="mx-2 pointer" onClick={onClear}>
          <CrossIcon />
        </div>
      )}
    </SearchWrapper>
  );
}

export default SearchBox;
