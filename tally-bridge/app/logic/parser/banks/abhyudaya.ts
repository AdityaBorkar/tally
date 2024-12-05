// Libraries:
import BankParserMaker from "../BankParser";
import isIFSC from "utils/ValidateIFSC";
import { CleanSplit, CleanDashes, CleanBrackets } from "utils/StringFuncs";

// Create Model:
const MODEL = new BankParserMaker({
  CleanTxnText: (txt) => txt.toLowerCase().replaceAll(/  +/g, " ").trim(),
  GstConfig: {
    type: "INTRA-STATE",
    combineCharges: true,
    prefix: {
      cgst: { startsWith: "cgst" },
      sgst: { startsWith: "sgst" },
    },
  },
});

// ------------------------------------------------------------

//* Bank Charges:

MODEL.train("SMS-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "sms charges" },
  gst: true,
  props: (text: string) => ({ bankCharge: "SMS" }),
});

MODEL.train("MIN-BALANCE-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "min bal chg" },
  gst: true,
  props: (text: string) => ({ bankCharge: "MIN-BAL" }),
});

MODEL.train("SIGN-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "sign verification chg" },
  gst: true,
  props: (text: string) => ({ bankCharge: "OTHERS" }),
});

MODEL.train("BANK-INTEREST", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "credit interest---" },
  props: (text: string) => ({ bankInterest: true }),
});

// ------------------------------------------------------------

//* UPI:

MODEL.train("UPI", {
  meta: { mode: "UPI", group: "UPI" },
  match: { startsWith: "upi" },
  props: (text: string) => {
    const arr = CleanSplit(text, "/");
    const remarks = arr[5] === "upi" ? "" : arr[5];
    return { name: arr[2], ifsc: arr[3], acNum: arr[4], remarks };
  },
});

MODEL.train("UPI", {
  meta: { mode: "UPI", group: "UPI" },
  match: { startsWith: "to transfer-upi" },
  props: (text: string) => {
    const arr = CleanSplit(CleanDashes(text), "/");
    const remarks = arr[5] === "upi" ? "" : arr[5];
    return { name: arr[2], ifsc: arr[3], acNum: arr[4], remarks };
  },
});

MODEL.train("UPI", {
  meta: { mode: "UPI", group: "UPI" },
  match: { startsWith: "by transfer-upi" },
  props: (text: string) => {
    const arr = CleanSplit(CleanDashes(text), "/");
    const remarks = arr[5] === "upi" ? "" : arr[5];
    return { name: arr[2], ifsc: arr[3], acNum: arr[4], remarks };
  },
});

// ------------------------------------------------------------

//* IMPS
const IMPS_PROPS = (text: string) => {
  const arr = CleanSplit(text, "[");
  const name = CleanBrackets(arr[1]);
  const ifsc = CleanBrackets(arr[2]);
  const acNum = CleanBrackets(arr[3]);
  return { name, acNum, ifsc };
};
MODEL.train("IMPS", {
  meta: { mode: "IMPS", group: "IMPS" },
  match: { startsWith: "impsmob:p2a" },
  props: IMPS_PROPS,
});
MODEL.train("IMPS", {
  meta: { mode: "IMPS", group: "IMPS" },
  match: { startsWith: "impsnpc:p2a" },
  props: IMPS_PROPS,
});
MODEL.train("IMPS", {
  meta: { mode: "IMPS", group: "IMPS" },
  match: { startsWith: "impsmbanking:p2a" },
  props: IMPS_PROPS,
});
MODEL.train("IMPS", {
  meta: { mode: "IMPS", group: "IMPS" },
  match: { startsWith: "by transfer-inb imps" },
  props: (text: string) => {
    const arr = CleanSplit(CleanDashes(text), "/");
    return { phoneNum: arr[1], remarks: arr[3] };
  },
});
MODEL.train("IMPS-CHARGES", {
  meta: { mode: "Bank", group: "IMPS Txn Charges" },
  match: { equals: "charges for imps transaction" },
  gst: {
    cgst: { equals: "cgst on imps charges" },
    sgst: { equals: "sgst on imps charges" },
  },
  props: (text: string) => ({ bankCharge: "IMPS Txn" }),
});
MODEL.train("IMPS-CHARGES", {
  meta: { mode: "Bank", group: "IMPS Txn Charges" },
  match: { test: /charges for imps \[[\d]+\] transaction/gim },
  gst: {
    cgst: { test: /cgst on imps \[[\d]+\] charges/gim },
    sgst: { test: /sgst on imps \[[\d]+\] charges/gim },
  },
  props: (text: string) => ({ bankCharge: "IMPS Txn" }),
});

