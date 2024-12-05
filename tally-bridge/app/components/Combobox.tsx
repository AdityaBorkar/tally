// Type:
type SelectInputPropsType = {
  value: any;
  setValue: any;
  list: string[];
  className?: string;
  classNameInput?: string;
};

// Libraries:
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";

// Tags:
export default function ComboboxInput(props: SelectInputPropsType) {
  // Manage Values:
  const LIST = props.list;
  const [SelectedItem, SetSelectedItem] = useState(props.value);

  // Manage Search
  const [SearchQuery, SetSearchQuery] = useState("");
  const FilteredItems =
    SearchQuery === ""
      ? LIST
      : LIST.filter((item) =>
          item.toLowerCase().includes(SearchQuery.toLowerCase())
        );

  // Render:
  return (
    <Combobox value={SelectedItem} onChange={SetSelectedItem}>
      <div className={`relative ${props.className}`}>
        <div className="relative z-10 w-full cursor-default overflow-hidden rounded-lg bg-white text-left">
          <Combobox.Input
            className={`relative w-full py-1 pl-3 pr-10 text-sm text-gray-900 ${props.classNameInput} ring-offset-2 focus:ring-2`}
            // @ts-ignore
            displayValue={(item) => item}
            onChange={(e) => SetSearchQuery(e.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <img src="/res/chevron-down-arrow.svg" className="h-[40%]" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => SetSearchQuery("")}
        >
          <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto text-left rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {FilteredItems.length === 0 && SearchQuery !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              FilteredItems.map((person, index) => (
                <Combobox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-yellow-500"
                          }`}
                        >
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
