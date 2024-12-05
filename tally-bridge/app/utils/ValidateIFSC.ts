import data from "utils/IFSC.json";

export default function isIFSC(str: string | undefined) {
  let lookupString = (list: any, code: string) => list.indexOf(code) !== -1;
  let isInteger = (str: string) => str.match(/^(\d)+$/);
  let lookupNumeric = (list: any, code: string) =>
    list.indexOf(parseInt(code, 10)) > -1;

  if (str === undefined) return false;
  if (str.length !== 11) return false;
  if (str[4] !== "0") return false;

  let bankCode = str.slice(0, 4).toUpperCase();
  let branchCode = str.slice(5).toUpperCase();

  if (!data.hasOwnProperty(bankCode)) return false;
  let list = data[bankCode as keyof typeof data];
  if (isInteger(branchCode)) return lookupNumeric(list, branchCode);
  return lookupString(list, branchCode);
}
