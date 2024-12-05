// Type:
type SelectInputPropsType = {
  value: any;
  updateValue: (value: any) => any;
  list: { name: string; id: string }[];
  className?: string;
  classNameInput?: string;
};

// Libraries:
import { useEffect, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";
import Button from "./Button";
import { useTallyContext } from "../(pages)/tool/TallyManager";
import { useToast } from "@chakra-ui/react";

// Tags:
export default function ComboboxInput(props: SelectInputPropsType) {
  // Ledger Creation Utils:
  const { tally } = useTallyContext();
  const StatusToast = useToast();

  // Manage Values:
  const LIST = props.list;
  const [SelectedItem, SetSelectedItem] = useState(props.value);

  // Manage Search
  const [SearchQuery, SetSearchQuery] = useState("");
  const FilteredItems =
    SearchQuery === ""
      ? LIST
      : LIST.filter((item) =>
          item.name.toLowerCase().includes(SearchQuery.toLowerCase())
        );

  // Open Combobox Options on clicking input:
  const ComboBoxButtonRef = useRef<HTMLButtonElement>(null);
  const openComboboxOptions = () => {
    if (ComboBoxButtonRef.current !== null) ComboBoxButtonRef.current.click();
  };

  // Update values to main:
  useEffect(() => {
    props.updateValue(SelectedItem);
  }, [SelectedItem]);

  // Create Ledger:
  async function CreateLedger() {
    return new Promise((resolve) => {
      tally
        .CreateLedger({ name: SearchQuery })
        .then((response) => {
          if (response.success) {
            StatusToast({
              title: "Ledger created successfully",
              status: "success",
              duration: 1000,
              isClosable: true,
            });
          } else {
            StatusToast({
              title: "Failed to create ledger",
              status: "error",
              duration: 120000,
              isClosable: true,
            });
          }
        })
        .catch((error) => {
          StatusToast({
            status: "error",
            duration: 120000,
            isClosable: true,
            title: `Failed to create ledger`,
            description: `${
              error?.message.toString() || error.error || "Unknown Error"
            }`,
          });
        })
        .finally(async () => {
          await tally.PullLedgers();
          resolve(true);
          // TODO - Find an alternative whether why sync was not provided
          // Workaround = CREATE -> SYNC -> CHECK STATUS -> SHOW TOAST
        });
    });
  }

  // Render:
  return (
    <Combobox value={SelectedItem} onChange={SetSelectedItem}>
      <div className={`relative ${props.className}`}>
        {/* <div className="relative z-10 w-full cursor-default overflow-hidden rounded-lg bg-white text-left"> */}
        <Combobox.Input
          className={`relative w-full py-1 px-2 text-sm text-gray-900 ${props.classNameInput} focus:bg-gray-200/80 focus:outline-none`}
          // @ts-ignore
          displayValue={(item) => item.name}
          onClick={openComboboxOptions}
          onChange={(e) => SetSearchQuery(e.target.value)}
        />
        <Combobox.Button className="hidden" ref={ComboBoxButtonRef} />
        {/* <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <img src="/res/chevron-down-arrow.svg" className="h-[40%]" />
          </Combobox.Button>
        </div> */}
        {/* <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => SetSearchQuery("")}
        > */}
        <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto text-left rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {FilteredItems.length === 0 && SearchQuery !== "" ? (
            <div className="relative cursor-default select-none py-2 px-4 text-center text-gray-700">
              No such ledger found.
              <Button
                className="block my-3 mx-auto"
                content={{
                  loading: "Creating",
                  stale: `Create "${SearchQuery}"`,
                }}
                onClick={CreateLedger}
                colorScheme="purple"
              />
            </div>
          ) : (
            FilteredItems.map((ledger, index) => (
              <Combobox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 px-4 ${
                    active ? "bg-purple-700 text-white" : "text-gray-900"
                  }`
                }
                value={ledger}
              >
                {({ selected, active }) => (
                  <span
                    className={`block truncate ${
                      selected ? "font-medium" : "font-normal"
                    }`}
                  >
                    {ledger.name}
                  </span>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
        {/* </Transition> */}
      </div>
    </Combobox>
  );
}
