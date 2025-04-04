import styled from 'styled-components';
export type StatusColor =
  | 'green'
  | 'orange'
  | 'gray'
  | 'red'
  | 'pink'
  | 'blue'
  | 'naviblue'
  | 'violet'
  | 'purple'
  | 'darkblue'
  | 'darkPink'
  | 'pinkTint'
  | 'yellow';

type Props = {
  color: string;
};
export const StatusBadge = styled.span<Props>`
  background-color: ${({ color, theme }) => theme.statusColors[color as StatusColor].bg};
  color: ${({ color, theme }) => theme.statusColors[color as StatusColor].color};
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  line-height: 140%;
  font-weight: 400;
  white-space: nowrap;
  text-transform: capitalize;
`;
