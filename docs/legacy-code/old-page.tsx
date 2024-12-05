"use client";

// Libraries:
import {
  Button,
  Highlight,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useContext } from "react";

// Components:
import ComboboxInput from "components/Combobox";
import { ReactTable, Column, Head, Cell } from "components/ReactTable";
import { useTableEditableCell } from "components/ReactTable/useTableEditableCell";
import StatementConfig from "../app/(pages)/tool/test/statement-csv/config-modal";
import TallyContext from "../TallyContext";

// Transaction Details:
let TxnNumber = 0;

// Main Page:
export default function StatementPage() {
  // Tally:
  const tally = useContext(TallyContext);

  // Data:
  const STATEMENT = tally.statement.data;
  const STATEMENT_TEXT = STATEMENT.map((st) => st.desc.text);
  console.log(STATEMENT_TEXT);

  // Utils:
  const GroupingModal = useDisclosure();
  const CurrencyFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    currencySign: "accounting",
    signDisplay: "never",
    style: "decimal",
  });
  function LedgerCell(props: any) {
    const LEDGERS = tally.ledgers;
    const openTxnGroup = (e: any) => {
      TxnNumber = props.row.id;
      GroupingModal.onOpen();
    };
    return (
      <div className="flex flex-row gap-2">
        <ComboboxInput list={LEDGERS} {...useTableEditableCell(props)} />
        <Button my="1" py="4" px="1" h="15px" onClick={openTxnGroup}>
          <img src="/res/group.svg" className="block h-[15px]" />
        </Button>
      </div>
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

        <Modal
          size="6xl"
          isOpen={GroupingModal.isOpen}
          onClose={GroupingModal.onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Similar Transactions</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{/* <TxnGrouping /> */}</ModalBody>
          </ModalContent>
        </Modal>

        <StatementConfig className="absolute top-10 right-10 z-50" />
      </main>
    </>
  );
}

// Transaction Grouping:
// function TxnGrouping() {
//   // Data:
//   const LEDGERS = useRecoilValue(LedgerNames);
//   const STATEMENT = useRecoilValue(StatementState);
//   const [SIMILAR_TXNS, SET_SIMILAR_TXNS] = useState<any[] | null>(null);
//   console.log("SIMILAR_TXNS = ", SIMILAR_TXNS);

//   // Query Keys:
//   const CURRENT_TRANSACTION = STATEMENT[TxnNumber];
//   const TRANSACTION_TEXT = CURRENT_TRANSACTION.desc.text;
//   const initQueryKeys = () => {
//     TRANSACTION_TEXT;
//     return [];
//   };
//   const [QueryKeys, SetQueryKeys] = useState(initQueryKeys());

//   // Update data according to query keys:
//   useEffect(() => {
//     const SimilarStatements = STATEMENT.map((txn) => {
//       for (const QueryKey of QueryKeys) {
//         if (txn.desc.includes(QueryKey)) return txn;
//       }
//       return null;
//     }).filter((txn) => txn !== null);
//     SET_SIMILAR_TXNS([...SimilarStatements]);
//   }, []);

//   // Utils:
//   const CurrencyFormatter = new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     currencySign: "accounting",
//     signDisplay: "never",
//     style: "decimal",
//   });

//   // Render:
//   return (
//     <div>
//       {/* Search String [Search] */}

//       <div className="mx-auto my-5 w-[65%] flex flex-row justify-evenly">
//         <ComboboxInput
//           className="border-2 rounded-md w-96"
//           list={LEDGERS}
//           value=""
//           setValue={() => {}}
//         />
//         <Button colorScheme="blue">Apply</Button>
//         <Button colorScheme="green">Save Changes</Button>
//       </div>

//       {SIMILAR_TXNS === null ? (
//         <div className="my-14 text-center">
//           <Spinner mt="-0.5" verticalAlign="text-top" />
//           <span className="px-4 font-medium">Loading Transactions</span>
//         </div>
//       ) : (
//         <ReactTable
//           data={SIMILAR_TXNS}
//           className="mx-auto h-[75%] overflow-auto border-collapse bg-yellow-100"
//         >
//           <Column Key="txnDate" size={120}>
//             <Head>Date</Head>
//             <Cell>
//               {(props: any) => (
//                 <div className="text-sm text-center">{props.getValue()}</div>
//               )}
//             </Cell>
//           </Column>
//           <Column Key="desc" size={550}>
//             <Head>Particulars</Head>
//             <Cell>
//               {(props: any) => (
//                 <div className="px-2 text-sm">
//                   <Highlight
//                     query={props.getValue().query}
//                     styles={{ px: "1", bg: "yellow.100" }}
//                   >
//                     {props.getValue().text}
//                   </Highlight>
//                 </div>
//               )}
//             </Cell>
//           </Column>
//           <Column Key="mode" size={100}>
//             <Head>Mode</Head>
//             <Cell>
//               {(props: any) => (
//                 <div className="text-center text-sm">{props.getValue()}</div>
//               )}
//             </Cell>
//           </Column>
//           <Column Key="txnAmt" size={120}>
//             <Head>Amount</Head>
//             <Cell>
//               {(props: any) => (
//                 <div
//                   className={`px-2 text-right ${
//                     props.getValue() > 0 ? "text-green-800" : "text-red-800"
//                   }`}
//                 >
//                   {CurrencyFormatter.format(props.getValue())}
//                 </div>
//               )}
//             </Cell>
//           </Column>
//           {/* <Column Key="ledger" size={300}>
//             <Head>Ledger</Head>
//             <Cell component={LedgerCell} />
//           </Column> */}
//           {/* <Column Key="ledger" size={300}>
//             <Head>Action</Head>
//             <Cell component={RemoveButton} />
//           </Column> */}
//         </ReactTable>
//       )}
//     </div>
//   );
// }
