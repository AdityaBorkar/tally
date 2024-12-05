// Model:
type TxnMode =
  | "UPI"
  | "NEFT"
  | "IMPS"
  | "RTGS"
  | "Debit Card"
  | "ATM"
  | "NACH"
  | "Cheque"
  | "Bank"
  | "Unknown";
type TxnGroups = "Bank Charges" | string;
type TxnAttributes = {
  reversal?: boolean;
  bankInterest?: boolean;
  gst?: true | { cgst: MatchOperators; sgst: MatchOperators };
  acNum?: string;
  ifsc?: string;
  name?: string;
  upiId?: string;
  txnId?: string;
  remarks?: string;
  phoneNum?: string;
  posId?: string;
  bankCharge?:
    | "SMS"
    | "MIN-BAL"
    | "OTHERS"
    | "ATM"
    | "DEBIT-CARD-AMC"
    | "FUEL"
    | "INSUFFICIENT-BALANCE"
    | "IMPS Txn"
    | "NEFT Txn"
    | "RTGS Txn";
};

// Precedence = EQUALS > STARTSWITH > INCLUDES
type MatchOperators = {
  startsWith?: string;
  includes?: string;
  equals?: string;
  test?: RegExp;
};
type NarrationType = (text: string) => { desc: string; highlights: string[] };
type ConditionType = ["equals" | "startsWith" | "includes", string | string[]];
type GuideType = {
  UID?: string; //! REMOVE THIS
  highPriority?: boolean;
  meta: { mode: TxnMode; group: TxnGroups };
  match: MatchOperators;
  gst?:
    | true
    | {
        cgst: MatchOperators;
        sgst: MatchOperators;
        // igst: MatchOperators;
      };
  props: (text: string) => TxnAttributes;
};
type GstConfigType = {
  type: "INTRA-STATE" | "INTER-STATE";
  combineCharges: boolean;
  prefix: {
    cgst: MatchOperators;
    sgst: MatchOperators;
    igst?: MatchOperators;
  };
};
type ModelType = {
  CleanTxnText: (txt: string) => string;
  gst: GstConfigType;
  guide: GuideType[];
};

// Statement:
type TxnEntryType = {
  date: Date;
  dateString: string;
  txnRef: string;
  desc: string;
  amt: number;
  balance: number;
  cr: number;
  db: number;
};
type StatementType = TxnEntryType[];
