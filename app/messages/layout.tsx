"use client";

import { ReactNode } from "react";

export default function MessagesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="messages-layout pt-[90px] bg-secondary flex flex-col items-center ">
      {children}
    </div>
  );
}
