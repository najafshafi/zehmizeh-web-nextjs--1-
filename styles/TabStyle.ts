import styled from "styled-components";

export const TabWrapper = styled.div`
  flex: none;
  min-width: 160px;
  @media (max-width: 768px) {
    padding: 2rem;
    position: sticky;
    top: 0px;
    left: 0px;
    width: 100%;
    overflow: auto;
    ::-webkit-scrollbar {
      height: 0px;
    }
    background-color: rgb(255 255 255);
    border-bottom: 1px solid rgb(226, 226, 226);
    min-width: unset;
    z-index: 40;
  }
`;

export const Tab = styled.div`
  position: sticky;
  margin-top: 2rem;
  top: 2rem;

  @media (max-width: 768px) {
    margin-top: 0;
    gap: 2rem;
    margin: 0 1rem;
    display: flex;
    height: 100%;
    // justify-content: center;
    align-items: center;
    overflow: auto;
    ::-webkit-scrollbar {
      height: 0px;
    }
  }
`;

export const TabTitle = styled.div<{ $active?: boolean }>`
  cursor: pointer;
  margin-top: 1rem;
  font-size: 24px;
  font-weight: ${(props) => (props.$active ? 700 : 400)};
  @media (max-width: 768px) {
    margin-top: 0;
    min-width: fit-content;
  }
`;
