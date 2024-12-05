"use client";

// Libraries:
import { useRecoilState } from "recoil";
import { Button, Highlight, Progress, useToast } from "@chakra-ui/react";

// Components:
import { STATEMENT as RAW_STATEMENT } from "@/model-atoms";
import StatementProfiler from "@/app/logic/parser";

// TODO - Variables to enter:
import CustomModel from "@/app/logic/parser/banks/sbi";
const profiler = new StatementProfiler("TESTING", CustomModel);

// ! REPORTED BUGS:
// Opening Balance has to be deleted.
// Transaction Design - Txn ID, Identify Reversals
// Narration Design - `ml-classify-text` + Process Unknown Transactions
// Voucher Design - Bank Charge + GST (GST included / separated)
// Banks - Saraswat Bank

// Main Component:
export default function ModelTester() {
  // Data:
  const [RawStatement, SetRawStatement] = useRecoilState(RAW_STATEMENT);
  const { STATEMENT, COVERAGE } = profiler.process(RawStatement);

  // Upload:
  const uploadStatement = () => {
    const input = document.createElement("input");
    input.style.display = "none";
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e: any) => {
      // Take the first file:
      const FILE = e.target.files[0];

      // Validate File Name
      if (!FILE.name.endsWith(".csv"))
        toast({
          title: "File Error",
          description: "Kindly upload a CSV File.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });

      // Read File:
      const reader = new FileReader();
      reader.readAsText(FILE);
      reader.onload = async () => {
        console.time("MODEL Profile");
        try {
          const DATA_STRING = reader.result?.toString() || "";
          const SanitizedData = await profiler.sanitize(DATA_STRING);
          SetRawStatement(SanitizedData);
          toast({
            title: "Statement Uploaded",
            description: "",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        } catch (error) {
          console.log("FILE ERROR onload = ", error);
          toast({
            title: "File Error",
            description: "Internal Processing Error. Check logs.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
        console.timeEnd("MODEL Profile");
      };
      reader.onerror = () => {
        console.log("FILE ERROR onerror = ", reader.error);
        toast({
          title: "File Error",
          description: "Internal Loading Error. Check logs.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      };
    };
    document.body.appendChild(input);
    input.click();
  };

  // Utils:
  const CurrencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    currencySign: "accounting",
    signDisplay: "never",
    style: "decimal",
  });
  const toast = useToast();

  // Render:
  return (
    <>
      <main className="min-h-screen">
        <table className="ml-5 text-sm">
          <thead className="sticky top-0 text-center text-white font-medium bg-gray-800">
            <tr>
              <td className="w-8">Sr</td>
              <td className="w-24">Date</td>
              <td className="py-1 w-[300px]">Transaction ID</td>
              <td className="py-1 w-[450px]">Original Text</td>
              <td className="w-[450px]">Narration</td>
              <td className="w-28">Mode</td>
              <td className="w-24">Amount</td>
              {/* <td className="w-32">Ledger</td> */}
            </tr>
          </thead>
          <tbody>
            {STATEMENT.map((d, index: number) => {
              return (
                <tr
                  key={index}
                  className={`text-gray-800 border border-gray-300 child:border child:border-gray-300`}
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{d.dateString}</td>
                  <td className="text-center">{d.txnRef}</td>
                  <td>
                    <Highlight
                      query={d.desc.highlight || "@"}
                      styles={{ px: "1", bg: "orange.100" }}
                    >
                      {d.desc.text}
                    </Highlight>
                  </td>
                  <td>{d.desc.narration}</td>
                  <td className="text-center">{d.mode}</td>
                  <td
                    className={d.amt > 0 ? "text-green-800" : "text-red-800"}
                    style={{ textAlign: "right" }}
                  >
                    {CurrencyFormatter.format(d.amt)}
                  </td>
                  {/* <td>{d.ledger}</td> */}
                </tr>
              );
            })}
          </tbody>
        </table>

        <footer className="fixed bottom-5 right-5 px-6 py-3 bg-gray-200 rounded-lg">
          <Button mt="3" colorScheme="blue" onClick={uploadStatement}>
            Upload Statement
          </Button>

          <div className="mx-auto mt-5 w-[95%]">
            <h2 className="mb-1 text-sm text-purple-800 font-medium">
              <div className="flex flex-row justify-between">
                <span>Coverage:</span>
                <span>{COVERAGE.percent}%</span>
              </div>
              <div className="text-center text-purple-600">
                {COVERAGE.total} - {COVERAGE.identified} ={" "}
                {COVERAGE.unidentified}
              </div>
            </h2>
            <Progress
              hasStripe
              value={COVERAGE.percent}
              rounded="md"
              colorScheme="purple"
            />
          </div>
        </footer>
      </main>
    </>
  );
}
