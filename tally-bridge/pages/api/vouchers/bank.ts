// Types:
import type {
  NextApiRequest as NextReq,
  NextApiResponse as NextRes,
} from "next";

// Libraries:
import * as yup from "yup";
import TallyRequestor from "@/logic/TallyRequestor";
import ReportAnalytics from "@/logic/ReportAnalytics";
import { NewBankVoucher } from "@/logic/templates/BankVoucher";

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
        return res.status(503);
      case "POST":
        return CREATE_VOUCHER(req, res, tally);
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

// Create Voucher:
async function CREATE_VOUCHER(
  req: NextReq,
  res: NextRes,
  tally: TallyRequestor
) {
  try {
    // Props Validation:
    const vouchers = JSON.parse(req.body) as VoucherType[];
    if (!VoucherSchema.isValidSync(vouchers))
      return res.status(406).json({ error: "Invalid Vouchers." });

    // Send Request:
    const VoucherStatus = await Promise.all(
      vouchers.map(async (voucher) => {
        // Send Request:
        const command = NewBankVoucher({
          CompanyName: tally.CompanyName,
          voucher,
        });
        const RESPONSE: any = await tally.send(command);
        const status = RESPONSE.ENVELOPE.HEADER.STATUS._text === "1";

        // Success:
        if (status) {
          const voucherNum =
            RESPONSE?.ENVELOPE?.BODY?.DATA?.IMPORTRESULT?.VCHNUMBER?._text ||
            "";
          const created = parseInt(
            RESPONSE?.ENVELOPE?.BODY?.DATA?.IMPORTRESULT?.CREATED?._text || "0"
          );
          if (created === 1) return { status: true, voucherNum };
        }

        // Failure:
        const description =
          RESPONSE?.ENVELOPE?.BODY?.DATA?.LINEERROR._text || "";
        const voucherNum =
          RESPONSE?.ENVELOPE?.BODY?.DATA?.VCHNUMBER._text || "";
        const error = `[VCH ${voucherNum}] ${description}`;

        // Return:
        return { status: false, voucherNum, error };
      })
    );

    // Results:
    const requested = vouchers.length;
    const FailedVouchers = VoucherStatus.filter(
      (status) => status.status === false
    );
    const created = VoucherStatus.length - FailedVouchers.length;
    const lastVchNum = VoucherStatus.pop()?.voucherNum;
    const data = { requested, created, lastVchNum, errors: FailedVouchers };

    // Response:
    res.status(200).send({ success: true, data });

    // Analytics:
    ReportAnalytics("POST#vouchers-bank", {
      subject: "POST /api/vouchers/bank",
      request: { vouchers },
      response: { data },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, error });
  }
}

// Schema:
const VoucherSchema = yup
  .array(
    yup.object({
      type: yup
        .string()
        .matches(/(Receipt|Payment|Contra)/)
        .required(),
      vchNum: yup.string().required(),
      narration: yup.string().optional(),
      toLedger: yup.string().required(),
      fromLedger: yup.string().required(),
      txn: yup.object({
        date: yup.date().required(),
        amount: yup.number().required().positive(),
        transfer: yup
          .string()
          .matches(/(DB|CR)/)
          .required(),
      }),
    })
  )
  .min(1)
  .required();
