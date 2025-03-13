"use client";

import { useState } from 'react';
import { AccountType } from './partials/AccountType';
import { AccountDetails } from './partials/AccountDetails';
import AuthLayout from '@/components/layout/AuthLayout';
import { StatusBadge } from '@/components/styled/Badges';
import RegistrationCheckboxes from './partials/RegistrationCheckboxes';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { RegisterWrapper } from '@/components/styled/Auth.styled';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [payload, setPayload] = useState<Partial<IFreelancerDetails>>({});

  return (
    <AuthLayout onlyhomebtn>
      <RegisterWrapper>
        <StatusBadge color="yellow">Page: {step}/3</StatusBadge>
        <div>
          <AccountType shouldShow={step === 1} setStep={setStep} />
          <AccountDetails shouldShow={step === 2} setStep={setStep} setPayload={setPayload} />
          <RegistrationCheckboxes shouldShow={step === 3} setStep={setStep} payload={payload} />
        </div>
      </RegisterWrapper>
    </AuthLayout>
  );
};
