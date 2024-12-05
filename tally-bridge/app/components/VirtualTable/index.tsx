// Types:
type VirtualTablePropsType = {
  row: any;
  items: any[];
  config: {
    columns: {
      name: string;
      width: string;
    }[];
    style: {
      header: string;
      body: string;
    };
  };
};

// Libraries:

// Table:
export default function VirtualTable(props: VirtualTablePropsType) {
  // Table Config:
  const TableConfig = {
    ...props.config,
    width: props.config.columns.map((cell) => cell.width).join(" "),
  };

  // // Data:
  // const itemCount = props.items.length;

  // // Row:
  // function Row({ index, style }) {
  //   return <div style={style}>Row {index}</div>;
  // }

  // Render:
  return (
    <>
      <div
        className={`grid ${TableConfig.style.header}`}
        style={{ gridTemplateColumns: TableConfig.width }}
      >
        {TableConfig.columns.map((column) => (
          <div key={column.name}>{column.name}</div>
        ))}
      </div>

      <div
        className={`max-h-[90vh] grid overflow-auto border border-t-0 border-gray-300 ${props.config.style.body}`}
        style={{ gridTemplateColumns: TableConfig.width }}
      >
        {props.items.map((item, index) => (
          <props.row item={item} index={index} key={index} />
        ))}
      </div>
    </>
  );
  // <List
  //   height={windowHeight}
  //   itemCount={itemCount}
  //   itemSize={35}
  //   width={"100%"}
  // >
  //   {Row}
  // </List>
}