// Reversal:
MODEL.train("IMPS-REVERSAL", {
  meta: { mode: "IMPS", group: "IMPS" },
  match: { startsWith: "rev impsmob:p2a" },
  props: (text: string) => {
    const arr = CleanSplit(text, "[");
    return { reversal: true, name: arr[1].slice(0, -1) };
  },
});
MODEL.train("IMPS-REVERSAL", {
  meta: { mode: "IMPS", group: "Reversal" },
  match: { test: /imps[\d]+ rev-/gim },
  props: (text: string) => ({ name: text, reversal: true }),
});
MODEL.train("IMPS-REVERSAL-CHARGES", {
  meta: { mode: "IMPS", group: "Txn Charges Reversal" },
  match: { equals: "reversal-charges for imps transaction" },
  gst: {
    cgst: { equals: "reversal-cgst on imps charges" },
    sgst: { equals: "reversal-sgst on imps charges" },
  },
  props: (text: string) => ({ bankCharge: "IMPS Txn", reversal: true }),
});

// ------------------------------------------------------------

//* NEFT
MODEL.train("NEFT", {
  meta: { mode: "NEFT", group: "NEFT" },
  match: { startsWith: "by transfer-neft" },
  props: (text: string) => {
    const arr = CleanSplit(CleanDashes(text), "*");
    return { name: arr.pop(), ifsc: arr[0] };
  },
});
MODEL.train("NEFT", {
  meta: { mode: "NEFT", group: "NEFT" },
  match: { startsWith: "neft " },
  props: (text: string) => {
    // Narration:
    let name = "";
    let stopIndex = 0;
    const arr = CleanSplit(text, " ");
    for (let index = 0; index < arr.length; index++) {
      const word = arr[index];
      // If startswith number / is ifsc
      if (/^\d+$/.test(word[0]) || isIFSC(word)) {
        stopIndex = index;
        break;
      }
      name += ` ${word}`;
    }
    // IFSC:
    const ifsc = isIFSC(arr[stopIndex])
      ? arr[stopIndex]
      : isIFSC(arr[stopIndex + 1])
      ? arr[stopIndex + 1]
      : isIFSC(arr[stopIndex + 3])
      ? arr[stopIndex + 3]
      : "";
    return {
      name: name.trim(),
      acNum: isIFSC(arr[stopIndex]) ? "" : arr[stopIndex],
      ifsc,
    };
  },
});
MODEL.train("NEFT-CHARGES", {
  meta: { mode: "Bank", group: "NEFT Charges" },
  gst: true,
  match: { startsWith: "neft ", equals: "#PREVIOUS_TXN" },
  props: (text: string) => ({ bankCharge: "NEFT Txn" }),
});
MODEL.train("NEFT-CHARGES", {
  meta: { mode: "NEFT", group: "Txn Charges" },
  match: { startsWith: "neft-charges" },
  gst: {
    cgst: { startsWith: "neft-cgst" },
    sgst: { startsWith: "neft-sgst" },
  },
  props: (text: string) => ({ bankCharge: "NEFT Txn" }),
});

// ------------------------------------------------------------

//* RTGS:
MODEL.train("RTGS", {
  meta: { mode: "RTGS", group: "RTGS" },
  match: { startsWith: "rtgs" },
  props: (text: string) => {
    const arr = CleanSplit(text, " ");
    if (isIFSC(arr[arr.length - 2]))
      return { name: arr.slice(0, -2).join(" "), ifsc: arr[arr.length - 2] };
    return { name: arr.slice(0, -1).join(" "), ifsc: arr[arr.length - 1] };
  },
});
MODEL.train("RTGS-CHARGES", {
  meta: { mode: "Bank", group: "RTGS Charges" },
  gst: true,
  match: { startsWith: "rtgs", equals: "#PREVIOUS_TXN" },
  props: (text: string) => ({ bankCharge: "RTGS Txn" }),
});

// ------------------------------------------------------------

//* Debit Card:

