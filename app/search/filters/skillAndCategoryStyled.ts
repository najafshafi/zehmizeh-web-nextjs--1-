import { breakpoints } from '@/helpers/hooks/useResponsive';
import styled from 'styled-components';

export const SkillAndCategoryFilterWrapper = styled.div<{
  $isModalOpen: boolean;
  $type: 'SKILLS' | 'CATEGORIES';
}>`
  position: relative;
  .searchbox {
    margin: 10px 0px;
  }
  .form-check {
    display: flex;
    flex-direction: row;
    align-items: center;
    label {
      margin-left: 6px;
      text-transform: capitalize;
    }
  }
  .modal-wrapper {
    z-index: 99;
    top: 0;
    overflow: hidden;
    flex-direction: column;
    position: absolute;
    background-color: white;
    width: ${(props) => (props.$type === 'SKILLS' ? '1150px' : '900px')};
    height: ${(props) => (props.$type === 'SKILLS' ? '650px' : '400px')};
    padding: 10px 20px;
    display: ${({ $isModalOpen }) => ($isModalOpen ? 'flex' : 'none')};
    border: 1px solid #ccc;
    border-radius: 10px;
    .modal-search {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .items-ui {
      gap: ${(props) => (props.$type === 'SKILLS' ? '0px 24px' : '8px 24px')};
      margin-top: 10px;
      overflow-x: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      ${(props) =>
        props.$type === 'SKILLS' &&
        `
        .form-check-input{
          width: 18px;
          height: 18px;
        }
      `}
      .skills-list {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        height: 100%;
      }
      &::-webkit-scrollbar {
        height: 8px;
      }
      &::-webkit-scrollbar-track {
        background: #f1f1f1;
      }
      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 5px;
      }
      @media ${breakpoints.mobile} {
        flex-wrap: nowrap;
      }
    }
    .button-wrapper {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
    @media ${breakpoints.laptop} {
      position: fixed;
      top: 50%;
      max-width: 678px;
      width: calc(100% - 3.5rem);
      height: calc(100vh - 3.5rem);
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;
