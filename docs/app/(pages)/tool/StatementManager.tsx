// Types:
type StatementPropsType = {
  bank: string;
  StatementString: string;
  getLedgers: () => LEDGER_TYPE[];
};
type TrainingDataType = any;

// Libraries:
import ParseStatementString from "logic/parser";
import { useState } from "react";

// Class:
export default function Statement(props: StatementPropsType) {
  // Variables:
  const getLedgers = props.getLedgers;
  const BankName = props.bank || "No Data";

  // Process Statement
  const data =
    BankName === "No Data" || BankName === ""
      ? { STATEMENT: [] }
      : ParseStatementString({
          data: props.StatementString,
          bank: props.bank,
        });
  // TODO - Catch and raise modals

  // ML:
  // const ML_MODEL =
  //   BankName === "No Data" || BankName === "" ? null : CreateModel();
  const TrainingData: TrainingDataType[] = [];
  const ProcessedData = data.STATEMENT.map((st) => {
    const ledger = PredictLedger(st._txnAttr);
    return { ...st, ledger };
  });

  // Variables:
  const [RAW, RESET_RAW] = useState(ProcessedData);
  const [FINAL, SET_FINAL] = useState<StatementDataType[]>([]);

  // Status:
  function status() {
    return { filled: FINAL.length, total: RAW.length };
  }

  // Save/Modify:
  function save(index: number, _ledger: { name: string; id: string }) {
    if (_ledger.name === "") return;
    // const MODIFICATION = this.final[index] ? true : false;

    SET_FINAL((final) => {
      const ledger = { name: _ledger.name, guid: _ledger.id };
      const data = { ...RAW[index], ledger };
      final[index] = data;
      TrainingData[index] = data;
      return final;
    });
  }

  // Export Vouchers:
  function exportVouchers(props: { StartNum: number; SkipContra: string[] }) {
    // Basics:
    const BankLedgerName = BankName;
    if (BankLedgerName === "") return [];

    // Contra Entries:
    const CONTRA_SKIP_NAMES = props.SkipContra;
    const CONTRA_ALL_NAMES = getLedgers()
      .map((ledger) =>
        ["Bank Accounts", "Cash-in-Hand", "Bank OD A/c"].includes(ledger.parent)
          ? ledger.name
          : undefined
      )
      .filter((ledger) => ledger !== undefined);

    // Final Order:
    let VOUCHER_NUMBER = props.StartNum;
    const TALLY_MESSAGE: VoucherType[] = [];
    FINAL.forEach((st) => {
      // Ledger:
      const ToLedgerName = st.ledger?.name || "";
      if (ToLedgerName === "") return;

      // Detect Voucher Type:
      if (CONTRA_SKIP_NAMES.includes(ToLedgerName)) return;
      const type = CONTRA_ALL_NAMES.includes(ToLedgerName)
        ? "Contra"
        : st.txn.transfer === "CR"
        ? "Receipt"
        : "Payment";

      // Save:
      TALLY_MESSAGE.push({
        type,
        vchNum: VOUCHER_NUMBER,
        fromLedger: BankLedgerName,
        toLedger: ToLedgerName,
        narration: st.details.rawText,
        txn: {
          date: st.date.obj,
          amount: st.txn.amount,
          transfer: st.txn.transfer,
        },
      });
      VOUCHER_NUMBER += 1;
    });

    // Save data for analytics:
    fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({
        subject: "StatementManager > POST for write",
        timestamp: new Date(),
        TrainingData: TrainingData,
        StartNum: props.StartNum,
        message: TALLY_MESSAGE,
        final: FINAL,
        raw: RAW,
      }),
    });

    // Return:
    return TALLY_MESSAGE;
  }

  // Predictions:
  function PredictLedger(TxnAttr: TxnAttributes) {
    const ledger = { name: "", guid: "" };
    return ledger;
    // TODO

    //   const PredictLedger = async (st: Partial<StatementDataType>) => {
    //     const Model = await MlModelManager();
    //     // INPUTS: upi, bankCharge, bankInterest, name, phoneNum
    //     // export default function IdentifyLedger() {
    //     //   // load model
    //     //   // predict()
    //     //   // USE SBI SAMPLE DATE TO EXECUTE
    //     //   // Generate UNIT Tests and INTEGRATION Tests using GitHub Co-pilot
    //     //   return { name: "", guid: "" };x`x`
    //     // }
    //     // ---------------------------------------------
    //     // upiId
    //     // phoneNum
    //     // type TxnAttributes = {
    //     //     reversal?: boolean;
    //     //     bankInterest?: boolean;
    //     //     gst?: true | { cgst: MatchOperators; sgst: MatchOperators };
    //     //     acNum?: string;
    //     //     ifsc?: string;
    //     //     name?: string;
    //     //     remarks?: string;
    //     //     posId?: string;
    //     //     bankCharge?:
    //     //       | "SMS"
    //     //       | "MIN-BAL"
    //     //       | "OTHERS"
    //     //       | "ATM"
    //     //       | "DEBIT-CARD-AMC"
    //     //       | "FUEL"
    //     //       | "INSUFFICIENT-BALANCE"
    //     //       | "IMPS Txn"
    //     //       | "NEFT Txn"
    //     //       | "RTGS Txn";
    //     //   };
    //   };
  }

  return { raw: RAW, BankName, save, status, exportVouchers };
}