MODEL.train("DEBIT-CARD", {
  meta: { mode: "Debit Card", group: "POS" },
  match: { startsWith: "pos" },
  props: (text: string) => {
    const arr1 = CleanSplit(text, "(");
    const arr2 = CleanSplit(arr1[0], "/");
    return { name: CleanSplit(arr1[1], "/")[0], posId: arr2[arr2.length - 1] };
  },
});
MODEL.train("DEBIT-CARD", {
  meta: { mode: "Debit Card", group: "POS" },
  match: { startsWith: "by debit card" },
  props: (text: string) => {
    const arr = CleanSplit(text, " ");
    return { name: arr.slice(1).join(" ").slice(0, -2) };
  },
});
MODEL.train("DEBIT-CARD-REVERSAL", {
  meta: { mode: "Debit Card", group: "Reversal" },
  match: { startsWith: "reverse pos pur---" },
  props: (text: string) => ({ name: text.trim(), reversal: true }),
});
MODEL.train("DEBIT-CARD-REVERSAL", {
  meta: { mode: "Debit Card", group: "Reversal" },
  match: { startsWith: "to:rupay/rev/pos" },
  props: (text: string) => ({ name: CleanSplit(text, ")")[1] }),
});
MODEL.train("CARD-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "to transfer-insufficient bal pos decline charge--" },
  props: (text: string) => ({ bankCharge: "INSUFFICIENT-BALANCE" }),
});
MODEL.train("CARD-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "debit-atmcard amc" },
  props: (text: string) => ({ bankCharge: "DEBIT-CARD-AMC" }),
});
MODEL.train("CARD CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { includes: "atm card charges" },
  gst: true,
  props: (text: string) => ({ bankCharge: "DEBIT-CARD-AMC" }),
});

// ------------------------------------------------------------

//* ATM:

MODEL.train("ATM-CHARGES", {
  meta: { mode: "Bank", group: "Bank Charges" },
  match: { startsWith: "atm id-" },
  gst: true,
  props: (text: string) => ({ bankCharge: "ATM" }),
});
MODEL.train("ATM-WITHDRAWAL", {
  meta: { mode: "ATM", group: "ATM" },
  match: { startsWith: "to:atm" },
  props: (text: string) => {
    const arr = CleanSplit(text, ":");
    return { name: arr.pop() };
  },
});
MODEL.train("ATM-WITHDRAWAL", {
  meta: { mode: "ATM", group: "ATM" },
  match: { startsWith: "to:nfs" },
  props: (text: string) => {
    const arr = CleanSplit(text, "/");
    return { name: arr.pop()?.replaceAll("+", "") };
  },
});
MODEL.train("ATM-WITHDRAWAL", {
  meta: { mode: "ATM", group: "ATM" },
  match: { startsWith: "to:16:atm" },
  props: (text: string) => {
    const arr = CleanSplit(text, ":");
    return { name: arr[2] };
  },
});
MODEL.train("ATM-WITHDRAWAL", {
  meta: { mode: "ATM", group: "ATM" },
  match: { startsWith: "atm wdl-atm cash" },
  props: (text: string) => {
    text = CleanDashes(text);
    let narrationIndex = 0;
    for (let index = 0; index < text.length; index++) {
      const letter = text[index];
      if (/[^0-9 +]+$/.test(letter)) {
        narrationIndex = index;
        break;
      }
    }
    return { name: text.slice(narrationIndex) };
  },
});
MODEL.train("ATM-REVERSAL", {
  meta: { mode: "ATM", group: "ATM" },
  match: { startsWith: "to:/rev/" },
  props: (text: string) => ({ name: text, reversal: true }),
});

// ------------------------------------------------------------

//* NACH:

MODEL.train("NACH", {
  meta: { mode: "IMPS", group: "NACH" },
  match: { includes: "tp ach" },
  props: (text: string) => {
    const arr = CleanSplit(text, " ");
    return { name: arr.slice(2).join(" ") };
  },
});

// ------------------------------------------------------------

//* Cheque:

MODEL.train("CHEQUE", {
  meta: { mode: "Cheque", group: "Cheque" },
  match: { startsWith: "cts-i" },
  props: (text: string) => ({ name: text.trim() }),
});

// ------------------------------------------------------------

//* Unidentified Category:

MODEL.train("SELF", {
  meta: { mode: "Unknown", group: "Self" },
  match: { equals: "to self" },
  props: (text: string) => ({ name: "Self Transfer" }),
});

MODEL.train("ECM", {
  meta: { mode: "Unknown", group: "ECM" },
  match: { startsWith: "ecm/" },
  props: (text: string) => ({
    name: CleanSplit(CleanSplit(text, "(")[1], "/")[0].trim(),
  }),
});

MODEL.train("MOBILE TRANSFER", {
  meta: { mode: "Unknown", group: "MOBILE TRANSFER" },
  match: { startsWith: "mob trf to" },
  props: (text: string) => {
    const arr = CleanSplit(text, '","');
    return { name: arr[1], remarks: arr[3].replaceAll('"', "") };
  },
});

export default MODEL.generate();
