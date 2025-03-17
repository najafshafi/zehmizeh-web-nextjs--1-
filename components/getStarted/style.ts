import styled from 'styled-components';

export const GetStartedWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  z-index: 99;
  user-select: none;
  font-size: 18px;
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  div:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    div {
      background-color: ${({ theme }) => theme.colors.primary};
      cursor: pointer;
      span {
        margin-left: 8px;
      }
    }
  }
  .get-started {
    border-radius: 6px;
    padding: 4px 8px;
    .pending-count {
      position: absolute;
      right: -12px;
      top: -12px;
      font-size: 12px;
      background-color: red;
      border-radius: 50%;
      padding: 3px 8px;
    }
  }
  .cross {
    border-radius: 0px 0px 50% 50%;
    padding: 6px 6px;
    img {
      height: 20px;
      width: 20px;
      color: white;
    }
  }

  .get-started-modal {
    overflow: hidden;
    position: absolute;
    bottom: 34px;
    width: 400px;
    background: white;
    padding: 20px;
    border-radius: 10px 10px 10px 0px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    &.full-width {
      width: 90vw;
    }
    ul {
      margin: 0px;
      padding: 0px;
      li {
        text-decoration: underline;
        a:hover {
          color: ${({ theme }) => theme.colors.primary};
        }
        &.completed {
          pointer-events: none;
          text-decoration: line-through;
        }
      }
    }
  }
  .get-started-modal-transition-enter {
    max-width: 300px;
    max-height: 0px;
    padding: 0px;
    opacity: 0;
    &.full-width {
      max-width: 50vw;
    }
  }
  .get-started-modal-transition-enter-active {
    opacity: 1;
    max-width: 400px;
    max-height: 300px;
    padding: 20px;
    transition: all 1000ms;
    &.full-width {
      max-width: 90vw;
    }
  }
  .get-started-modal-transition-exit {
    opacity: 1;
    max-width: 400px;
    max-height: 300px;
    &.full-width {
      max-width: 90vw;
    }
  }
  .get-started-modal-transition-exit-active {
    opacity: 0;
    max-width: 0px;
    max-height: 0px;
    transition: all 1000ms;
    &.full-width {
      max-width: 50vw;
    }
  }
`;
