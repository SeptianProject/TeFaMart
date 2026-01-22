"use client";

import { ReactNode } from "react";

interface StoreLayoutWrapperProps {
  children: ReactNode;
}

export default function StoreLayoutWrapper({
  children,
}: StoreLayoutWrapperProps) {
  return <>{children}</>;
}
