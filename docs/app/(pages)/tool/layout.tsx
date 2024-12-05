"use client";

// Types:
import type { ReactNode } from "react";

// Libraries:
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  HiUsers,
  HiCog6Tooth,
  HiTableCells,
  HiPuzzlePiece,
  HiQuestionMarkCircle,
  HiChatBubbleBottomCenterText,
} from "react-icons/hi2";

// Components:
import { TallyContextProvider } from "./TallyManager";
import TallySyncComponent from "./TallyStatus";

// Layout:
export default function Layout(props: { children: ReactNode }) {
  // Navigation:
  const NavPages = [
    {
      title: "Smart Statement",
      url: "statement-smart",
      icon: HiChatBubbleBottomCenterText,
    },
    { title: "CSV Statement", url: "statement-csv", icon: HiTableCells },
    { title: "Suspense", url: "suspense", icon: HiPuzzlePiece },
    { title: "Ledgers", url: "ledgers", icon: HiUsers },
    { title: "Settings", url: "settings", icon: HiCog6Tooth },
    { title: "Help", url: "help", icon: HiQuestionMarkCircle },
  ];

  // Render:
  return (
    <TallyContextProvider>
      <div className="h-[100vh] grid grid-cols-[280px_auto]">
        <nav className="relative shadow-[0_-10px_20px_20px_#00000011] ">
          <h2 className="py-6 text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-600 to-purple-900">
            vasundhara
          </h2>

          <div className="py-6  grid grid-cols-1 gap-y-4">
            {NavPages.map((nav) => {
              const isActive = (useSelectedLayoutSegment() || "") === nav.url;
              return (
                <Link href={`/tool/${nav.url}`} key={nav.title}>
                  <div
                    className={`mx-auto w-full px-2 py-3 text-lg font-semibold cursor-pointer rounded-md transition-all ${
                      isActive
                        ? "text-purple-700"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <nav.icon className="ml-6 mr-4 w-6 h-6 inline align-[-5px]" />
                    {nav.title}
                  </div>
                </Link>
              );
            })}
          </div>

          <TallySyncComponent />
        </nav>

        <div>{props.children}</div>
      </div>
    </TallyContextProvider>
  );
}
