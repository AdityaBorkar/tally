// Types:

// Libraries:
import Head from "next/head";
import StatementProfiler from "logic/analyzer";
import { useState } from "react";
import { Cell, Column, ReactTable } from "@/app/components/ReactTable";
import { Highlight, Tooltip } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { LedgerNames } from "@/app/(pages)/tool/test/atoms";

// Main:
export default function Home() {
  // TODO: Categorize Expenses and claim INPUT TAX CREDIT:
  // TODO: Almost realtime fetching of transactions

  // Data:
  const [STATEMENT, SET_STATEMENT] = useState<any[]>([]);
  const SelectedBank = { bank: "Abhyudaya Co-Op. Bank Ltd. (India)" };

  // Utilities - [COPY AS IT IS]
  const UploadFile = () =>
    new Promise<void>((resolve, reject) => {
      const input = document.createElement("input");
      input.style.display = "none";
      input.type = "file";
      input.accept = ".csv";
      input.onchange = (e: any) => {
        // Take the first file:
        const FILE = e.target.files[0];

        // Validate File Name
        if (!FILE.name.endsWith(".csv")) {
          console.log("Upload a CSV File");
          return reject();
        }

        // Read File:
        const reader = new FileReader();
        reader.readAsText(FILE);
        reader.onload = async () => {
          console.time("MODEL Profile");
          const DATA_STRING = reader.result?.toString() || "";
          const SELECTED_BANK = SelectedBank.bank;
          // TODO: Send above thing & Do the below thing on the server:
          try {
            const analyzer = new StatementProfiler(SELECTED_BANK);
            const SanitizedData = await analyzer.sanitize(DATA_STRING);
            const ProcessedData = analyzer.process(SanitizedData);
            console.log("FINAL = ", ProcessedData);
            SET_STATEMENT(ProcessedData);
            resolve();
          } catch (error) {
            console.log("FILE ERROR onload = ", error);
            reject();
          }
          console.timeEnd("MODEL Profile");
        };
        reader.onerror = () => {
          console.log("FILE ERROR onerror = ", reader.error);
          reject();
        };
      };
      document.body.appendChild(input);
      input.click();
    });
  const CurrencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    currencySign: "accounting",
    signDisplay: "never",
    style: "decimal",
  });

  // Changed:
  function LedgerCell(props: any) {
    return <div className="flex flex-row gap-2">LEDGER NAME</div>;
  }

  // Render:
  return (
    <div>
      <Head>
        <title>Manual Model Maker</title>
        <meta name="description" content="Manual Classifier" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="fixed top-16 -right-12">
          <button
            className="bg-fuchsia-200 font-medium px-6 py-2 rounded-lg rotate-90"
            onClick={UploadFile}
          >
            UPLOAD FILE
          </button>
        </div>

        <div className="mx-auto px-2 py-1">
          <div className="flex flex-row gap-5">
            {/* {Object.keys(ANALYTICS.MODES).map((mode) => {
              const MODE_COUNT = ANALYTICS.MODES[mode];
              return (
                <div
                  className="px-10 py-2 text-center border bg-green-200 rounded-lg"
                  key={mode}
                >
                  {mode}
                  <span className="block font-medium text-green-900">
                    {MODE_COUNT}
                  </span>
                </div>
              );
            })} */}
          </div>
        </div>

        <div className="mx-auto px-2 py-1 text-sm">
          <table>
            <thead className="text-center text-white font-medium bg-gray-900">
              <tr>
                {/* <td className="w-24">Date</td> */}
                <td className="w-[600px]">Text</td>
                <td className="w-80">Narration</td>
                <td className="w-16">Mode</td>
                <td className="w-24">Amount</td>
                {/* <td className="w-32">Ledger</td> */}
              </tr>
            </thead>
            <tbody>
              {STATEMENT.map((d, index) => {
                console.log(d.desc.query);
                return (
                  <tr
                    key={index}
                    className={`border border-gray-500 child:border child:border-gray-500`}
                    style={{
                      display: d.mode === "UPI" ? "" : "none",
                    }}
                  >
                    {/* <td>{d.txnDate}</td> */}
                    <td>
                      {/* <Tooltip label={d.desc.narration}> */}
                      <Highlight
                        query={d.desc.query}
                        styles={{ px: "1", bg: "orange.100" }}
                      >
                        {d.desc.text}
                      </Highlight>
                      {/* </Tooltip> */}
                    </td>
                    <td>{d.desc.narration}</td>
                    <td>{d.mode}</td>
                    <td
                      className={
                        d.txnAmt > 0 ? "text-green-600" : "text-red-800"
                      }
                      style={{ textAlign: "right" }}
                    >
                      {d.txnAmt}
                    </td>
                    {/* <td>{d.ledger}</td> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* <div className="">
          <VirtualTable STATEMENT={STATEMENT} />
        </div> */}
      </main>
    </div>
  );
}

function VirtualTable(props: { STATEMENT: any[] }) {
  const STATEMENT = props.STATEMENT;
  const CurrencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    currencySign: "accounting",
    signDisplay: "never",
    style: "decimal",
  });

  // Changed:
  function LedgerCell(props: any) {
    return <div className="flex flex-row gap-2">LEDGER NAME</div>;
  }
  return (
    <ReactTable
      data={STATEMENT}
      className="mx-auto mt-[4vh] h-[95vh] overflow-auto border-collapse"
    >
      <Column Key="txnDate" size={120}>
        <Head>Date</Head>
        <Cell>
          {(props: any) => (
            <div className="text-sm text-center">{props.getValue()}</div>
          )}
        </Cell>
      </Column>
      <Column Key="desc" size={550}>
        <Head>Particulars</Head>
        <Cell>
          {(props: any) => (
            <div className="px-2 text-sm">
              {/* <Tooltip label={props.getValue().fullText || "-"}> */}
              <Highlight
                query={props.getValue().query}
                styles={{ px: "1", bg: "yellow.100" }}
              >
                {props.getValue().text}
              </Highlight>
              {/* </Tooltip> */}
            </div>
          )}
        </Cell>
      </Column>
      <Column Key="mode" size={100}>
        <Head>Mode</Head>
        <Cell>
          {(props: any) => (
            <div className="text-center text-sm">{props.getValue()}</div>
          )}
        </Cell>
      </Column>
      <Column Key="txnAmt" size={120}>
        <Head>Amount</Head>
        <Cell>
          {(props: any) => (
            <div
              className={`px-2 text-right ${
                props.getValue() > 0 ? "text-green-800" : "text-red-800"
              }`}
            >
              {CurrencyFormatter.format(props.getValue())}
            </div>
          )}
        </Cell>
      </Column>
      <Column Key="ledger" size={300}>
        <Head>Ledger</Head>
        <Cell component={LedgerCell} />
      </Column>
    </ReactTable>
  );
}
