"use client";

import { ReactNode } from "react";
import { IntercomProvider as IntercomProviderOriginal } from "react-use-intercom";
import { isStagingEnv } from "@/helpers/utils/helper";

interface IntercomProviderProps {
  children: ReactNode;
}

export default function IntercomProvider({ children }: IntercomProviderProps) {
  // Get the Intercom App ID from environment variable
  const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "";

  return (
    <IntercomProviderOriginal
      appId={INTERCOM_APP_ID}
      autoBoot={!isStagingEnv()}
    >
      {children}
    </IntercomProviderOriginal>
  );
}
