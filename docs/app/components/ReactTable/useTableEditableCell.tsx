// Libraries:
import { useEffect, useReducer } from "react";

// Utilites:
export const useTableEditableCell = (props: any) => {
  // Props:
  const {
    getValue,
    table,
    row: { index },
    column: { id },
  } = props;

  // Value Manager:
  const initialValue = getValue();
  const saveValue = (oldState: any, newState: any) => {
    if (oldState !== newState)
      table.options.meta.updateData(index, id, newState);
    return newState;
  };
  const [value, setValue] = useReducer(saveValue, initialValue);

  // Change Value on Source Change:
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Return:
  return { value, setValue };
};
