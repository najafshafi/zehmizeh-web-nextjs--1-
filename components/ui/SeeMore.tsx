import styled from 'styled-components';

export const SeeMore = styled.span<{ $fontSize?: string }>`
  color: ${(props) => props.theme.colors.primary};
  display: inline;
  cursor: pointer;
  font-weight: 400;
  font-size: ${(props) => (props.$fontSize ? props.$fontSize : '0.8rem')};
`;
