"use client";

// Libraries:

// Components:
import { useTallyContext } from "../TallyManager";
import VirtualTable from "components/VirtualTable";

// Main Page:
export default function LedgersPage() {
  // Data:
  const { tally } = useTallyContext();
  const LEDGERS = tally.ledgers;

  // No Data:
  if (LEDGERS.length === 0) {
    return (
      <main className="pt-10 text-gray-800 text-center">
        <img src="/res/no-data.svg" className="mt-[10%] mx-auto w-[30%]" />
      </main>
    );
  }

  // Table Config:
  const TableConfig = {
    columns: [
      { name: "Ledger Name", width: "350px" },
      { name: "Group", width: "200px" },
    ],
    style: {
      header:
        "bg-gray-800 text-center text-sm text-white font-medium child:py-1 child:border child:border-gray-500",
      body: "child:py-1 child:px-2 text-sm child:border child:border-gray-300",
    },
  };

  // Components:
  function RowComponent(props: { item: LEDGER_TYPE; index: number }) {
    // Render:
    return (
      <>
        <div>{props.item.name}</div>
        <div>{props.item.parent}</div>
      </>
    );
  }

  // Render:
  return (
    <main>
      <div className="mx-auto mt-[2vh] w-fit h-[95vh] overflow-auto">
        <VirtualTable config={TableConfig} items={LEDGERS} row={RowComponent} />
      </div>
    </main>
  );
}
