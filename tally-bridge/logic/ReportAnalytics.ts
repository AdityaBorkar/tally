// Libraries:
import { writeFileSync } from "fs";

// Main:
export default function ReportAnalytics(subject: string, data: any) {
  console.log("Analytics Reported!");
  const TIMESTAMP = (data.timestamp || new Date()).valueOf();
  writeFileSync(
    `./data/${subject}-${TIMESTAMP}.json`,
    JSON.stringify(data, null, 2)
  );
}
