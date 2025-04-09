import styled from 'styled-components';

export const EditFormWrapper = styled.div`
  .content {
    gap: 2rem;
  }
  .suggested-skills {
    color: #656565;
  }
  .locations-list {
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
    background: ${(props) => props.theme.colors.white};
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
    max-height: 250px;
    overflow-y: auto;
    .list-item {
      padding: 1rem;
      border-radius: 8px;
      &:hover {
        background: ${(props) => props.theme.colors.gray2};
      }
    }
  }
`;

export const StyledFormGroup = styled.div`
  margin-top: 1.25rem;
  .form-input {
    margin-top: 6px;
    padding: 1rem 1.25rem;
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
  }

  .common-phone-number-input {
    padding: 0 1.25rem !important;
  }

  .phone-input-wrapper {
    border: ${(props) => `1px solid ${props.theme.colors.black}`};
    padding-left: 0;
    input {
      height: 58px;
      font-size: 1rem;
    }
  }
  .input-symbol-euro {
    position: relative;
  }
  .rate-input {
    padding-left: 1.625rem;
  }
  .input-symbol-euro:before {
    position: absolute;
    top: 30%;
    bottom: 0;
    content: '$';
    left: 1rem;
  }
  .active-button {
    border-color: ${(props) => props.theme.colors.black};
  }
  .email-input-wrapper {
    position: relative;
  }

  .email-input {
    padding-right: 100px;
  }

  .edit-button {
    position: absolute;
    right: 1rem;
    top: 35%;
  }
`;
