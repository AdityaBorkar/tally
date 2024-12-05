// TODO - Send Details to Sentry with [HIGH PRIORITY]
export default function ReportError(description: string, jsonData?: Object) {
  console.log(description);
  console.log(JSON.stringify(jsonData));
  return `ERROR - ${description}`;
}
