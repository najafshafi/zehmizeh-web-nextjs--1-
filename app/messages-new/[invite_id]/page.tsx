"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

// Dynamically import TalkJS with SSR disabled
import TalkJS from "@/components/talkjs/talk-js";

export default function InviteChatPage() {
  const params = useParams();
  const inviteId = (params?.invite_id as string) || "";

  return (
    <div className="pt-[90px] bg-secondary flex flex-col items-center">
      <TalkJS conversationId={inviteId} />
    </div>
  );
}
