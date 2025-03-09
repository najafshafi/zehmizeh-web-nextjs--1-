import { FREELANCER_PROFILE_TABS } from 'helpers/const/tabs';
import { TFreelancerProfileSettingsPathParams } from 'helpers/types/pathParams.type';
import { useNavigate, useParams } from 'react-router-dom';
import { Tab, TabTitle, TabWrapper } from 'styles/TabStyle';

export const Tabs = () => {
  const { tabkey } = useParams<TFreelancerProfileSettingsPathParams>();

  const navigate = useNavigate();

  if (Object.values(FREELANCER_PROFILE_TABS).findIndex((tab) => tab === tabkey) === -1) {
    navigate(`/freelancer/account/${FREELANCER_PROFILE_TABS.PROFILE}`, {
      replace: true,
    });
    return <></>;
  }

  return (
    <TabWrapper className="tab-wrapper">
      <Tab>
        {Object.values(FREELANCER_PROFILE_TABS).map((tab) => (
          <TabTitle
            onClick={() => {
              navigate(`/freelancer/account/${tab}`, { replace: true });
            }}
            active={tabkey === tab}
            key={tab}
          >
            {tab}
          </TabTitle>
        ))}
      </Tab>
    </TabWrapper>
  );
};
