// Libraries:
import { useToast } from "@chakra-ui/react";
import { HiBuildingStorefront, HiLink } from "react-icons/hi2";
import Button from "components/Button";
import { useTallyContext } from "./TallyManager";

// Component:
export default function TallySyncComponent() {
  // Data:
  const { tally, NewTallyConfig } = useTallyContext();
  const SERVER_LINK = tally.config.url;
  const COMPANY_NAME = tally.config.CompanyName;
  const MOBILE_CONNECTION = { sync: false, updated: false };

  // Utils:
  const StatusToast = useToast();
  const SyncTallyLedgers = () =>
    new Promise<void>(async (resolve) => {
      // const response = await tally.PullLedgers().catch(ErrorManagement);
      tally
        .PullLedgers()
        .then((response) => {
          StatusToast({
            title: response.success
              ? "Successfully synced ledgers"
              : "Error syncing ledgers",
            status: response.success ? "success" : "error",
            duration: 120000,
            isClosable: true,
          });
          resolve();
        })
        .catch((data) => {
          console.log("error = ", data);
          const description = data?.error || data.message || "Unknown Error";
          StatusToast({
            status: "error",
            duration: 120000,
            isClosable: true,
            title: "Error syncing ledgers",
            description,
          });
          resolve();
        });
    });

  // TODO - Once Authentication is done, give access: and add choice:
  function LoadCompany() {
    const CONFIG = {
      CompanyName: "DemO", // "Vasundhara Transport Service ( FY 21-22 )",
      url: "172.27.16.1:9000",
    };
    NewTallyConfig({ ...CONFIG });
  }

  // Render:
  return (
    <div className="absolute bottom-8 w-full px-6">
      <div className="px-3 py-4 grid grid-cols-1 gap-y-2 bg-slate-50 border rounded-lg">
        <div></div>

        <div className="px-3 grid grid-cols-[30px_auto] gap-y-1.5 font-medium text-gray-600">
          <HiBuildingStorefront className="mt-1" />
          <div
            title={COMPANY_NAME}
            className="inline text-inherit w-full truncate"
            style={{ WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}
          >
            {COMPANY_NAME}
          </div>
          <HiLink className="mt-1" />
          <span className="text-inherit" title={SERVER_LINK}>
            {SERVER_LINK}
          </span>
        </div>

        <div className="mt-2 flex flex-row justify-evenly">
          <Button onClick={LoadCompany}>Load</Button>
          <Button
            onClick={SyncTallyLedgers}
            content={{ loading: "Syncing", stale: "Sync Ledgers" }}
          />
        </div>
      </div>

      <div className="mt-3 px-6 py-3 cursor-pointer bg-slate-100 border rounded-lg">
        <span
          className={`inline-block w-3 h-3 ${
            MOBILE_CONNECTION.sync
              ? MOBILE_CONNECTION.updated
                ? "bg-green-700"
                : "bg-orange-600"
              : "bg-red-700"
          } rounded-full`}
        ></span>
        <span className="ml-2.5 align-[1px] text-sm font-semibold text-slate-800">
          {MOBILE_CONNECTION.sync
            ? MOBILE_CONNECTION.updated
              ? "Mobile connected and up-to-date"
              : "Mobile Connection lagging"
            : "Mobile not connected"}
        </span>
        {/* <span>Placeholder: Download Mobile App</span> */}
      </div>
    </div>
  );
}
