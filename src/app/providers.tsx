"use client";

import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InitialPageLoader from "@/components/ui/InitialPageLoader";
import RouteChangeLoader from "@/components/ui/RouteChangeLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <InitialPageLoader />
        <RouteChangeLoader />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  );
}
