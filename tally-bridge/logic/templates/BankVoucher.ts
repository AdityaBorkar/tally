type NewBankVoucherProps = {
  CompanyName: string;
  voucher: VoucherType;
};

export function NewBankVoucher({ CompanyName, voucher }: NewBankVoucherProps) {
  // TODO - Duplicate and other STATICVARIABLES
  // Data:
  const VCH = voucher;
  const date = new Date(VCH.txn.date);
  const YEAR = date.getFullYear();
  const MONTH = (date.getMonth() + 1).toString().padStart(2, "0");
  const DATE_NUM = date.getDate().toString().padStart(2, "0");
  const DATE = `${YEAR}${MONTH}${DATE_NUM}`;

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
            VOUCHER: {
              _attributes: { VCHTYPE: VCH.type, ACTION: "Create" },
              DATE: { _text: DATE },
              NARRATION: { _text: VCH.narration },
              VOUCHERNUMBER: { _text: VCH.vchNum },
              VOUCHERTYPENAME: { _text: VCH.type },
              PARTYLEDGERNAME: { _text: VCH.toLedger },
              "ALLLEDGERENTRIES.LIST": GetLedgerEntries(VCH),
            },
          },
        },
      },
    },
  };
}

// export function NewBankVoucher({
//   CompanyName,
//   voucher: vouchers,
// }: NewBankVoucherProps) {
//   // TODO - Duplicate and other STATICVARIABLES
//   return {
//     ENVELOPE: {
//       HEADER: {
//         VERSION: { _text: "1" },
//         TALLYREQUEST: { _text: "Import" },
//         TYPE: { _text: "Data" },
//         ID: { _text: "Vouchers" },
//       },
//       BODY: {
//         DESC: {
//           STATICVARIABLES: {
//             SVCURRENTCOMPANY: { _text: CompanyName },
//             //   IMPORTDUPS: {
//             //     _text: "@@DUPCOMBINE",
//             //   },
//           },
//         },
//         DATA: {
//           TALLYMESSAGE: {
//             // _attributes: { "xmlns:UDF": "TallyUDF" },
//             VOUCHER: vouchers.map((VCH) => {
//               const date = new Date(VCH.txn.date);
//               const YEAR = date.getFullYear();
//               const MONTH = (date.getMonth() + 1).toString().padStart(2, "0");
//               const DATE_NUM = date.getDate().toString().padStart(2, "0");
//               const DATE = `${YEAR}${MONTH}${DATE_NUM}`;

//               return {
//                 _attributes: { VCHTYPE: VCH.type, ACTION: "Create" },
//                 DATE: { _text: DATE },
//                 NARRATION: { _text: VCH.narration },
//                 VOUCHERNUMBER: { _text: VCH.vchNum },
//                 VOUCHERTYPENAME: { _text: VCH.type },
//                 PARTYLEDGERNAME: { _text: VCH.toLedger }, // TODO - Verify for Contra
//                 "ALLLEDGERENTRIES.LIST": GetLedgerEntries(VCH),
//               };
//             }),
//           },
//         },
//       },
//     },
//   };
// }

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
