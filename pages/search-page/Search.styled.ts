import styled from 'styled-components';

export const MainContainer = styled.div`
  min-height: 80vh;
  margin: auto;
  overflow: hidden;
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
  .info {
    max-width: 755px;
    margin: auto;
  }
`;

export const SliderWrapper = styled.div`
  margin: 1.125rem 0rem;
  width: 95%;
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
    width: 30px;
    height: 30px;
    border: solid 2px white;
    background: ${(props) => props.theme.colors.yellow};
    /* remove it later */
    top: 11px;
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
      font-size: 0.8125rem;
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
  .budget-input {
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
    top: 35%;
    bottom: 0;
    content: '$';
    left: 1rem;
  }
`;

export const BookmarkIcon = styled.div`
  height: 43px;
  width: 43px;
  border-radius: 2rem;
  background: ${(props) => props.theme.colors.body};
`;
