
import React from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-x-scroll">
 

      <div className="flex flex-col flex-1 items-center justify-center">
        {children}
        
      </div>
    </div>
  );
}