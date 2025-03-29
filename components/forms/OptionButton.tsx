import styled from 'styled-components';

export const OptionButton = styled.button<{
  selected: boolean;
  margin?: string;
  padding?: string;
  $fontSize?: string;
}>`
  color: ${(props) => props.theme.colors.black};
  border-radius: 0.875rem;
  padding: ${(props) => (props.padding ? props.padding : '1.25rem 1.5rem')};
  background: transparent;
  font-weight: 300;
  font-size: ${(props) => (props.$fontSize ? props.$fontSize : '1.125rem')};
  line-height: 128%;
  margin: ${(props) => (props.margin ? props.margin : '1rem 1rem 1rem 0rem')};
  :hover,
  :focus {
    background: transparent;
    color: ${(props) => props.theme.colors.black};
  }
  border: ${(props) =>
    props.selected
      ? `1px solid ${props.theme.colors.blue}`
      : `1px solid #d9d9d9`};
  ${(props) =>
    props.selected &&
    `outline: 1px solid ${props.theme.colors.blue}!important;`}
`;
