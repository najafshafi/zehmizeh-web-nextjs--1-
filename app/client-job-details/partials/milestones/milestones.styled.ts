import styled from 'styled-components';
export const MilestonesWrapper = styled.div`
  margin: 2.5rem auto auto;
  width: 816px;
  max-width: 100%;
  .add-button {
    margin-top: 1.5rem;
  }
`;

export const MileStoneListItem = styled.div`
  padding: 1.75rem;
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);
  background: ${(props) => props.theme.colors.white};
  margin-top: 1.5rem;
  border-radius: 1.25rem;
  .mlstn-completed-notice {
    background-color: rgb(251, 245, 232);
    border-radius: 0.5rem;
  }
  .status {
    min-width: max-content;
  }
  .milestone-desc {
    word-break: break-word;
  }
  .line-height-100-perc {
    line-height: 100%;
  }
  .more-popover {
    height: 3rem;
    width: 3rem;
    border: 1px solid #d9d9d9;
    border-radius: 0.5rem;
  }
  .form-group {
    margin-top: 1.25rem;
  }
  .form-input {
    border-radius: 7px;
    padding: 1rem 1.25rem;
  }
  .divider {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .bottom-buttons {
    justify-content: flex-end;
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
`;

export const FormWrapper = styled.div`
  .form-group {
    margin-top: 2.75rem;
  }
  .form-input {
    border-radius: 7px;
    padding: 1rem 1.25rem;
  }
  .bottom-buttons {
    justify-content: flex-end;
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
`;
