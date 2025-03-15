import { pxToRem } from '@/helpers/utils/misc';
import styled from 'styled-components';

const GradientText = styled.span<{ size?: number }>`
  font-size: ${(props) => pxToRem(props.size || 16)};
  display: inline-block;
  color: ${(props) => props.theme.colors.yellow};
`;

export default GradientText;
