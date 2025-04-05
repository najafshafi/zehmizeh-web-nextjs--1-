import React, { useCallback } from "react";
import {
  Clock,
  DollarSign,
  AlertCircle,
  Receipt,
  PlayCircle,
} from "lucide-react";
import styled from "styled-components";

const StatsWrapper = styled.div<{ $visibleCards: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$visibleCards}, 1fr);
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(
      ${(props) => Math.min(props.$visibleCards, 2)},
      1fr
    );
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const MilestoneStats: React.FC<MilestoneStatsProps> = ({
  milestones,
  isHourly = false,
  isFreelancer = false,
}) => {
  const stats = milestones.reduce(
    (acc, milestone) => {
      if (isHourly) {
        switch (milestone.hourly_status) {
          case "pending":
            acc.waitingPayment++;
            break;
          case "paid":
            acc.completed++;
            break;
          case "waiting_for_release":
            acc.waitingPayment++;
            break;
          case "request_revision":
            acc.needsRevision++;
            break;
        }
      } else {
        switch (milestone.status) {
          case "pending":
            acc.pendingAcceptance++;
            break;
          case "paid":
            // Only count as work in progress, not awaiting payment
            acc.workInProgress++;
            break;
          case "completed_by_freelancer":
            // This should be in awaiting payment since work is completed
            acc.waitingPayment++;
            break;
          case "waiting_for_release":
            acc.waitingPayment++;
            break;
          case "request_revision":
            acc.needsRevision++;
            // Request revision should only count as work in progress
            acc.workInProgress++;
            break;
          case "released":
            acc.completed++;
            break;
        }
      }
      return acc;
    },
    {
      pendingAcceptance: 0,
      waitingPayment: 0,
      needsRevision: 0,
      completed: 0,
      workInProgress: 0,
    }
  );

  const handleCardClick = useCallback(
    (status: string) => {
      const statusAttribute = isHourly
        ? "data-hourly-status"
        : "data-milestone-status";

      const allMilestones = document.querySelectorAll(".milestone-item");
      allMilestones.forEach((element) => {
        const milestone = element as HTMLElement;
        milestone.style.backgroundColor = "";
        milestone.style.transition = "";
      });

      let targetMilestones: NodeListOf<Element>;
      if (isHourly) {
        if (status === "released") {
          targetMilestones = document.querySelectorAll(
            `[${statusAttribute}="paid"]`
          );
        } else if (status === "waiting_for_release") {
          targetMilestones = document.querySelectorAll(
            `[${statusAttribute}="pending"], [${statusAttribute}="waiting_for_release"]`
          );
        } else {
          targetMilestones = document.querySelectorAll(
            `[${statusAttribute}="${status}"]`
          );
        }
      } else {
        if (status === "waiting_for_release") {
          // Only include completed_by_freelancer and waiting_for_release in awaiting payment
          targetMilestones = document.querySelectorAll(
            `[${statusAttribute}="waiting_for_release"], [${statusAttribute}="completed_by_freelancer"]`
          );
        } else if (status === "work_in_progress") {
          // Work in progress includes paid and request_revision
          targetMilestones = document.querySelectorAll(
            `[${statusAttribute}="paid"], [${statusAttribute}="request_revision"]`
          );
        } else if (status === "released") {
          targetMilestones = document.querySelectorAll(
            `[${statusAttribute}="released"]`
          );
        } else {
          targetMilestones = document.querySelectorAll(
            `[${statusAttribute}="${status}"]`
          );
        }
      }

      if (targetMilestones.length > 0) {
        targetMilestones.forEach((element) => {
          const milestone = element as HTMLElement;
          milestone.style.transition = "background-color 0.3s ease";
          milestone.style.backgroundColor = "#f7dfa1";
        });

        const firstMilestone = targetMilestones[0] as HTMLElement;
        firstMilestone.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setTimeout(() => {
          targetMilestones.forEach((element) => {
            const milestone = element as HTMLElement;
            milestone.style.backgroundColor = "";
          });
        }, 3000);
      }
    },
    [isHourly]
  );

  // Calculate number of visible cards
  const getVisibleCardsCount = () => {
    let count = 0;
    if (!isHourly) {
      if (stats.needsRevision > 0) count++;
      if (stats.pendingAcceptance > 0) count++;
      if (stats.workInProgress > 0) count++;
    }
    if (stats.waitingPayment > 0) count++;
    if (stats.completed > 0) count++;
    return count;
  };

  const $visibleCards = getVisibleCardsCount();

  return (
    <StatsWrapper $visibleCards={$visibleCards}>
      {!isHourly && (
        <>
          {stats.needsRevision > 0 && (
            <StatCard
              $backgroundColor="#f7b731"
              onClick={() => handleCardClick("request_revision")}
            >
              <div className="content">
                <div className="icon-wrapper">
                  <AlertCircle size={18} color="white" />
                </div>
                <div className="text-content">
                  <div className="value">{stats.needsRevision}</div>
                  <div className="label">Revision</div>
                </div>
              </div>
            </StatCard>
          )}

          {stats.pendingAcceptance > 0 && (
            <StatCard
              $backgroundColor="#4361ee"
              onClick={() => handleCardClick("pending")}
            >
              <div className="content">
                <div className="icon-wrapper">
                  <Clock size={18} color="white" />
                </div>
                <div className="text-content">
                  <div className="value">{stats.pendingAcceptance}</div>
                  <div className="label">Milestone Pending</div>
                </div>
              </div>
            </StatCard>
          )}

          {stats.workInProgress > 0 && (
            <StatCard
              $backgroundColor="#3498db"
              onClick={() => handleCardClick("work_in_progress")}
            >
              <div className="content">
                <div className="icon-wrapper">
                  <PlayCircle size={18} color="white" />
                </div>
                <div className="text-content">
                  <div className="value">{stats.workInProgress}</div>
                  <div className="label">Work in Progress</div>
                </div>
              </div>
            </StatCard>
          )}
        </>
      )}

      {stats.waitingPayment > 0 && (
        <StatCard
          $backgroundColor="#dc1a1a"
          onClick={() => handleCardClick("waiting_for_release")}
        >
          <div className="content">
            <div className="icon-wrapper">
              <DollarSign size={18} color="white" />
            </div>
            <div className="text-content">
              <div className="value">{stats.waitingPayment}</div>
              <div className="label">Awaiting Payment</div>
            </div>
          </div>
        </StatCard>
      )}

      {stats.completed > 0 && (
        <StatCard
          $backgroundColor="#2db874"
          onClick={() => handleCardClick("released")}
        >
          <div className="content">
            <div className="icon-wrapper">
              <Receipt size={18} color="white" />
            </div>
            <div className="text-content">
              <div className="value">{stats.completed}</div>
              <div className="label">Paid</div>
            </div>
          </div>
        </StatCard>
      )}
    </StatsWrapper>
  );
};

const StatCard = styled.div<{ $backgroundColor: string }>`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  border: 1px solid #eee;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  }

  .content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.$backgroundColor};
    padding: 0.5rem;
    border-radius: 6px;
    opacity: 0.9;
  }

  .text-content {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    line-height: 1;
  }

  .label {
    color: #666;
    font-weight: 500;
  }
`;

interface Milestone {
  status?: string;
  hourly_status?: string;
  milestone_id?: number;
  hourly_id?: number;
  is_paid?: number;
}

interface MilestoneStatsProps {
  milestones: Milestone[];
  isHourly?: boolean;
  isFreelancer?: boolean;
}

export default MilestoneStats;
