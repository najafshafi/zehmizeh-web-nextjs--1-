import styled from "styled-components";

const PhoneInputWrapper = styled.div`
  border: 1px solid #ced4da;
  position: relative;
  padding: 0 1rem;
  border-radius: 4px;
  label {
    font-size: 0.857rem;
    margin-top: 5px;
    /* margin-bottom: 5px; */
  }
  .flag-dropdown {
    border: none;
    background: none;
  }
  .react-tel-input {
    input {
      height: 44px;
      width: 100%;
      border: none;
      outline: none;
      box-shadow: none !important;
      outline: none;
    }
  }

  
`;
export default PhoneInputWrapper;

