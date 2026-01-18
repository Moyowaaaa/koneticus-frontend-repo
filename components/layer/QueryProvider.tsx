"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure a new QueryClient is created only on the client side
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // How long the data in the cache will be considered fresh (in milliseconds)
            staleTime: 5 * 60 * 1000, // 5 minutes

            // How long unused/inactive data remains in cache before it's garbage collected
            gcTime: 10 * 60 * 1000, // 10 minutes (previously called cacheTime)

            // Additional global default options
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            retry: 1, // Number of retry attempts for failed queries
          },
          mutations: {
            // Default mutation options
            retry: 1, // Number of retry attempts for failed mutations
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
