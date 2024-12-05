// Libraries:
import { parse } from "csv-parse/sync";

// Utilities:
import Counter from "utils/Counter";
import TxnProcessor from "./TxnParser";
import ReportError from "./ReportError";
import { AssignModel } from "./BankList";

// * NOTE - Code has been breaked down into functions for better understanding.

// Backend Functionalities:
type ParseStatementProps = { data: string; bank: string; model?: any };
export default function ParseStatementString(props: ParseStatementProps) {
  // Config:
  const { data, bank } = props;
  const MODEL = bank === "TESTING" ? props.model : AssignModel(bank);
  if (MODEL === undefined) throw ReportError(`Unknown Bank - "${bank}"`);

  // Sanitize Data:
  const RawStatement = SanitizeData(data, bank);

  // * Process Statement:
  // Store Data:
  const analytics = new Counter({});
  const STATEMENT: StatementDataType[] = [];

  // Process Data:
  for (let TxnIndex = 0; TxnIndex < RawStatement.length; TxnIndex++) {
    // Txn Manager:
    const GetTxn = (num: number) => RawStatement[TxnIndex + num];
    const ChangeTxnIndex = (num: number) => {
      TxnIndex += num;
      analytics.add({ total: 2 });
    };

    // Txn Profile:
    const TxnEntry = RawStatement[TxnIndex];
    const TxnProfile = TxnProcessor({ MODEL, ChangeTxnIndex, GetTxn });
    const { uid, mode, gst, attr } = TxnProfile.data;
    const { narration, highlight } = ConstructHumanReadableNarration(attr);
    const amount = TxnEntry.amt > 0 ? TxnEntry.cr : TxnEntry.db;
    const transfer = TxnEntry.amt > 0 ? "CR" : "DB";

    // Analytics:
    analytics.add({
      total: 1,
      [mode]: {
        cr: {
          amt: TxnEntry.amt >= 0 ? TxnEntry.amt : 0,
          count: TxnEntry.amt >= 0 ? TxnEntry.amt : 0,
        },
        db: {
          amt: TxnEntry.amt < 0 ? TxnEntry.amt : 0,
          count: TxnEntry.amt < 0 ? TxnEntry.amt : 0,
        },
      },
    });

    // Error Reporting:
    if (TxnProfile.error !== false) {
      analytics.add({ unidentified: 1 });
      // ReportError("Transaction Entry couldn't be processed.", {txnText:TxnEntry.desc, output:ProcessorOutput});
      // continue;
    }

    // Return:
    STATEMENT.push({
      date: {
        string: TxnEntry.date.toLocaleDateString("hi", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        obj: TxnEntry.date,
      },
      details: {
        ref: TxnEntry.txnRef,
        rawText: TxnEntry.desc,
        narration,
        highlight,
      },
      txn: {
        gst,
        mode,
        transfer,
        amount: amount + gst.cgst + gst.sgst + gst.igst,
      },
      _txnAttr: attr,
      ledger: { name: "", guid: "" },
      closing: TxnEntry.balance,
    });
  }

  // Analytics and Coverage:
  analytics.add({
    identified: analytics.value.total - analytics.value.unidentified,
  });
  const ANALYTICS = analytics.value;
  const COVERAGE = {
    percent: parseFloat(
      ((ANALYTICS.identified * 100) / ANALYTICS.total).toFixed(2)
    ),
    unidentified: ANALYTICS.unidentified,
    identified: ANALYTICS.identified,
    total: ANALYTICS.total,
  };

  // Return:
  return { STATEMENT, ANALYTICS, COVERAGE };
}

function ConstructHumanReadableNarration(attr: TxnAttributes) {
  let NARRATION = "";
  if (attr.name) NARRATION += ` ${toTitleCase(attr.name)}`;
  if (attr.phoneNum) NARRATION += ` ${attr.phoneNum}`;
  if (attr.remarks) NARRATION += ` (${toTitleCase(attr.remarks)})`;
  if (attr.acNum) NARRATION += ` [${attr.acNum}]`;
  if (attr.ifsc) NARRATION += ` [${attr.ifsc}]`;
  if (attr.upiId) NARRATION += ` (UPI ID - ${attr.upiId})`;
  if (attr.posId) NARRATION += ` (POS - ${attr.posId})`;
  if (attr.bankInterest) NARRATION += `Bank Interest`;
  if (attr.bankCharge) NARRATION += `Bank Charges for ${attr.bankCharge}`;
  if (attr.gst) NARRATION += " + GST";
  return { narration: NARRATION.trim(), highlight: [""] };
}

type BankName = string;
function SanitizeData(data: string, bank: BankName) {
  // Error - Data Malformed for auto-processing. Kindly upload the data in specimen format.
  // OTHERS - Auto-processing is not available for this bank. Kindly upload the data in specimen format.

  const sanitized = AutoSanitizeData(data, bank);

  const DATA_ARRAY = parse(sanitized?.data, {
    trim: true,
    escape: '"',
    columns: true,
    skip_empty_lines: true,
    // cast: true,
    // cast_date: true
    // from_line: 1,
    // to_line: (sanitized?.data.match(/\n/g)?.length || 2) - 3,
    // Default value is -1, which means the last line of the file.
  });
  const DATA_VALIDATED: TxnEntryType[] = DATA_ARRAY.map((TXN: any) => {
    // Co-relate:
    const txn = {
      Description: TXN[sanitized.headers.Description],
      Reference: TXN[sanitized.headers.Reference],
      TxnDate: TXN[sanitized.headers.TxnDate],
      Balance: TXN[sanitized.headers.Balance],
      Credit: TXN[sanitized.headers.Credit],
      Debit: TXN[sanitized.headers.Debit],
    };

    // Data Clensing:
    if (txn.TxnDate === "") return null;
    const DATE = new Date(txn.TxnDate);
    const DESC = txn.Description.trim();
    const REF_ID = txn.Reference.trim();
    const DEBIT = toCurrency(txn.Debit);
    const CREDIT = toCurrency(txn.Credit);
    const RUNNING_BALANCE = toCurrency(txn.Balance);

    // Validation:
    // if (CREDIT === 0 && DEBIT === 0) throw ["Error - Txn Amount is 0", txn];
    if (CREDIT !== 0 && DEBIT !== 0)
      // TODO - Show this error in UI
      throw "Error - Credit & Debit Boths Present";

    // Return
    return {
      date: DATE,
      desc: DESC,
      txnRef: REF_ID,
      db: DEBIT,
      cr: CREDIT,
      amt: CREDIT - DEBIT,
      balance: RUNNING_BALANCE,
    };
  }).filter((data: any) => data !== null);
  console.log("1] CSV Data = ", DATA_ARRAY);
  console.log("2] JSON Data = ", DATA_VALIDATED);
  return DATA_VALIDATED;
}

function AutoSanitizeData(data: string, bank: BankName) {
  const dataLines = data.trim().split("\n");
  switch (bank) {
    case "State Bank of India (India)":
      const NewDataLines = dataLines.slice(19, dataLines.length - 2);
      return {
        data: NewDataLines.join("\n"),
        headers: {
          TxnDate: "Txn Date",
          Description: "Description",
          Reference: "Ref No./Cheque No.",
          Debit: "Debit",
          Credit: "Credit",
          Balance: "Balance",
        },
      };
    // case "Abhyudaya Co-Op. Bank Ltd. (India)":
    //   // ABHYUDAYA - First 11, then headers and then 5.
    //   // Entry Date	Description	Chq No/Ref No	Value Date	Debit	Credit	Balance
    //   return;
    default:
      return {
        data,
        headers: {
          TxnDate: "Txn Date",
          Description: "Description",
          Reference: "Reference",
          Debit: "Debit",
          Credit: "Credit",
          Balance: "Balance",
        },
      };
  }
}

// String Utils:

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function toCurrency(str: string) {
  return parseFloat((str || "").toString().replaceAll(",", "")) || 0;
}
