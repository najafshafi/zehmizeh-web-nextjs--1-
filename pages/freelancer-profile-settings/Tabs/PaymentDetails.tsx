import { useState } from 'react';
import ProfileDetailSection from '../partials/ProfileDetailSection';
import StripeDetails from '@/components/stripe/stripeDetails';
import { useQueryData, useRefetch } from '@/helpers/hooks/useQueryData';
import { showAddBankButton } from '@/helpers/utils/helper';
import { Col, Row, Tooltip } from 'react-bootstrap';
import BankAccount from '../partials/BankAccount';
import AddBankAccount from '@/pages/freelancer-profile-settings/edit-modals/AddBankAccount';
import { queryKeys } from '@/helpers/const/queryKeys';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';

export const PaymentDetails = () => {
  const { data } = useQueryData<IFreelancerDetails>(
    queryKeys.getFreelancerProfile
  );
  const { refetch } = useRefetch(queryKeys.getFreelancerProfile);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const stpStatus = !data?.stp_account_id
    ? 'pending'
    : data?.stp_account_status !== 'verified'
    ? 'inprogress'
    : 'verified';

  return (
    <Row className="mt-4">
      <Col md="12" lg="6">
        {data?.stp_account_status && (
          <StripeDetails
            stripeStatus={data?.stp_account_status}
            stripe={data?.stripe}
            totalEarnings={data?.totalearning}
            refetch={refetch}
          />
        )}
      </Col>
      <Col md={12} lg={6} style={{ padding: '0 0 32px 0' }}>
        <ProfileDetailSection
          onEdit={() => setIsModalOpen(true)}
          fullWidth={true}
          add={showAddBankButton(data)}
          stripeStatus={stpStatus}
          edit={false}
          title={
            <div className="d-flex align-items-center gap-2">
              Payment Details
              <Tooltip>
                After registering for Stripe, this is where freelancers can add
                the details of the bank account(s) that their fees will be sent
                to. These are not visible to any other user.
              </Tooltip>
            </div>
          }
          details={
            showAddBankButton(data) ? (
              data?.account?.length > 0 ? (
                data?.account?.map((item:any) => (
                  <div key={item?.user_bank_id}>
                    <BankAccount
                      item={item}
                      country={data?.location?.country_short_name}
                      refetch={refetch}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center fs-18 my-3">Add bank details here.</p>
              )
            ) : (
              <p className="text-center fs-18 my-3">
                When Stripe registration is complete, add bank details here.
              </p>
            )
          }
        />
      </Col>
      <AddBankAccount
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={() => {
          setIsModalOpen(false);
          refetch();
        }}
        userCountry={data?.location?.country_short_name}
      />
    </Row>
  );
};
