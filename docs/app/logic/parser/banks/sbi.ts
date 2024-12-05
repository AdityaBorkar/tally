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

//* Bank Charges:

MODEL.train("INTEREST", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "credit interest" },
  props: (text: string) => ({ bankInterest: true }),
});

// ------------------------------------------------------------

//* UPI:

MODEL.train("UPI", {
  meta: { mode: "UPI", group: "UPI" },
  match: { startsWith: "by transfer upi" },
  props: (text: string) => {
    const arr = CleanSplit(text, "/");
    if (arr[0] === "cr")
      return { name: arr[2], ifsc: arr[3], upiId: arr[4], remarks: arr[5] };
    if (arr[0] === "rev")
      return { txnId: CleanSplit(text, "/").pop(), reversal: true };
    return { upiId: CleanSplit(text, "/").pop() };
  },
});

MODEL.train("UPI", {
  meta: { mode: "UPI", group: "UPI" },
  match: { startsWith: "to transfer upi" },
  props: (text: string) => {
    const arr = CleanSplit(text, "/");
    return { name: arr[2], ifsc: arr[3], upiId: arr[4], remarks: arr[5] };
  },
});

// ------------------------------------------------------------

//* Internet Banking (IMPS):

MODEL.train("INTERNET-BANKING", {
  meta: { mode: "IMPS", group: "INB" },
  match: { startsWith: "to transfer inb" },
  props: (text: string) => ({ name: text }),
});

MODEL.train("INTERNET-BANKING", {
  meta: { mode: "IMPS", group: "INB" },
  match: { startsWith: "by transfer inb imps" },
  props: (text: string) => {
    const arr = CleanSplit(text, "/");
    return { phoneNum: arr[1], remarks: arr[3] };
  },
});

MODEL.train("IMPS-REVERSAL", {
  meta: { mode: "IMPS", group: "INB" },
  match: { startsWith: "by transfer inb refund" },
  props: (text: string) => ({ txnId: text.split(" ").pop(), reversal: true }),
});

// ------------------------------------------------------------

//* NEFT:

MODEL.train("NEFT", {
  meta: { mode: "NEFT", group: "NEFT" },
  match: { startsWith: "by transfer neft" },
  props: (text: string) => ({ name: CleanSplit(text, "*").pop() }),
});

// ------------------------------------------------------------

//* Debit Card:

MODEL.train("DEBIT-CARD-POS", {
  meta: { mode: "Debit Card", group: "Card" },
  match: { startsWith: "by debit card othpos" },
  props: (text: string) => ({ name: CleanSplit(text, " ").slice(1).join(" ") }),
});

MODEL.train("DEBIT-CARD-OTHERS", {
  meta: { mode: "Debit Card", group: "Card" },
  match: { equals: "by debit card" },
  props: (text: string) => ({ name: "-" }),
});

MODEL.train("DEBIT-CARD-PG", {
  meta: { mode: "Debit Card", group: "Card" },
  match: { startsWith: "by debit card oth pg" },
  props: (text: string) => ({ name: CleanSplit(text, " ").slice(1).join(" ") }),
});

MODEL.train("DEBIT-CARD-PG", {
  meta: { mode: "Debit Card", group: "Card" },
  match: { startsWith: "by debit card othpg" },
  props: (text: string) => ({ name: CleanSplit(text, " ").slice(1).join(" ") }),
});

MODEL.train("DEBIT-CARD-PG", {
  meta: { mode: "Debit Card", group: "Card" },
  match: { startsWith: "by debit card sbipg" },
  props: (text: string) => ({ name: CleanSplit(text, "*").slice(1).join(" ") }),
});

MODEL.train("DEBIT-CARD-ATM", {
  meta: { mode: "Debit Card", group: "ATM" },
  match: { startsWith: "atm wdl atm cash" },
  props: (text: string) => ({
    name: CleanSplit(text, " ").slice(1).join(" ").replaceAll("+", ""),
  }),
});

MODEL.train("DEBIT-CARD-REVERSAL", {
  meta: { mode: "Debit Card", group: "Card" },
  match: { startsWith: "reverse pos pur" },
  props: (text: string) => ({ reversal: true }),
});

MODEL.train("CARD-DECLINE-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "to transfer insufficient bal pos decline charge" },
  props: (text: string) => ({ bankCharge: "INSUFFICIENT-BALANCE" }),
});

MODEL.train("CARD-AMC-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "debit atmcard amc" },
  props: (text: string) => ({ bankCharge: "DEBIT-CARD-AMC" }),
});

MODEL.train("FUEL-CARD-CHARGES", {
  meta: { mode: "Bank", group: "Fuel Surcharge" },
  match: { includes: "dom surcharge" },
  props: (text: string) => ({ bankCharge: "FUEL" }),
});

MODEL.train("DEBIT-CARD-FUEL-REVERSAL", {
  meta: { mode: "Debit Card", group: "Card" },
  match: { startsWith: "bulk posting" },
  props: (text: string) => ({
    name: CleanSplit(text, " ").slice(2).join(" "),
    reversal: true,
  }),
});

// ------------------------------------------------------------

export default MODEL.generate();
