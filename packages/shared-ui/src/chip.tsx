"use client";

import type { ReactNode } from "react";

/**
 * Minimal shared client component — enough to force Next's RSC boundary
 * traversal during SSG, which triggers the `useContext` null crash.
 */
export function Chip({ children }: { children: ReactNode }) {
  return <span style={{ padding: "2px 8px", border: "1px solid #ccc" }}>{children}</span>;
}
