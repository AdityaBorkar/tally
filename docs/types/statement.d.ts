type StatementDataType = {
  date: {
    string: string;
    obj: Date;
  };
  details: {
    ref: string;
    rawText: string;
    narration: string;
    highlight: string[];
  };
  txn: {
    mode: TxnMode;
    amount: number;
    gst: { cgst: number; sgst: number; igst: number };
    transfer: "DB" | "CR";
  };
  _txnAttr: TxnAttributes;
  ledger: {
    name: string;
    guid: string;
  };
  closing: number;
};
