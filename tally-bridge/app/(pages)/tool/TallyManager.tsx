"use client";

// Types:
type ApiResponse =
  | { success: true; data: any }
  | { success: false; error: string };
type StatementRowType = {};
type StatementManagerType = {
  exportVouchers: (props: {
    StartNum: number;
    SkipContra: string[];
  }) => VoucherType[];
  save: (index: number, ledger: { name: string; id: string }) => void;
  status: () => any;
  raw: StatementRowType[];
  // data: StatementRowType[];
  BankName: string;
  // bank: { acName: string; bankName: string; ledgerName: string };
};
type TallyContextType = {
  tally: {
    config: { CompanyName: string; url: string };
    banks: BANK_TYPE[];
    ledgers: LEDGER_TYPE[];
    PullLedgers: () => Promise<ApiResponse>;
    CreateLedger: (LedgerDetails: any) => Promise<ApiResponse>;
    PushVouchers: (BodyData: any) => Promise<ApiResponse>;
  };
  statement: StatementManagerType;
  NewTallyConfig: (props: any) => void;
  NewStatement: Dispatch<
    SetStateAction<{
      bank: string;
      StatementString: string;
    }>
  >;
};

// Libraries:
import StatementManager from "./StatementManager";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

// Context:
export const TallyContext = createContext<TallyContextType>({
  tally: {
    config: { CompanyName: "", url: "" },
    banks: [],
    ledgers: [],
    PullLedgers: () => new Promise<ApiResponse>((resolve) => {}),
    PushVouchers: (statement) => new Promise<ApiResponse>((resolve) => {}),
    CreateLedger: (LedgerDetails) => new Promise<ApiResponse>((resolve) => {}),
  },
  statement: {
    // data: [],
    raw: [],
    BankName: "", //{ bankName: "", acName: "", ledgerName: "" },
    status: () => {},
    save: () => {},
    exportVouchers: (props) => [],
  },
  NewTallyConfig: (props: any) => {},
  NewStatement: (props: any) => {},
});

// Context Providor:
// TODO - Add type safety
export const TallyContextProvider = (props: any) => {
  // Data:
  const [config, NewTallyConfig] = useState({ CompanyName: "", url: "" });
  const [ledgers, UPDATE_LEDGERS] = useState<LEDGER_TYPE[]>([]);
  const [banks, UPDATE_BANKS] = useState<BANK_TYPE[]>([]);

  // Statement Manager:
  const [StatementConfig, NewStatement] = useState({
    bank: "No Data",
    StatementString: "No Data",
  });
  const statement = StatementManager({
    ...StatementConfig,
    getLedgers: () => ledgers,
  });

  // TODO - Reset statement on change of config
  // useEffect(() => {
  //   NewStatement({ bank: "", StatementString: "" });
  // }, [config]);

  // Sync Functions:
  function PullLedgers() {
    return new Promise<ApiResponse>(async (resolve, reject) => {
      try {
        // URL is automatically encoded by Next.js
        const URL = `/api/ledgers?CompanyName=${config.CompanyName}&url=${config.url}`;
        const response = await fetch(URL);
        const data = await response.json();
        const { ledgers, banks, groups } = data;
        // Update data:
        UPDATE_LEDGERS([...ledgers]);
        UPDATE_BANKS([...banks]);
        resolve({ success: true, data: null });
      } catch (err) {
        console.log("Error in Pulling Tally Data:", err);
        // @ts-ignore
        const error = err?.message || "Unknown Error";
        reject({ success: false, error });
      }
    });
  }
  function PushVouchers(BodyData: any) {
    return new Promise<ApiResponse>(async (resolve) => {
      try {
        // URL is automatically encoded by Next.js
        const URL = `/api/vouchers/bank?CompanyName=${config.CompanyName}&url=${config.url}`;
        const body = JSON.stringify(BodyData);
        const request = await fetch(URL, { method: "POST", body });
        const resp = await request.json();
        resolve(resp);
      } catch (err) {
        console.log("Error in Pushing Tally Data:", err);
        // @ts-ignore
        const error = err?.message || "Unknown Error";
        resolve({ success: false, error });
      }
    });
  }
  function CreateLedger(LedgerDetails: any) {
    return new Promise<ApiResponse>(async (resolve, reject) => {
      try {
        // URL is automatically encoded by Next.js
        const URL = `/api/ledgers?CompanyName=${config.CompanyName}&url=${config.url}`;
        const response = await fetch(URL, {
          method: "POST",
          body: JSON.stringify({ LedgerDetails }),
        });
        const data = await response.json();
        if (data.success) resolve({ success: true, data: null });
        else reject({ success: false, error: data.error });
      } catch (err) {
        console.log("Error in Creating Ledger in Tally:", err);
        // @ts-ignore
        const error = err?.message || "Unknown Error";
        reject({ success: false, error });
      }
    });
  }

  // Return Providor:
  const tally = {
    config,
    banks,
    ledgers,
    PullLedgers,
    PushVouchers,
    CreateLedger,
  };
  return (
    <TallyContext.Provider
      value={{ tally, statement, NewTallyConfig, NewStatement }}
    >
      {props.children}
    </TallyContext.Provider>
  );
};

// Hook:
export const useTallyContext = () => useContext(TallyContext);
