import { Image } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "./forms/Buttons";
import { goBack } from "helpers/utils/goBack";

const Wrapper = styled.div`
  height: 100vh;
`;

const Page404Title = styled.div`
  font-size: 3.25rem;
  margin-top: 2.5rem;
  color: ${(props) => props.theme.colors.yellow};
`;
const NotFoundText = styled.div`
  opacity: 0.9;
  margin-bottom: 0.938rem;
  margin-top: 1.25rem;
  font-size: 2rem;
`;
const NotFoundDescription = styled.div`
  color: ${(props) => props.theme.colors.black};
  margin-bottom: 2.25rem;
`;

function Page404() {
  const navigate = useNavigate();

  return (
    <Wrapper className="flex justify-center items-center flex-column">
      <Image
        src="images/notFound.png"
        width="250px"
        height="200px"
        fluid
        alt="no-page-found"
      />

      <Page404Title className="fw-bold">404</Page404Title>
      <NotFoundText className="fw-bold">Page not found!</NotFoundText>
      <NotFoundDescription className="fw-500 fs-1rem text-center">
        The page you are looking for doesn’t exist or is unavailable.
      </NotFoundDescription>
      <StyledButton onClick={() => goBack(navigate)}>Go back</StyledButton>
    </Wrapper>
  );
}

export default Page404;
