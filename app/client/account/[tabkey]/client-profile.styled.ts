import { Container } from "react-bootstrap";
import styled from "styled-components";

export const Wrapper = styled(Container)`
  max-width: 1170px;

  padding: 0px 20px;
  .reset-password {
    color: ${(props) => props.theme.colors.lightBlue};
    transition: all 0.2s ease-in-out;
    :hover {
      transform: translateY(-2px);
    }
  }
  .close-account-btn {
    background-color: ${(props) => props.theme.colors.white};
    border: 1px solid ${(props) => props.theme.colors.white};
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.03);
    :hover,
    :focus {
      border: 1px solid ${(props) => props.theme.colors.white};
      background-color: ${(props) => props.theme.colors.white} !important;
    }
  }
`;

export const ClientProfileWrapper = styled.div`
  width: 90%;
  margin: auto;
  margin: 3rem auto;
  display: flex;
  gap: 2rem;
  position: relative;
  .phone-input-wrapper {
    border: 1px solid hsl(0, 0%, 80%) !important;
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 0;
    margin-top: 0;

    .form-group-wapper {
      flex-direction: column;
      gap: unset !important;
      align-items: start !important;
    }

    .email-input-wrapper,
  }
`;

export const ClientTabWrapper = styled.div`
  flex: none;
  min-width: 160px;

  @media (max-width: 768px) {
    padding: 2rem;
    position: sticky;
    top: 0px;
    left: 0px;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    background-color: rgb(255 255 255);
    border-bottom: 1px solid rgb(226, 226, 226);
    min-width: unset;
    z-index: 20;

    /* Hide scrollbar for Firefox */
    scrollbar-width: none;

    /* Hide scrollbar for IE and Edge */
    -ms-overflow-style: none;
  }
  .jaxk {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const ClientTab = styled.div`
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

export const ClientTitle = styled.div<{ "data-active"?: boolean }>`
  cursor: pointer;
  margin-top: 1rem;
  font-weight: ${(props) => (props["data-active"] ? 700 : 400)};
  font-size: 18px;
  @media (max-width: 768px) {
    margin-top: 0;
    min-width: fit-content;
  }
`;

export const ClientContent = styled.div`
  margin-top: 1rem;
  width: 100%;
  background: transparent;
  padding: 1rem;
`;

export const ContentBox = styled.div`
  box-shadow: rgba(0, 0, 0, 0.05) 0px 4px 60px;
  background-color: #fff;
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem auto;
  .form-input {
    border: 1px solid hsl(0, 0%, 80%) !important;
  }
`;
