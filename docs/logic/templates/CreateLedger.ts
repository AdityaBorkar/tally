type NewLedgerProps = {
  CompanyName: string;
  LedgerDetails: {
    name: string;
  };
};

export function CreateLedger({ CompanyName, LedgerDetails }: NewLedgerProps) {
  // TODO - Duplicate and other STATICVARIABLES
  // Data:
  const { name } = LedgerDetails;

  // Return:
  return {
    ENVELOPE: {
      HEADER: {
        VERSION: { _text: "1" },
        TALLYREQUEST: { _text: "Import" },
        TYPE: { _text: "Data" },
        ID: { _text: "Vouchers" },
      },
      BODY: {
        DESC: {
          STATICVARIABLES: {
            SVCURRENTCOMPANY: { _text: CompanyName },
            //   IMPORTDUPS: {
            //     _text: "@@DUPCOMBINE",
            //   },
          },
        },
        DATA: {
          TALLYMESSAGE: {
            // _attributes: { "xmlns:UDF": "TallyUDF" },
            LEDGER: {
              _attributes: { NAME: name, ACTION: "Create" },
              NAME: { _text: name },
              PARENT: { _text: "Suspense A/c" },
              OPENINGBALANCE: { _text: 0 },
            },
          },
        },
      },
    },
  };
}

function GetLedgerEntries(VCH: VoucherType) {
  const AMOUNT = Math.abs(VCH.txn.amount);

  if (VCH.type !== "Contra") {
    const isReceipt = VCH.type === "Receipt";
    return [
      {
        // Paid to:
        LEDGERNAME: { _text: VCH.toLedger },
        AMOUNT: { _text: isReceipt ? AMOUNT : -AMOUNT },
        ISDEEMEDPOSITIVE: { _text: isReceipt ? "No" : "Yes" },
      },
      {
        // Paid By:
        LEDGERNAME: { _text: VCH.fromLedger },
        AMOUNT: { _text: isReceipt ? AMOUNT : -AMOUNT },
        ISDEEMEDPOSITIVE: { _text: isReceipt ? "Yes" : "No" },
      },
    ];
  }

  // If Contra:
  const DEBIT = VCH.txn.transfer === "DB";
  return [
    {
      // Debited from Account:
      LEDGERNAME: { _text: DEBIT ? VCH.fromLedger : VCH.toLedger },
      ISDEEMEDPOSITIVE: { _text: "No" },
      AMOUNT: { _text: AMOUNT },
    },
    {
      // Credited To Account:
      LEDGERNAME: { _text: DEBIT ? VCH.toLedger : VCH.fromLedger },
      ISDEEMEDPOSITIVE: { _text: "Yes" },
      AMOUNT: { _text: -AMOUNT },
    },
  ];
}
