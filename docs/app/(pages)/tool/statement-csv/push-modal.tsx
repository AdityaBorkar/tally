// Libraries:
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Input,
  Checkbox,
  CheckboxGroup,
} from "@chakra-ui/react";
import { HiArrowUpOnSquareStack } from "react-icons/hi2";
import { useRef, useState } from "react";

// Components:
import { useTallyContext } from "../TallyManager";
import Button from "components/Button";

// Modal:
export default function PushModal(props: {}) {
  // Tally:
  const { tally, statement } = useTallyContext();

  // Data:
  const AllBanks = tally.banks;
  const ENTRY_COUNT = statement.status();
  const StartNumInputRef = useRef<HTMLInputElement>(null);
  const [SelectedBanks, SetSelectedBank] = useState([]);

  // Utilities:
  const PushModal = useDisclosure();
  const StatusToast = useToast();
  const PushDataToTally = () =>
    new Promise<void>(async (resolve) => {
      if (StartNumInputRef.current === null) return resolve();
      const StartNum = parseInt(StartNumInputRef.current.value);
      if (StartNum < 0)
        return StatusToast({
          title: `Voucher Number must be greater than zero`,
          status: "error",
          duration: 120000,
          isClosable: true,
        });

      const TallyMessage = statement.exportVouchers({
        StartNum,
        SkipContra: SelectedBanks,
      });
      const response = await tally.PushVouchers(TallyMessage);

      // Status Toast:
      if (response.success) {
        const CREATED = response.data.created;
        const REQUESTED = response.data.requested;
        const LAST_VCH_NUM = response.data.lastVchNum;
        const SUCCESS = response.data.errors.length === 0;
        // TODO - Print Errors
        StatusToast({
          status: SUCCESS ? "success" : "warning",
          duration: 120000,
          isClosable: true,
          title: SUCCESS
            ? "Vouchers created successfully"
            : "Some vouchers failed to be created",
          description: `Created ${CREATED} out of ${REQUESTED}. Last Voucher Number = ${LAST_VCH_NUM}`,
        });
      } else {
        StatusToast({
          status: "error",
          duration: 120000,
          isClosable: true,
          title: `Failed to create vouchers`,
          description: `${response.error}`,
        });
      }
      resolve();
    });

  // Render:
  return (
    <>
      {/* Overlay to open Modal */}
      <div
        className={`px-6 py-3 bg-red-100 hover:bg-red-200 text-red-900 font-medium cursor-pointer rounded-lg transition-all`}
        onClick={PushModal.onOpen}
      >
        <HiArrowUpOnSquareStack className="inline mr-2 align-[-2px]" />
        Send to Tally
      </div>

      {/* Modal */}
      <Modal isOpen={PushModal.isOpen} onClose={PushModal.onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Send Data to Tally</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <div className="py-3 text-center">
              <div className="mx-auto py-3 w-[60%] text-sm bg-orange-100 text-orange-900 font-medium rounded-lg">
                You have entered ledgers for {ENTRY_COUNT.filled} out of{" "}
                {ENTRY_COUNT.total} entries.
                <br />
                Blank entries shall not be pushed to Tally.
              </div>
            </div>

            <div className="mx-auto py-6 w-[90%] grid grid-cols-1">
              <div className="py-2 font-medium">Start Voucher Number:</div>
              <Input
                ref={StartNumInputRef}
                mx="auto"
                type="number"
                // display="block"
                placeholder="Enter a number"
                border={"2px solid DarkGray"}
              />

              <div className="mt-8">
                <div className="my-2 font-medium">
                  Select Ledgers to skip Contra-Entry:
                </div>

                <CheckboxGroup
                  defaultValue={SelectedBanks}
                  // @ts-ignore
                  onChange={SetSelectedBank}
                >
                  {AllBanks.map((ledger) => (
                    <div className="mt-1" key={ledger.name}>
                      <Checkbox value={ledger.name}>
                        {ledger.name} - {ledger.bankName}
                      </Checkbox>
                    </div>
                  ))}
                </CheckboxGroup>
              </div>
            </div>

            <Button
              className="mx-auto mt-8 my-4 block"
              onClick={PushDataToTally}
              colorScheme="red"
              content={{ loading: "Sending", stale: "Send Statement" }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
