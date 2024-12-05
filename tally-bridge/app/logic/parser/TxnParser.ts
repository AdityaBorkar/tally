// Types:
type ProcessorReturnType = {
  error:
    | false
    | {
        msg: string;
        debug: any;
      };
  data: {
    uid?: string;
    mode: TxnMode;
    gst: { cgst: number; sgst: number; igst: number };
    attr: TxnAttributes;
  };
};
type ProcessorType = {
  MODEL: ModelType;
  GetTxn: any;
  ChangeTxnIndex: any;
};

// Transaction Parser:
export default function TxnParser(props: ProcessorType): ProcessorReturnType {
  const TxnData = props.GetTxn(0);
  const CleanTxnText = props.MODEL.CleanTxnText;
  const TxnText = CleanTxnText(TxnData.desc);
  const ModelMatches: ProcessorReturnType[] = [];

  for (const ModelItem of props.MODEL.guide) {
    // Check for Match
    let MATCH = CheckForMatch(ModelItem.match, TxnText, props.GetTxn);
    if (!MATCH.result) continue;
    // If Success:
    const attr = ModelItem.props(TxnText.replace(MATCH.match, ""));
    let gst = { cgst: 0, sgst: 0, igst: 0 };
    // If GST is present in the transaction,
    if (ModelItem.gst) {
      // CONFIG:
      const GST_CONFIG =
        ModelItem.gst === true ? props.MODEL.gst.prefix : ModelItem.gst;
      // GST:
      const CGST_TXN = props.GetTxn(+1);
      const SGST_TXN = props.GetTxn(+2);
      const CGST_TXN_TEXT = CleanTxnText(CGST_TXN.desc);
      const SGST_TXN_TEXT = CleanTxnText(SGST_TXN.desc);
      // VERIFY:
      const CGST_MATCH = CheckForMatch(
        GST_CONFIG.cgst,
        CGST_TXN_TEXT,
        props.GetTxn
      ).result;
      const SGST_MATCH = CheckForMatch(
        GST_CONFIG.sgst,
        SGST_TXN_TEXT,
        props.GetTxn
      ).result;
      // PROCESS:
      if (!CGST_MATCH || !SGST_MATCH) {
        // console.log(`[GST MATCH ERROR] = (${CGST_MATCH}) ${CGST_TXN.desc}`);
        // TODO - What to do with error? How to escalate?
      } else {
        props.ChangeTxnIndex(+2);
        gst = { cgst: CGST_TXN.amt, sgst: SGST_TXN.amt, igst: 0 };
      }
    }

    // Check for False Positives:
    let isFalsePositive = "";
    const isBankCharge = attr.bankCharge !== undefined;
    const isReversal = attr.reversal === true ? true : false;
    if (isBankCharge && TxnData.amt > 0 && !isReversal)
      isFalsePositive = "Illegal Detection: Positive Bank Charge";
    else if (isReversal && TxnData.amt < 0)
      isFalsePositive = "Illegal Detection: Negative Amount in Reversal";
    else if (attr.gst && gst.cgst + gst.sgst + gst.igst <= 0)
      isFalsePositive = "Illegal Detection: GST is zero";

    if (isFalsePositive !== "")
      ModelMatches.push({
        error: { msg: isFalsePositive, debug: { txn: props.GetTxn(0) } },
        data: {
          uid: "UNIDENTIFIED",
          mode: "Unknown",
          attr: {},
          gst: { cgst: 0, sgst: 0, igst: 0 },
        },
      });
    else
      ModelMatches.push({
        error: false,
        data: {
          gst,
          uid: ModelItem.UID,
          mode: ModelItem.meta.mode,
          attr: {
            ...attr,
            gst: ModelItem.gst,
          },
        },
      });
  }

  // Report if multiple Matches are detected:
  const VALID_MM = ModelMatches.filter(
    (ModelMatch) => ModelMatch.error === false
  );
  if (VALID_MM.length !== 1) {
    const VALID_CHARGES_MM = VALID_MM.filter((ModelMatch) =>
      ModelMatch.data.uid?.endsWith("-CHARGES")
    );
    if (VALID_CHARGES_MM.length === 1) return VALID_CHARGES_MM[0];

    // ? DEBUG
    // let DEBUG_MSG = `* ${TxnText}\n- ${ModelMatches.length} Guides\n`;
    // ModelMatches.forEach((ModelMatch) => {
    //   DEBUG_MSG += `- ${ModelMatch.data.uid}\n`;
    // });
    // console.log(DEBUG_MSG);

    return {
      error: {
        msg: "No Single Model Match",
        debug: { txnText: TxnText, result: ModelMatches },
      },
      data: {
        uid: "UNIDENTIFIED",
        mode: "Unknown",
        attr: {},
        gst: { cgst: 0, sgst: 0, igst: 0 },
      },
    };
  }

  return VALID_MM[0];
}

function CheckForMatch(PATTERN: MatchOperators, TxnText: string, GetTxn: any) {
  let FLAG = true;
  let MATCH = "";

  // Template Variables:
  function template(text: string) {
    const PREV_TXN = GetTxn(-1) || { desc: "" };
    const DESC = PREV_TXN.desc.toLowerCase().trim().replaceAll(/  +/g, " ");
    return text.replaceAll("#PREVIOUS_TXN", DESC);
  }

  // Identify:
  const EqualsStr = PATTERN?.equals;
  if (EqualsStr !== undefined) {
    FLAG = FLAG && TxnText === template(EqualsStr);
    if (FLAG) MATCH = EqualsStr;
  }

  const StartsWithStr = PATTERN?.startsWith;
  if (StartsWithStr !== undefined) {
    FLAG = FLAG && TxnText.startsWith(template(StartsWithStr));
    if (FLAG) MATCH = StartsWithStr;
  }

  const IncludesStr = PATTERN?.includes;
  if (IncludesStr !== undefined) {
    FLAG = FLAG && TxnText.includes(template(IncludesStr).toLowerCase());
    if (FLAG) MATCH = IncludesStr;
  }

  const TestStr = PATTERN?.test;
  if (TestStr !== undefined) {
    FLAG = FLAG && TestStr.test(TxnText);
    if (FLAG) MATCH = (TxnText.match(TestStr) || [])[0] || "";
  }

  return { match: MATCH, result: FLAG };
}
