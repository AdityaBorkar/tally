// Types:
import type { RowData } from "@tanstack/react-table";
type ReactTablePropsType = {
  data: any;
  columnConfig: () => ColumnDef<unknown>[];
  styles: {
    table: string;
    thead: { _: string; tr: string; td: string };
    tbody: { _: string; tr: string; td: string };
  };
};

// Libraries:
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useVirtual } from "react-virtual";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

// Extend Types:
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Main Function:
export default function NativeReactTable(props: ReactTablePropsType) {
  // Manage Data:
  const [data, setData] = useState(() => props.data);
  // const [sorting, setSorting] = useState<SortingState>([]);
  const RefreshData = () => setData(() => props.data);
  const ForceReRender = useReducer(() => ({}), {})[1];
  useEffect(() => {
    RefreshData();
  }, [props.data]);

  // Manage Columns:
  const columns = useMemo<ColumnDef<unknown>[]>(props.columnConfig, []);

  // Manage Table:
  const TableWrapperRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old: any) =>
          old.map((row: any, index: number) =>
            index === rowIndex
              ? {
                  ...old[rowIndex]!,
                  [columnId]: value,
                }
              : row
          )
        );
      },
    },
    //! Sorting Disabled:
    // state: { sorting },
    // onSortingChange: setSorting,
    // getSortedRowModel: getSortedRowModel(),
  });

  // Manage Rows:
  const { rows } = table.getRowModel();

  // Render Table:
  return (
    <div ref={TableWrapperRef} className={props.styles.table}>
      <table className="relative mx-auto">
        <THead />
        <TBody />
      </table>
    </div>
  );
  // return {
  //   RefreshData,
  //   ForceReRender,
  // };

  function THead() {
    return (
      <thead className={props.styles.thead._}>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className={props.styles.thead.tr}>
            {headerGroup.headers.map((header) => {
              // ! Functionalities:
              // const SortAvailable = header.column.getCanSort();
              // const SortColumnData = header.column.getToggleSortingHandler;
              return (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ width: header.getSize() }}
                  className={props.styles.thead.td}
                >
                  {header.isPlaceholder
                    ? null
                    : // <div
                      //   className={
                      //     SortAvailable ? "cursor-pointer select-none" : ""
                      //   }
                      //   onClick={SortColumnData}
                      // >
                      //   {flexRender(
                      //     header.column.columnDef.header,
                      //     header.getContext()
                      //   )}
                      //   {header.column.getIsSorted()}
                      // </div>
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
    );
  }

  function TBody() {
    // Virtualization:
    const rowVirtualizer = useVirtual({
      parentRef: TableWrapperRef,
      size: rows.length,
      overscan: 10,
    });
    const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

    // Styling:
    const paddingTop =
      virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    const paddingBottom =
      virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0;

    // Render:
    return (
      <tbody className={props.styles.tbody._}>
        {paddingTop > 0 && (
          <tr>
            <td style={{ height: `${paddingTop}px` }} />
          </tr>
        )}

        {virtualRows.map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <tr key={row.id} className={props.styles.tbody.tr}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={props.styles.tbody.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          );
        })}

        {paddingBottom > 0 && (
          <tr>
            <td style={{ height: `${paddingBottom}px` }} />
          </tr>
        )}
      </tbody>
    );
  }
}
