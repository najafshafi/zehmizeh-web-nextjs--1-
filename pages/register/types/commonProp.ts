import { Dispatch, SetStateAction } from 'react';

export type TRegisterProps = {
  setStep: Dispatch<SetStateAction<number>>;
  shouldShow: boolean;
};
