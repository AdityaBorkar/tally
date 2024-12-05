// // Libraries:
// import { parse } from "csv-parse/sync";

// // Utilities:
// import { AssignModel } from "./banks";
// import { TxnProcessor } from "./model";
// function toTitleCase(str: string) {
//   return str.replace(/\w\S*/g, function (txt) {
//     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//   });
// }

// // Backend Functionalities:
// export default class StatementProfiler {
//   // Config:
//   #MODEL: ModelType;

//   // Initialize:
//   constructor(BankName: string, Model?: ModelType) {
//     const MODEL = BankName === "TESTING" ? Model : AssignModel(BankName);
//     if (MODEL === undefined) {
//       this.#report(`Unknown Bank - "${BankName}"`);
//       throw "ERROR";
//     }
//     this.#MODEL = MODEL;
//   }

//   // Identify Transaction Entry:
//   identify(TxnAttr: TxnAttributes) {
//     const ledger = "";
//     // TODO - If not identifiable:
//     // #report
//     return ledger;
//   }

//   // Make a Narration:
//   narrate(attr: TxnAttributes) {
//     let NARRATION = "";
//     if (attr.name) NARRATION += ` ${toTitleCase(attr.name)}`;
//     if (attr.phoneNum) NARRATION += ` ${attr.phoneNum}`;
//     if (attr.remarks) NARRATION += ` (${toTitleCase(attr.remarks)})`;
//     if (attr.acNum) NARRATION += ` [${attr.acNum}]`;
//     if (attr.ifsc) NARRATION += ` [${attr.ifsc}]`;
//     if (attr.upiId) NARRATION += ` (UPI ID - ${attr.upiId})`;
//     if (attr.posId) NARRATION += ` (POS - ${attr.posId})`;
//     if (attr.bankInterest) NARRATION += `Bank Interest`;
//     if (attr.bankCharge) NARRATION += `Bank Charges for ${attr.bankCharge}`;
//     if (attr.gst) NARRATION += " + GST";
//     return { narration: NARRATION.trim(), highlight: [""] };
//   }

//   // Process Statement:
//   process(RawStatement: StatementType, TrainingMode?: boolean) {
//     // Store Data:
//     let TXNS = { total: 0, unidentified: 0, identified: 0 };
//     let ANALYTICS: {
//       [key: string]: {
//         cr: { amt: number; count: number };
//         db: { amt: number; count: number };
//       };
//     } = {};
//     const RegisterAnalytics = (mode: string, amount: number) => {
//       // If Mode is not defined:
//       if (!ANALYTICS[mode])
//         ANALYTICS[mode] = {
//           cr: { amt: 0, count: 0 },
//           db: { amt: 0, count: 0 },
//         };
//       // Increment:
//       ANALYTICS[mode] = {
//         cr: {
//           amt: ANALYTICS[mode].cr.amt + (amount >= 0 ? amount : 0),
//           count: ANALYTICS[mode].cr.amt + (amount >= 0 ? amount : 0),
//         },
//         db: {
//           amt: ANALYTICS[mode].db.amt + (amount < 0 ? amount : 0),
//           count: ANALYTICS[mode].db.amt + (amount < 0 ? amount : 0),
//         },
//       };
//     };

//     // Process Data:
//     let STATEMENT = [];
//     for (let TxnIndex = 0; TxnIndex < RawStatement.length; TxnIndex++) {
//       // Transaction Profile:
//       const TxnEntry = RawStatement[TxnIndex];
//       const GetTxn = (num: number) => RawStatement[TxnIndex + num];
//       const ChangeTxnIndex = (num: number) => {
//         TxnIndex += num;
//         TXNS.total += 2;
//       };
//       // Process Txn:
//       let ProcessorOutput = TxnProcessor({
//         MODEL: this.#MODEL,
//         ChangeTxnIndex,
//         GetTxn,
//       });
//       const { uid, mode, gst, attr } = ProcessorOutput.data;
//       const { narration, highlight } = this.narrate(attr);
//       const ledger = this.identify(attr);

//       // Analytics:
//       TXNS.total += 1;
//       RegisterAnalytics(mode, TxnEntry.amt);
//       if (ProcessorOutput.error !== false) {
//         TXNS.unidentified += 1;
//         // this.#report("Transaction Entry couldn't be processed.", {txnText:TxnEntry.desc, output:ProcessorOutput});
//         // continue;
//       }

//       // If Training:
//       if (TrainingMode === false && uid !== "UNIDENTIFIED") continue;
//       if (TrainingMode && !uid?.startsWith("TRAINING-")) continue;

//       // Return:
//       STATEMENT.push({
//         ...TxnEntry,
//         amt: TxnEntry.amt + gst.cgst + gst.sgst + gst.igst,
//         gst,
//         mode,
//         ledger,
//         desc: { text: TxnEntry.desc, narration, highlight },
//         dateString: TxnEntry.date.toLocaleDateString("hi", {
//           year: "numeric",
//           month: "2-digit",
//           day: "2-digit",
//         }),
//       });
//     }

//     TXNS.identified = TXNS.total - TXNS.unidentified;
//     return {
//       STATEMENT,
//       ANALYTICS,
//       COVERAGE: {
//         percent: parseFloat(((TXNS.identified * 100) / TXNS.total).toFixed(2)),
//         unidentified: TXNS.unidentified,
//         identified: TXNS.identified,
//         total: TXNS.total,
//       },
//     };
//   }

//   // Convert to JSON:
//   sanitize(DATA_STRING: string) {
//     // Data Array:
//     const DATA_ARRAY = parse(DATA_STRING, {
//       columns: true,
//       skip_empty_lines: true,
//     });
//     console.log("1] CSV Data = ", DATA_ARRAY);

//     // Sanitized Array:
//     const DATA_PARSED: TxnEntryType[] = DATA_ARRAY.map((txn: any) => {
//       // Basics:
//       if (txn["Txn Date"] === "") return null;
//       const DATE = new Date(txn["Txn Date"]);
//       const DESC = txn["Description"].trim();
//       const REF_ID = txn["Reference"].trim();
//       const CREDIT = parseFloat(txn["Credit"]) || 0;
//       const DEBIT = parseFloat(txn["Debit"]) || 0;
//       if (CREDIT === 0 && DEBIT === 0) throw ["Error - Txn Amount is 0", txn];
//       if (CREDIT !== 0 && DEBIT !== 0) throw "Error - Credit & Debit Present";
//       const RUNNING_BALANCE = parseFloat(txn["Balance"].trim()) || 0;
//       // Return
//       return {
//         date: DATE,
//         balance: RUNNING_BALANCE,
//         amt: CREDIT - DEBIT,
//         txnRef: REF_ID,
//         desc: DESC,
//         cr: CREDIT,
//         db: DEBIT,
//       };
//     }).filter((data: any) => data !== null);
//     console.log("2] JSON Data = ", DATA_PARSED);

//     // Return:
//     return DATA_PARSED;
//   }

//   // Report to Server:
//   #report(description: string, jsonData?: Object) {
//     // TODO - Send Details to Sentry with [HIGH PRIORITY]
//     console.log(description);
//     console.log(JSON.stringify(jsonData));
//   }
// }
