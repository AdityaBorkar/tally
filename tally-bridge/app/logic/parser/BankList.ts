// Banks:
import SBI_MODEL from "./banks/sbi";
import SARASWAT_MODEL from "./banks/saraswat";
import BANK_OF_BARODA_MODEL from "./banks/bob";
import ABHYUDAYA_MODEL from "./banks/abhyudaya";

// Banks:
const BANK_MODEL_BINDINGS: { [key: string]: ModelType } = {
  "Bank of Baroda": BANK_OF_BARODA_MODEL,
  "State Bank of India (India)": SBI_MODEL,
  "Saraswat Co-Op. Bank Ltd.": SARASWAT_MODEL,
  "Abhyudaya Co-Op. Bank Ltd. (India)": ABHYUDAYA_MODEL,
};

// Utilities:
export const SupportedBanks = Object.keys(BANK_MODEL_BINDINGS);
export const AssignModel = (BankName: string) => BANK_MODEL_BINDINGS[BankName];
