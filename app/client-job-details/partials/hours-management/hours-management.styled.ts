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
  .row-gap {
    gap: 1.5rem;
  }
  .milestone-desc {
    margin-top: 1.5rem;
  }
  .line-height-100-perc {
    line-height: 100%;
  }
  .divider {
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const JobCloseMessageWrapper = styled.div`
  box-shadow: 0px 4px 74px rgba(0, 0, 0, 0.04);
  background: #ffffff;
  width: 816px;
  max-width: 100%;
  margin: 2.5rem auto;
  padding: 1.75rem;
  border-radius: 1.25rem;
  text-align: center;
  .btn-wrappers {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }
  h3 {
    font-size: 1.2rem;
  }
`;
