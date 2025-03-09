import styled from 'styled-components';

const Online = styled.span<{ status: 0 | 1 }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  background-color: ${(props) =>
    props.status ? props.theme.colors.green : props.theme.colors.orange};
`;
export default Online;
