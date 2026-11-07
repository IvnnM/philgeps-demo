import React from 'react';
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="print-container">{children}</div>;
}
