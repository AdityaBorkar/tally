// Types:
import type {
  NextApiRequest as NextReq,
  NextApiResponse as NextRes,
} from "next";

// Libraries:
import TallyRequestor from "@/logic/TallyRequestor";
import { GetReportsEnvelope } from "@/logic/templates/Report";
import ReportAnalytics from "@/logic/ReportAnalytics";
import { CreateLedger } from "@/logic/templates/CreateLedger";

// Handler Function:
export default async function handler(req: NextReq, res: NextRes<ApiResponse>) {
  try {
    // Validate Props:
    const tally = new TallyRequestor(req.query);
    if (!tally.validate())
      return res
        .status(406)
        .json({ success: false, error: "Company Name or URL is invalid." });

    // Request Type:
    const RequestMethod = req.method || "";
    switch (RequestMethod) {
      case "GET":
        return await RETRIEVE_LEDGERS(res, tally);
      case "POST":
        return await CREATE_LEDGERS(req, res, tally);
      case "PATCH":
        return res.status(503);
      case "DELETE":
        return res.status(503);
      default:
        return res.status(501);
    }
  } catch (err) {
    // Return:
    console.error(err);
    const error = err?.toString() || "Unknown Error";
    res.status(500).json({ success: false, error });
  }
}

// GET - Ledgers
async function RETRIEVE_LEDGERS(res: NextRes, tally: TallyRequestor) {
  // Send Request
  const command = GetReportsEnvelope({
    CompanyName: tally.CompanyName,
    ReportName: "List of Accounts",
  });
  const RESPONSE: any = await tally.send(command);

  // Init Data:
  const BANKS: BANK_TYPE[] = [];
  const LEDGERS: LEDGER_TYPE[] = [];
  const ALL_GROUPS: GROUP_TYPE[] = [];

  // Parse Masters:
  const MASTERS = RESPONSE.ENVELOPE.BODY.IMPORTDATA.REQUESTDATA.TALLYMESSAGE;
  MASTERS.forEach((master: any) => {
    // Master:
    const type = Object.keys(master)[1] as MasterType;
    const MasterDetails = master[type];

    // Common Props:
    const alterId = MasterDetails?.ALTERID?._text;
    const guid = MasterDetails?.GUID?._text || "";
    const parent = MasterDetails?.PARENT?._text || "";
    const name = MasterDetails?._attributes?.NAME || "";
    const updatedDateTime = MasterDetails?.UPDATEDDATETIME?._text;
    const MasterData = { name, type, guid, parent, alterId, updatedDateTime };

    // Categorization
    switch (type) {
      case "GROUP":
        ALL_GROUPS.push(MasterData);
        return;
      case "LEDGER":
        if (["Bank Accounts", "Bank OD A/c"].includes(parent)) {
          const AcName = MasterDetails.BANKACCHOLDERNAME._text;
          BANKS.push({
            ...MasterData,
            acName: AcName,
            refName: `${name} (${AcName})`,
            ifsc: MasterDetails.IFSCODE._text,
            branch: MasterDetails.BRANCHNAME._text,
            bankName: MasterDetails.BANKINGCONFIGBANK._text,
          });
        }
        LEDGERS.push(MasterData);
        return;
      case "CURRENCY":
        return;
      case "COMPANY":
        return;
      default:
      // TODO - Report: Unknown Case...
    }
  });

  // Categorization:
  const MAIN_GROUPS = ALL_GROUPS.filter((master) => master.parent === "");
  const SUB_GROUPS = ALL_GROUPS.filter((master) => master.parent !== "");

  // Return:
  return res.status(200).json({
    banks: BANKS,
    ledgers: LEDGERS,
    groups: { all: ALL_GROUPS, main: MAIN_GROUPS, sub: SUB_GROUPS },
  });

  // ? Company Name Match is avoided since it's included in the request.
}

// POST - Ledgers
async function CREATE_LEDGERS(
  req: NextReq,
  res: NextRes,
  tally: TallyRequestor
) {
  try {
    // Props Validation:
    const ReqParams = JSON.parse(req.body);
    const LedgerName = (ReqParams?.LedgerDetails.name || "").trim();
    if (LedgerName === undefined || LedgerName === "")
      return res.status(406).json({ error: "Ledger Name is empty" });

    // Send Request:
    const command = CreateLedger({
      CompanyName: tally.CompanyName,
      LedgerDetails: { name: LedgerName },
    });
    const RESPONSE: any = await tally.send(command);

    // Results:
    const status = RESPONSE.ENVELOPE.HEADER.STATUS._text === "1";
    const data = null;

    // Response:
    if (status) res.status(200).send({ success: true, data });
    else {
      const error =
        RESPONSE?.ENVELOPE?.BODY?.DATA?.LINEERROR._text || "Unknown Error";
      res.status(200).send({ success: false, error });
    }

    // Analytics:
    ReportAnalytics("POST#ledgers", {
      subject: "POST /api/ledgers",
      request: { LedgerName },
      response: { RESPONSE },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error });
  }
}
