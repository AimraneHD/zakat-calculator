"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface SidebarProps {
  sidebarOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({sidebarOpen, onClose} : SidebarProps) {
  
  // this returns the current URL that the user is in inside a string
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <>

      <aside 
        className={`fixed pt-30 top-0 left-0 h-screen w-64 bg-[#1a1a1a] border-r border-neutral-800 p-5 z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <h2>
          Menu
        </h2>
        <ul className="text-left">
          <li>
            <Link
              href={"/"}
              className={`${ pathname === "/" ? "text-emerald-500" : "text-white"} active:bg-emerald-500 no-underline hover:text-[#1a1a1a] hover:bg-white cursor-pointer transition-colors`}
              onClick={onClose}
            >
              Home...
            </Link>
          </li>
          <li>
            About...
            <ul>
              <li>
                <Link
                  href={"/about"}
                  className={`${ pathname === "/about" ? "text-emerald-500" : "text-white"} active:bg-emerald-500 no-underline hover:text-[#1a1a1a] hover:bg-white cursor-pointer transition-colors`}
                  onClick={onClose}
                >
                  Zakat Calculation
                </Link>
              </li>
              <li>
                <Link
                  // its 404 at the moment, and i dont know what to use as placeholder
                  // for now, but i wanna make a whole different website about me, but not now
                  href={"/about/developer"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${ pathname === "/about/developer" ? "text-emerald-500" : "text-white"} active:bg-emerald-500 no-underline hover:text-[#1a1a1a] hover:bg-white cursor-pointer transition-colors`}
                  onClick={onClose}
                >
                  Developper (me :D)
                </Link>
              </li>
            </ul>
          </li>
          <li>
            Socials
            <ul>
              <li>
                <Link
                  href="https://www.linkedin.com/in/aimrane-haddou/"
                  target='_blank'
                  rel="noopener noreferrer"
                  className={`block w-full text-white active:bg-emerald-500 no-underline hover:text-[#1a1a1a] hover:bg-white cursor-pointer transition-colors`}
                >
                  LinkedIn
                </Link>
              </li>
              <li className="hover:text-[#1a1a1a] hover:bg-white cursor-not-allowed transition-colors">
                ... i dont have anything else other than private socials...
              </li>
            </ul>
          </li>
        </ul>

        <br/><br/>
        <label className="text-white/60">
          the sidebar's still a work in progress so nothing here works in terms of logic yet<br/>
          ...except for the linkedin button, that does take you to my linkedin profile :D
        </label>
      </aside>
      
      { sidebarOpen && (
        <div
          className={`fixed inset-0 bg-black/60 z-30 transition-all`}
          onClick={onClose}
        />
      ) }

    </>
  );
}