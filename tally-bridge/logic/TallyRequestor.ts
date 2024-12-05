// Types:
import { NextApiRequest } from "next";

// Libraries:
import convert from "xml-js";

// Main:
export default class TallyRequestor {
  CompanyName = "";
  LocalUrl = new URL("https://vasundhara.cc");

  constructor(ReqProps: NextApiRequest["query"]) {
    // Company Name:
    const CompanyName = (ReqProps["CompanyName"] || "").toString().trim();
    this.CompanyName = CompanyName;

    // Local Url:
    const LocalUrlString = (ReqProps["url"] || "").toString().trim();
    const LocalUrl = new URL(`http://${LocalUrlString}`);
    this.LocalUrl = LocalUrl;
  }

  // Validate Config:
  validate = () =>
    !(this.CompanyName === "" || this.LocalUrl.host === "www.vasundhara.cc");

  // Send Request:
  send(data: NonNullable<any>) {
    // Config:
    const FETCH_CONFIG = {
      headers: {
        Accept: "text/xml",
        "Content-Type": "text/xml;charset=UTF-8",
      },
      method: "POST",
      body: convert.js2xml(data, { compact: true, spaces: 4 }),
    };
    // Request:
    return new Promise((resolve, reject) => {
      fetch(this.LocalUrl, FETCH_CONFIG)
        .then(async (response) => {
          const text = await response.text();
          const json = convert.xml2js(text, { compact: true });
          resolve(json);
        })
        .catch((error) => {
          console.log("Fetch Error = ", error);
          reject(error);
        });
    });
  }

  // Build below if required:
  get() {}
  post() {}
}
