// Types:
import type { NextApiRequest, NextApiResponse } from "next";

// Libraries:
import ReportAnalytics from "@/logic/ReportAnalytics";

// Handler Function:
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    // Props:
    const data = JSON.parse(req.body);
    ReportAnalytics("/analytics", data);

    // Return:
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    // Return:
    res.status(500);
  }
}
