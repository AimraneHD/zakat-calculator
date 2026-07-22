"use client";

interface NavProps {
  sidebarOpen: boolean;
  onToggle: () => void;
}

export default function Nav({sidebarOpen, onToggle} : NavProps) {
  return (
    <nav
      className="fixed z-50 top-0 left-0 pl-10 bg-emerald-500 w-full text-left p-3 shadow-lg shadow-emerald-700"
    >
      <h3 className="text-2xl pr-4">
        <span 
          className="select-none mr-4 cursor-pointer bg-emerald-600 p-2 rounded-md hover:text-[#0033ff] transition-all active:text-[#ffffff] active:scale-95"
          onClick={onToggle}
        >
          ☰
        </span>
        Zakat Calculator
      </h3>
    </nav>
  );
}