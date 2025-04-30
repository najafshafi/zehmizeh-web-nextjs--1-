// "use client";

// import { QueryClient, QueryClientProvider } from "react-query";
// import { useState } from "react";

// export default function ReactQueryProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             refetchOnWindowFocus: false, // Disable refetching on tab focus
//             staleTime: 2 * 60 * 1000, // Consider data fresh for 2 minutes
//           },
//         },
//       })
//   );

//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }

"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
