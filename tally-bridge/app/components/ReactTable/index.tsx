// Types:
import type { ReactNode } from "react";
type ReactTableProps = {
  data: any; // replace string with RecoilKey
  className: string;
  border?: boolean;
  tableStyle?: {
    thead: {
      _: string;
      tr: string;
      td: string;
    };
    tbody: {
      _: string;
      tr: string;
      td: string;
    };
  };
  children: JSX.Element[];
};

// Libraries:
import { Children as ReactChildren, isValidElement } from "react";
import NativeReactTable from "./table";

// Functions:
export function ReactTable(props: ReactTableProps) {
  // Config:
  const AllColumnsConfig: any = [];

  // Traverse Columns:
  ReactChildren.forEach(props.children, (ColumnComp) => {
    if (!isValidElement(ColumnComp)) return;
    // @ts-ignore
    if (ColumnComp.type.name !== "Column") return;
    // Column Props:
    const ColumnProps: any = ColumnComp.props;
    let HeaderComp;
    let CellComp;
    // Column Contents:
    ReactChildren.forEach(ColumnProps.children, (ColumnChild) => {
      if (!isValidElement(ColumnChild)) return;
      // @ts-ignore
      if (ColumnChild.type.name === "Head")
        // @ts-ignore
        HeaderComp = ColumnChild.props.children;
      // @ts-ignore
      else if (ColumnChild.type.name === "Cell") {
        // @ts-ignore
        if (ColumnChild.props.component !== undefined)
          // @ts-ignore
          CellComp = ColumnChild.props.component;
        // @ts-ignore
        else CellComp = ColumnChild.props.children;
      }
    });

    // Column Config:
    const ColumnConfig = {
      accessorKey: ColumnProps.Key,
      size: ColumnProps.size,
      header: HeaderComp,
      cell: CellComp,
    };
    AllColumnsConfig.push(ColumnConfig);
  });

  // Table Style:
  const TableStyle = {
    table: props.className,
    thead: {
      _: "",
      tr: "border-slate-300 border bg-slate-700 text-white",
      td: "border-slate-300 border py-1",
    },
    tbody: {
      _: "",
      tr: "border-slate-300 border",
      td: "border-slate-300 border",
    },
  };

  // Render Tree
  return (
    <NativeReactTable
      data={props.data}
      styles={TableStyle}
      columnConfig={() => AllColumnsConfig}
    />
  );
}

// Column:
type ColumnType = {
  Key: string;
  size?: number;
  children: ReactNode | ReactNode[];
};
export function Column(props: ColumnType) {
  return <div></div>;
}

// Head:
type HeadType = { children: ReactNode | ReactNode[] };
export function Head(props: HeadType) {
  return <div></div>;
}

// Cell:
type CellType = {
  children?: ReactNode | ReactNode[] | ((props: any) => JSX.Element);
  component?: (props: any) => ReactNode;
};
export function Cell(props: CellType) {
  return <div></div>;
}
