import styled from 'styled-components';

export const BudgetSliderWrapper = styled.div`
  text-align: left;
  .rc-slider-rail,
  .rc-slider-track,
  .rc-slider-step {
    height: 12px;
  }
  .rc-slider-track {
    background: ${(props) => props.theme.colors.yellow};
  }
  .rc-slider {
    height: 44px;
    padding: 1rem 0;
  }
  .rc-slider-handle {
    width: 40px;
    height: 40px;
    border: solid 2px white;
    background: ${(props) => props.theme.colors.yellow};
    /* remove it later */
    top: 5px;
    opacity: 1;
  }
  .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
    border-color: white;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.35);
  }
  /* TODO: move below rules to components  */
  .diteched-labels {
    span {
      width: 150px;
      font-size: 0.857rem;
      color: ${(props) => props.theme.colors.gray4};
      text-align: center;
      &:first-child {
        text-align: left;
      }
      &:last-child {
        text-align: right;
      }
    }
  }
  .budget-options {
    margin-bottom: 1rem;
  }
  .unsure-budget-qa {
    margin: 0.75rem 0rem;
  }
  .recommendation {
    margin: 0.75rem 0rem 1.75rem 0rem;
  }
  .budget-input {
    max-width: 140px;
    border-radius: 7px;
    padding: 1rem 1rem;
    padding-left: 1.625rem;
  }
  .input-symbol-euro {
    position: relative;
    color: ${(props) => props.theme.colors.gray4};
  }
  .input-symbol-euro:before {
    position: absolute;
    top: 28%;
    bottom: 0;
    content: '$';
    left: 1rem;
  }
  .budget-no {
    width: 50%;
  }
`;
