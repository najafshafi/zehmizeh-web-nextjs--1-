"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamically import TalkJS with SSR disabled
const TalkJS = dynamic(() => import("@/pages/talk-js"), {
  ssr: false,
});

export default function MessagesWithConversationPage() {
  const params = useParams();
  const conversationId = (params?.conversationId as string) || "";

  return (
    <div className="pt-[90px] bg-secondary flex flex-col items-center">
      <TalkJS singleConversation={conversationId} />
    </div>
  );
}
