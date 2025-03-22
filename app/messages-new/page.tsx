// "use client";

// import NewMessagingPage from "@/pages/newmessaging-page";
// import { Suspense } from "react";

// export default function MessagesNew() {
//   return (
//     <Suspense fallback={<div>Loading new messaging interface...</div>}>
//       <NewMessagingPage />
//     </Suspense>
//   );
// }

import React from "react";
import TalkJS from "@/pages/talk-js";

const page = () => {
  return (
    <div className="pt-[90px] bg-secondary flex flex-col items-center justify-center">
      <TalkJS />
    </div>
  );
};

export default page;
