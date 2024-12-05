// Get Reports:
type ReportDetailsType = { ReportName: string; CompanyName: string };
export const GetReportsEnvelope = (props: ReportDetailsType) => ({
  ENVELOPE: {
    HEADER: {
      TALLYREQUEST: { _text: "Export Data" },
    },
    BODY: {
      EXPORTDATA: {
        REQUESTDESC: {
          REPORTNAME: { _text: props.ReportName },
          STATICVARIABLES: {
            SVCURRENTCOMPANY: { _text: props.CompanyName },
            SVEXPORTFORMAT: { _text: "$$SysName:XML" },
          },
        },
      },
    },
  },
});
