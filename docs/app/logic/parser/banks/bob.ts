// Libraries:
import BankParserMaker from "../BankParser";
import isIFSC from "utils/ValidateIFSC";
import { CleanSplit, CleanDashes, CleanBrackets } from "utils/StringFuncs";

// Create Model:
const MODEL = new BankParserMaker({
  CleanTxnText: (txt) =>
    txt.toLowerCase().replaceAll("-", " ").replaceAll(/  +/g, " ").trim(),
  GstConfig: {
    type: "INTRA-STATE",
    combineCharges: true,
    prefix: {
      cgst: { startsWith: "" },
      sgst: { startsWith: "" },
    },
  },
});

// ------------------------------------------------------------

// const BANK_OF_BARODA_MODEL: ModelType = [
//   // Bank Charges:
//   {
//     meta: { group: "Bank Charges" },
//     condition: [
//       "equals",
//       [
//         "charges for imps transaction",
//         "cgst on imps charges",
//         "sgst on imps charges",
//         "neft-charges",
//         "neft-cgst",
//         "neft-sgst",
//         "atm id-",
//         "cgst atm id-",
//         "sgst atm id-",
//         "sms charges",
//         "cgst sms charges",
//         "sgst sms charges",
//         "min bal chg",
//         "cgst min bal chg",
//         "sgst min bal chg",
//         "reversal-charges for imps transaction",
//         "reversal-cgst on imps charges",
//         "reversal-sgst on imps charges",
//         "to transfer-insufficient bal pos decline charge--",
//         "credit interest---",
//         "sign verification chg",
//         "cgst sign verification chg",
//         "sgst sign verification chg",
//       ],
//     ],
//     narration: (text: string) => text,
//     mode: "Bank Charges",
//   },
//   {
//     meta: { group: "Bank Charges" },
//     condition: ["startsWith", ["origbrcd =", "cgst", "sgst"]],
//     narration: (text: string) => text,
//     mode: "Bank Charges",
//   },
//   // IMPS:
//   {
//     meta: { group: "IMPS", label: "IMPS P2A" },
//     condition: ["startsWith", "impsmob:p2a"],
//     narration: (text: string) => {
//       const STRING = text.split("[");
//       const BENEFICIARY_NAME = STRING[1].slice(0, -1);
//       const ACCOUNT_NUMBER = STRING[3].slice(0, -1);
//       const IFSC = STRING[2].slice(0, -1);
//       // Validate IFSC
//       // Validate Ac. Number
//       return `${BENEFICIARY_NAME} - ${ACCOUNT_NUMBER} / ${IFSC}`;
//     },
//     mode: "IMPS",
//   },
//   {
//     meta: { group: "IMPS", label: "IMPS P2A Reversal" },
//     condition: ["startsWith", "rev impsmob:p2a"],
//     narration: (text: string) => "IMPS Reversal",
//     mode: "IMPS",
//   },
//   {
//     meta: { group: "IMPS", label: "IMPS INB" },
//     condition: ["startsWith", "by transfer-inb imps"],
//     narration: (text: string) => {
//       return text;
//     },
//     mode: "IMPS*",
//   },
//   //
// ];

export default MODEL.generate();
