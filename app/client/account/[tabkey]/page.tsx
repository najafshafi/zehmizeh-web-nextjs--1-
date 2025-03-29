// "use client";

// import React from "react";
// // import Navbar from "@/components/navbar/Navbar";
// import ClientProfile from "@/pages/client-profile/ClientProfile";

// interface PageProps {
//   params: Promise<{
//     tabkey: string;
//   }>;
// }

// // This is a client component that handles the dynamic routing
// export default function Page({ params }: PageProps) {
//   const resolvedParams = React.use(params);

//   return (
//     <div>
//       <div className="flex flex-col pt-[110px] bg-[#fefbf4]">
//         {/* <Navbar /> */}
//         <div>
//           <ClientProfile currentTab={resolvedParams.tabkey} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import { useParams } from "next/navigation";
// import Navbar from "@/components/navbar/Navbar";
import ClientProfile from "@/pages/client-profile/ClientProfile"; // Ensure the correct import path

export default function Page() {
  const params = useParams(); // Next.js way to access dynamic params

  return (
    <div className="flex flex-col pt-[110px] bg-[#fefbf4]">
      {/* <Navbar /> */}
      <div>
        <ClientProfile currentTab={params?.tabkey as string} />
      </div>
    </div>
  );
}
