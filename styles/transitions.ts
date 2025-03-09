import { css } from 'styled-components';

export const transition = (blur = 36) => css`
  transition: all 0.2s ease-in;
  &:hover {
    box-shadow: 0px 8px ${() => blur}px rgba(0, 0, 0, 0.16);
    transform: translateY(-2px);
  }
`;
