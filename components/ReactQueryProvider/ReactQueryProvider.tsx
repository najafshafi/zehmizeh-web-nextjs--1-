"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 30 * 1000, // Consider data fresh for 5 seconds
            refetchOnMount: true, // Ensure fetch on mount if no data
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// "use client";

// import { QueryClient, QueryClientProvider } from "react-query";
// import { useState } from "react";

// export default function ReactQueryProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [queryClient] = useState(() => new QueryClient());

//   return (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
// }
