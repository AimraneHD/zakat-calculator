"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Nav from "./Nav";

export default function AppShell({children} : {children: React.ReactNode}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Nav
        sidebarOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <Sidebar
        sidebarOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {children}
    </>
  );
}