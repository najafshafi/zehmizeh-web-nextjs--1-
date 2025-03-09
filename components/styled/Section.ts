import styled from 'styled-components';

type Colors = 'white';

export const Section = styled.div<{ bg?: Colors }>`
  padding: 100px 0;
  ${({ bg, theme }) => bg && `background-color: ${theme.colors[bg]};`}
`;

export const Content = styled.div<{
  width: number;
}>`
  width: 100%;
  max-width: ${({ width }) => `${width}px`};
`;
