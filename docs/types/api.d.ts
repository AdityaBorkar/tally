// Voucher Type
type VoucherType = {
  type: "Receipt" | "Payment" | "Contra";
  vchNum: string | number;
  txn: {
    date: Date;
    amount: number;
    transfer: "DB" | "CR";
    // mode
  };
  toLedger: string;
  fromLedger: string;
  narration: string;
};

// API Response Type
type ApiResponse =
  | { success: true; data: any }
  | { success: false; error: string };
