import cns from 'classnames';
import styled from 'styled-components';
import Tooltip from '@/components/ui/Tooltip';
import  Info  from "../../public/icons/info-circle-gray.svg";

const Wrapper = styled.div<{ $breakPoint?: string; $fontSize?: string }>`
  position: relative;
  display: flex;
  @media (max-width: 767px) {
    justify-content: center;
  }
  .tab-container {
    display: flex;
    justify-content: space-around;
    gap: 0.25rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 50px;
    gap: 4px;
    padding: 4px;
  }
  .tab {
    /* padding: 0 1.75rem; */
    padding: 0 1.75rem;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 28px;
    transition: all 0.5s;
    white-space: nowrap;
    font-size: ${(props) => (props.$fontSize ? props.$fontSize : '20px')};
    color: ${({ theme }) => theme.colors.gray3};
    &:hover {
      color: inherit;
      background-color: ${(props) => props.theme.colors.white};
    }
    &.active {
      color: ${(props) => props.theme.colors.black};
      background-color: ${(props) => props.theme.colors.white};
      box-shadow: 0px 4px 1rem rgba(0, 0, 0, 0.04);
    }
  }
  .horizontal-tabs {
    display: flex;
  }
  .overlay {
    display: none;
  }
  @media (max-width: 767px) {
    width: 100%;
    .horizontal-tabs {
      padding-right: 50px;
      max-width: 100%;
      overflow-x: auto;
      ::-webkit-scrollbar {
        height: 0px;
      }
    }
    .overlay {
      display: block;
      position: absolute;
      width: 80px;
      height: 100%;
      right: 0;
      top: 0;
      transform: translateX(0.85rem);
      background: linear-gradient(270deg, #fefbf4 0%, #fefbf4 20%, transparent 100%);
    }
  }
  .count {
    background: ${(props) => props.theme.colors.black};
    border-radius: 2.5rem;
    padding: 0.375rem 0.875rem;
    color: ${(props) => props.theme.colors.white};
  }
`;

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  className,
  breakPoint,
  counts,
  fontSize,
}: {
  tabs: {
    label: string;
    id: number;
    key: string;
    tooltip?: string;
    hasCounts?: boolean;
  }[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
  breakPoint?: string;
  fontSize?: string;
  counts?: { [key: string]: number };
}) => {
  const onChange = (key: string) => () => onTabChange(key);
  return (
    <Wrapper className={className} $breakPoint={breakPoint} $fontSize={fontSize}>
      <div className="horizontal-tabs">
        <div className="tab-container">
          {tabs?.map((item) => (
            <button
              key={item.key}
              className={cns('tab font-normal cursor-pointer', {
                active: activeTab === item.key,
              })}
              onClick={onChange(item.key)}
            >
              {item.label}
              {item.hasCounts ||
                (counts && counts[item.key] > 0 && (
                  <div className="count text-sm font-normal ms-2">{counts[item.key] || 0}</div>
                ))}
              {item.tooltip && (
                <Tooltip
                  customTrigger={
                    <div className="text-sm mx-1">
                      <Info />
                    </div>
                  }
                >
                  {item.tooltip}
                </Tooltip>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="overlay" />
    </Wrapper>
  );
};

export default Tabs;
