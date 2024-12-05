// Libraries:
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { HiPencilSquare } from "react-icons/hi2";

// Components:
import { useTallyContext } from "../TallyManager";
import SelectInput from "components/SelectInput";
import Button from "components/Button";

// Modal:
export default function StatementConfig(props: { className: string }) {
  // Tally:
  const { tally, statement, NewStatement } = useTallyContext();

  // Data:
  const BANK_LIST = tally.banks;
  const [CURRENT_BANK, SET_CURRENT_BANK] = useState(statement.BankName);

  // Utilities:
  const ConfigModal = useDisclosure();
  const BankListSelectProps = BANK_LIST.map((bank: any) => ({
    name: bank.acName,
    desc: bank.bankName,
    ledgerName: bank.name,
  }));
  const DownloadSpecimen = () => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = "./specimen.csv";
    a.download = "specimen.csv";
    document.body.appendChild(a);
    a.click();
  };
  const UploadFile = () =>
    new Promise<void>((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";

      input.onchange = (e: any) => {
        // Take the first file:
        const FILE = e.target.files[0];

        // Validate File Name
        if (!FILE.name.endsWith(".csv")) {
          console.log("Upload a CSV File");
          return reject();
        }

        // Read File:
        const reader = new FileReader();
        reader.readAsText(FILE);
        reader.onload = async () => {
          const DATA_STRING = reader.result?.toString() || "";
          const op = NewStatement({
            StatementString: DATA_STRING,
            bank: CURRENT_BANK,
          });
          // if (op.status) {
          ConfigModal.onClose();
          //   return resolve();
          // }
          // console.log(op.error);
          // reject();
        };
        reader.onerror = () => {
          // TODO - ERROR MODAL
          console.log("FILE READ ERROR = ", reader.error);
          reject();
        };
      };
      document.body.appendChild(input);
      input.style.display = "none";
      input.click();
    });

  // Render:
  return (
    <>
      {/* Overlay to open Modal */}
      <div
        className={`px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-900 font-medium cursor-pointer rounded-lg transition-all ${props.className}`}
        onClick={ConfigModal.onOpen}
      >
        <HiPencilSquare className="inline mr-2 align-[-2px]" />
        Edit Statement
      </div>

      {/* Modal */}
      <Modal
        isOpen={ConfigModal.isOpen}
        onClose={ConfigModal.onClose}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Statement Config</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <SelectInput
              className="my-2 mx-auto w-[80%]"
              list={BankListSelectProps}
              state={{ val: CURRENT_BANK, setVal: SET_CURRENT_BANK }}
            />

            <div className="mx-auto my-8 w-[80%] flex flex-row justify-evenly">
              <Button onClick={DownloadSpecimen}>Download Specimen</Button>
              <Button
                disabled={BANK_LIST.length === 0}
                colorScheme="green"
                onClick={UploadFile}
                content={{
                  loading: "Processing...",
                  stale: "Upload Statement (.CSV)",
                }}
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
