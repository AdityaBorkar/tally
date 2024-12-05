"use client";

// Libraries:
import { useMemo } from "react";
import { Highlight, Tooltip } from "@chakra-ui/react";

// Components:
import PushModal from "./push-modal";
import StatementConfig from "./config-modal";
import ComboboxInput from "components/ComboInput";
import VirtualTable from "components/VirtualTable";
import { useTallyContext } from "../TallyManager";

// Main Page:
export default function StatementPage() {
  // Data:
  const { tally, statement } = useTallyContext();
  const LEDGERS = tally.ledgers;
  const STATEMENT = statement.raw;
  const LedgerNameIds = useMemo(
    () =>
      LEDGERS.map((ledger) => ({
        name: ledger.name,
        id: ledger.guid,
      })),
    [LEDGERS]
  );

  // Utils:
  const CurrencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    currencySign: "accounting",
    signDisplay: "never",
    style: "decimal",
  });
  const TableConfig = {
    columns: [
      { name: "Txn. Date", width: "100px" },
      { name: "Txn. Mode", width: "120px" },
      { name: "Narration", width: "400px" },
      { name: "Amount (Rs.)", width: "100px" },
      { name: "Tally Ledger", width: "300px" },
    ],
    style: {
      header:
        "bg-gray-800 text-sm text-center text-white child:py-1 child:border child:border-gray-500",
      body: "child:py-1 text-sm text-center child:border child:border-gray-300",
    },
  };

  // Components:
  function RowComponent(props: { item: StatementDataType; index: number }) {
    // Data:
    const item = props.item;
    // Render:
    return (
      <>
        <div>{item.date.string}</div>
        <div>{item.txn.mode}</div>
        <Tooltip
          label={item.details.rawText}
          placement="bottom-start"
          width={"full"}
        >
          <div className="px-2 text-left hover:bg-gray-200/80">
            {item.details.narration}
          </div>
        </Tooltip>
        <div>
          <div
            className={`px-2 text-right font-medium text-sm ${
              item.txn.transfer === "CR" ? "text-green-700" : "text-red-700"
            }`}
          >
            {CurrencyFormatter.format(item.txn.amount)}
          </div>
        </div>
        <div className="!py-0">
          <ComboboxInput
            list={LedgerNameIds}
            value={item.ledger}
            updateValue={(ledger) => {
              if (ledger.name && ledger.name !== "")
                statement.save(props.index, ledger);
            }}
          />
        </div>
      </>
    );
  }

  // Render:
  return (
    <>
      <main className={STATEMENT.length === 0 ? "block" : "hidden"}>
        <div className="pt-10 text-gray-800 text-center">
          <img src="/res/no-data.svg" className="mt-[10%] mx-auto w-[30%]" />
          <StatementConfig className="mx-auto w-fit" />
        </div>
      </main>

      <main className={STATEMENT.length === 0 ? "hidden" : "block"}>
        <div className="mx-auto mt-[2vh] w-fit">
          <VirtualTable
            config={TableConfig}
            items={STATEMENT}
            row={RowComponent}
          />
        </div>

        <div className="absolute z-50 bottom-10 right-10">
          <StatementConfig className="mx-auto w-fit mb-4" />

          <PushModal />
        </div>
      </main>
    </>
  );
}
