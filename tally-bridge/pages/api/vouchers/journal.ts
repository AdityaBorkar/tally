// Types:
import type {
  NextApiRequest as NextReq,
  NextApiResponse as NextRes,
} from "next";

// Libraries:

// Handler Function:
export default async function handler(req: NextReq, res: NextRes<ApiResponse>) {
  return res.status(503);
}
