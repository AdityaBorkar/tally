// Libraries:
import Head from "next/head";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Highlight,
  Input,
  Progress,
  useToast,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

// Components:
import StatementProfiler from "logic/parser";

// Main Component:
export default function ModelMaker() {
  // Render:
  return (
    <>
      <Head>
        <title>Automater Model Classifier</title>
        <meta name="description" content="Model Maker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-[100vh] grid grid-cols-[350px_auto]">
        <div className="border-r-2">
          <Tabs>
            <TabList>
              <Tab>Manager</Tab>
              <Tab>Model</Tab>
              <Tab>New Rule</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Manager />
              </TabPanel>
              <TabPanel>
                <Rules />
              </TabPanel>
              <TabPanel>
                <NewRule />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>

        <div className="w-full overflow-auto">
          <WorkingStatement />
        </div>
      </main>
    </>
  );
}

function Manager() {
  // Data:
  const SetBankStatement = (OldData: any) => [];
  // TODO -CHANGE IN ARCHITECTURE, UPDATE CODE
  // const SetBankStatement = useSetRecoilState(STATEMENT);
  // const [BankModel, SetBankModel] = useRecoilState(MODEL);

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
          const analyzer = new StatementProfiler("");
          const SanitizedData = await analyzer.sanitize(DATA_STRING);
          SetBankStatement(SanitizedData);
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

  // Import:
  const importModel = () => {};

  // Export:
  const exportModel = () => {};

  // Modal Manager:
  const toast = useToast();

  // Render:
  return (
    <div>
      <div className="mt-10 mx-16 flex flex-col gap-5">
        <Button colorScheme="blue" onClick={uploadStatement}>
          Upload Statement
        </Button>
        <Button colorScheme="green" onClick={importModel}>
          Import Model
        </Button>
        <Button colorScheme="red" onClick={exportModel}>
          Export Model
        </Button>
      </div>
    </div>
  );
}

function Rules() {
  // Model Manager
  const CustomModel: any[] = [];
  const COVERAGE = 45;

  // Render
  return (
    <div>
      <div>
        <h2 className="text-pink-800 font-medium">Coverage: {COVERAGE}%</h2>
        <Progress hasStripe value={COVERAGE} rounded="md" colorScheme="pink" />
      </div>

      <div className="flex flex-col">
        {CustomModel.map((rule) => {
          return <div></div>;
        })}
      </div>
    </div>
  );
}

function NewRule() {
  // Model Manager
  // const [CustomModel, SetCustomModel] = useRecoilState(MODEL);
  const AlterCustomModel = () => {};

  // Form Manager:
  // 1. Collect Values
  // 2. Execute Custom Code

  // Render:
  return (
    <div>
      <div className="p-3 text-sm rounded-md">
        <h3 className="mt-2 font-medium my-2 uppercase underline">
          Identification
        </h3>
        <div className="grid grid-cols-[80px_auto] gap-y-2 gap-x-2">
          <label className="mt-1 text-gray-700 text-right">Starts With</label>
          <Input placeholder="Text" size="sm" />
          <label className="mt-1 text-gray-700 text-right">Includes</label>
          <Input placeholder="Text" size="sm" />
          <label className="mt-1 text-gray-700 text-right">Equals</label>
          <Input placeholder="Text" size="sm" />
        </div>
        <h3 className="mt-5 font-medium my-2 uppercase underline">
          Categorization
        </h3>
        <div className="grid grid-cols-[80px_auto] gap-y-2 gap-x-2">
          <label className="mt-1 text-gray-700 text-right">Mode</label>
          <Input placeholder="Mode" size="sm" />
          <label className="mt-1 text-gray-700 text-right">Label</label>
          <Input placeholder="Label" size="sm" />
        </div>
        <h3 className="mt-5 font-medium my-2 uppercase underline">Narration</h3>
        1. OG TEXT 1. REPLACE & SPLIT Join Pop
      </div>

      <div className="mt-5 pt-3 flex flex-row justify-evenly border-t-2">
        <Button colorScheme="green">Save Rule</Button>
        <Button colorScheme="blue">Execute</Button>
      </div>
    </div>
  );
}

function WorkingStatement() {
  // Data:
  const BankStatement = useRecoilValue(STATEMENT);

  // Rule Processing:
  const CustomModel = useRecoilValue(MODEL);
  const analyzer = StatementProfiler("Testing", CustomModel);
  const ProcessedStatement = analyzer.process(BankStatement);
  const CurrencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    currencySign: "accounting",
    signDisplay: "never",
    style: "decimal",
  });

  // Render:
  return (
    <table className="mx-auto text-sm">
      <thead className="sticky top-0 text-center text-white font-medium bg-gray-800">
        <tr>
          <td className="w-24">Date</td>
          <td className="py-1 w-[620px]">Text</td>
          <td className="w-[500px]">Narration</td>
          <td className="w-28">Mode</td>
          <td className="w-24">Amount</td>
          {/* <td className="w-32">Ledger</td> */}
        </tr>
      </thead>
      <tbody>
        {ProcessedStatement.map((d, index) => {
          console.log(d.desc.query);
          return (
            <tr
              key={index}
              className={`text-gray-800 border border-gray-300 child:border child:border-gray-300`}
            >
              <td className="text-center">{d.txnDate}</td>
              <td>
                <Highlight
                  query={d.desc.query}
                  styles={{ px: "1", bg: "orange.100" }}
                >
                  {d.desc.text}
                </Highlight>
              </td>
              <td>{d.desc.narration}</td>
              <td className="text-center">{d.mode}</td>
              <td
                className={d.txnAmt > 0 ? "text-green-800" : "text-red-800"}
                style={{ textAlign: "right" }}
              >
                {CurrencyFormatter.format(d.txnAmt)}
              </td>
              {/* <td>{d.ledger}</td> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
