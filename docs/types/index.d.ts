// With reference to Tally:
type MasterType = "CURRENCY" | "GROUP" | "LEDGER" | "COMPANY";
type MASTER_TYPE = {
  type: MasterType;
  name: string;
  guid: string;
  parent: string;
  alterId: number;
  updatedDateTime: string;
};
interface GROUP_TYPE extends MASTER_TYPE {}
interface LEDGER_TYPE extends MASTER_TYPE {}
interface BANK_TYPE extends MASTER_TYPE {
  name: string;
  ifsc: string;
  branch: string;
  acName: string;
  refName: string;
  bankName: string;
}

// With reference to frontend
type TallyData = {
  url: string;
  CompanyName: string;
  ledgers: LEDGER_TYPE[];
  banks: BANK_TYPE[];
  statement: {
    data: StatementDataType[];
    bank: { acName: string; bankName: string };
    coverage: any;
    analytics: any;
  };
};
type VoucherJsonType = {
  type: string;
  number: number;
  fromAccount: string;
  toAccount: any;
  narration: any;
  txn: {
    date: string;
    amount: any;
  };
};