// // Class:
// export class StatementClass {
//   // Sync data from stores:
//   getLedgers: () => LEDGER_TYPE[] = () => [];

//   // Basic Data:
//   bankName: string = "No Data";
//   raw: StatementDataType[] = [];
//   final: StatementDataType[] = [];

//   // ML Model:
//   TrainingData: any[] = [];
//   model = {};

//   // Constructor
//   constructor(props: StatementPropsType) {
//     // Process Statement
//     console.log("props.bank = ", props.bank);
//     const data =
//       props.bank === "No Data" || props.bank === ""
//         ? { STATEMENT: [] }
//         : ParseStatementString({
//             data: props.StatementString,
//             bank: props.bank,
//           });

//     // ML:
//     // this.model = CreateModel();
//     const statement = data.STATEMENT.map((st) => {
//       const ledger = this.#PredictLedger(st._txnAttr);
//       return { ...st, ledger };
//     });

//     // Basics:
//     this.bankName = props.bank;
//     this.raw = statement;
//     this.final = [];
//   }

//   // Status:
//   status = () => ({ filled: this.final.length, total: this.raw.length });

//   // Save/Modify:
//   save(index: number, _ledger: { name: string; id: string }) {
//     if (_ledger.name === "") return;
//     // const MODIFICATION = this.final[index] ? true : false;

//     const ledger = { name: _ledger.name, guid: _ledger.id };
//     const data = { ...this.final[index], ledger };

//     this.final[index] = data;
//     this.TrainingData[index] = data;
//     // TODO - Training Time can be optimized by just entering one data, rather than entire array
//   }

//   // Export Vouchers:
//   exportVouchers(props: { StartNum: number; SkipContra: string[] }) {
//     // Basics:
//     const BankLedgerName = this.bankName;
//     if (BankLedgerName === "") return [];

//     // Contra Entries:
//     const CONTRA_SKIP_NAMES = props.SkipContra;
//     const CONTRA_ALL_NAMES = this.getLedgers()
//       .map((ledger) =>
//         ["Bank Accounts", "Cash-in-Hand", "Bank OD A/c"].includes(ledger.parent)
//           ? ledger.name
//           : undefined
//       )
//       .filter((ledger) => ledger !== undefined);

//     // Final Order:
//     let VOUCHER_NUMBER = props.StartNum;
//     const TALLY_MESSAGE: VoucherType[] = [];
//     this.final.forEach((st) => {
//       // Ledger:
//       const ToLedgerName = st.ledger?.name || "";
//       if (ToLedgerName === "") return;

//       // Detect Voucher Type:
//       if (CONTRA_SKIP_NAMES.includes(ToLedgerName)) return;
//       const type = CONTRA_ALL_NAMES.includes(ToLedgerName)
//         ? "Contra"
//         : st.txn.transfer === "CR"
//         ? "Receipt"
//         : "Payment";

//       // Save:
//       TALLY_MESSAGE.push({
//         type,
//         vchNum: VOUCHER_NUMBER,
//         fromLedger: BankLedgerName,
//         toLedger: ToLedgerName,
//         narration: st.details.rawText,
//         txn: {
//           date: st.date.obj,
//           amount: st.txn.amount,
//           transfer: st.txn.transfer,
//         },
//       });
//       VOUCHER_NUMBER += 1;
//     });

//     // Save data for analytics:
//     fetch("/api/analytics", {
//       method: "POST",
//       body: JSON.stringify({
//         subject: "StatementManager > POST for write",
//         timestamp: new Date(),
//         TrainingData: this.TrainingData,
//         StartNum: props.StartNum,
//         message: TALLY_MESSAGE,
//         final: this.final,
//         raw: this.raw,
//       }),
//     });

//     // Return:
//     return TALLY_MESSAGE;
//   }

//   // Predictions:
//   #PredictLedger(TxnAttr: TxnAttributes) {
//     const ledger = { name: "", guid: "" };
//     return ledger;
//     // TODO
//   }
// }
