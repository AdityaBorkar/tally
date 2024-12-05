// Type:
type PropsType = {
  className: string;
  list: { name: string; desc: string; ledgerName: string }[];
  state: { val: any; setVal: (props: any) => void };
};

// Libraries:
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

// Main Function:
export default function SelectInput(props: PropsType) {
  // List:
  const LIST = props.list;
  const BANK_NAME = props.state.val;
  const DefaultValue =
    LIST.length === 0
      ? {
          name: BANK_NAME?.acName || "No Data",
          ledgerName: BANK_NAME?.ledgerName || "",
          desc: BANK_NAME?.bankName || "Kindly pull data from Tally.",
        }
      : LIST[0];
  const [SelectedItem, SetSelectedItem] = useState(DefaultValue);

  useEffect(() => {
    const BankDetails = {
      acName: SelectedItem.name,
      bankName: SelectedItem.desc,
      ledgerName: SelectedItem.ledgerName,
    };
    props.state.setVal(BankDetails.bankName);
  }, [SelectedItem]);

  // Render:
  return (
    <div className={props.className}>
      <Listbox value={SelectedItem} onChange={SetSelectedItem}>
        <div className="relative z-10">
          <Listbox.Button className="relative z-10 w-full cursor-default rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <div>
              <span className="truncate">{SelectedItem.name}</span>
              <span className="block truncate text-xs text-gray-700">
                {SelectedItem.desc}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <img src="/res/chevron-down-arrow.svg" className="h-5 px-2" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg">
              {LIST.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative z-20 cursor-default select-none py-2 px-4 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <div className={selected ? "font-medium" : "font-normal"}>
                      <span className="truncate">{item.name}</span>
                      <span className="block truncate text-xs text-gray-700">
                        {item.desc}
                      </span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
