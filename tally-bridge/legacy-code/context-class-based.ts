// Class:
class TallyManagerBeta {
  // Data:
  tully: TallyData = {
    CompanyName: "",
    url: "",
    ledgers: [],
    banks: [],
    statement: {
      data: [],
      coverage: {},
      analytics: {},
      bank: { acName: "No Data", bankName: "Kindly Sync Data with Tally" },
    },
  };

  // Config:
  constructor(CompanyConfig: CompanyConfig) {
    this.tully.CompanyName = CompanyConfig.CompanyName;
    this.tully.url = CompanyConfig.url;
  }

  // Pull Data From Tally:
  PullData = () =>
    new Promise<ApiResponse>(async (resolve, reject) => {
      try {
        const tally = this.tully;
        const URL = `/api/pull?CompanyName=${tally.CompanyName}&url=${tally.url}`; // URL is automatically encoded by Next.js
        const request = await fetch(URL);
        const data = await request.json();
        const { ledgers, banks, CompanyName } = data;

        // If Company Name is different, don't update data:
        if (tally.CompanyName !== CompanyName)
          return reject({ success: true, data: "Company Name Mismatch" });

        this.tully = { ...this.tully, ledgers, banks, CompanyName };
        console.log("this.tully = ", this.tully);
        resolve({ success: true, data: null });
      } catch (err) {
        console.log("Error in Pulling Tally Data:", err);
        reject({ success: false, data: err });
      }
    });

  // Push Data From Tally:
  PushData = () => {
    return new Promise<ApiResponse>(async (resolve, reject) => {
      try {
        const request = await fetch("/api/push");
        const data = await request.json();
        console.log("Pushed Data = ", data);
        resolve(data);
      } catch (err) {
        console.log("Error in Pushing Tally Data:", err);
        reject({ success: false, data: err });
      }
    });
  };

  // Process Statement:
  ProcessStatement = (props: ProcessStatementProps) => {
    const data = ParseStatement({
      data: props.data,
      bank: props.bank.bankName || "",
    });

    // Update Tally:
    this.tully["statement"] = {
      bank: props.bank,
      data: data.STATEMENT,
      coverage: data.COVERAGE,
      analytics: data.ANALYTICS,
    };

    // Reset Statement:
    this.#statement = { data: data.STATEMENT, memory: [] };
    return true;
  };

  // Statement Manager:
  #statement: any = { data: [], memory: [] };
  StatementManager = () => {
    // Save:
    const data = () => this.#statement;
    const save = (index: number, ledger: {}) => {
      this.#statement.data[index].ledger = {};
      // Train Data:
    };
    function del() {}
    // Return:
    return { data, save, del };
  };
}
