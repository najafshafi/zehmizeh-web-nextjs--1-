import styled from 'styled-components';
import { transition } from '@/styles/transitions';

export const FormWrapper = styled.div`
  gap: 2rem;

  .suggested-skills {
    color: #656565;
  }
  .locations-list {
    box-shadow: 0px 4px 60px rgba(0, 0, 0, 0.05);
    background: ${(props) => props.theme.colors.white};
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
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

  .character-counter {
    text-align : right;
    color: rgb(242, 180, 32);
    margin-top 10px;
  }

  .profile__img {
    height: 9.5625rem;
    width: 9.5625rem;
    border-radius: 50%;
    border: 1px solid ${(props) => props.theme.colors.gray5};
    position: relative;
  }
  .img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
  .edit-picture-btn {
    position: absolute;
    background: #f7faff;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    bottom: 0px;
    right: 0px;
    ${() => transition()}
  }
`;

export const StyledFormGroup = styled.div`
  margin-top: 1.25rem;
  .form-input {
    margin-top: 6px;
    padding: 1rem 1.25rem;
    border-radius: 7px;
    border: ${(props) => `1px solid ${props.theme.colors.gray6}`};
  }

  /* For adding $ currency inside input */
  .input-symbol-euro {
    position: relative;
    color: ${(props) => props.theme.colors.gray4};
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
  /*  */
`;
