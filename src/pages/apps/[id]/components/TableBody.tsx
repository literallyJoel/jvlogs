import { type Table, flexRender } from "@tanstack/react-table";
import type { Log } from "./LogTable";
import { memo } from "react";

export function TableBody({
  table,
  openModal,
}: {
  table: Table<Log>;
  openModal: (log: Log) => void;
}) {
  return (
    <div
      {...{
        className: "w-full",
      }}
    >
      {table.getRowModel().rows.map((row) => (
        <div
          key={row.id}
          {...{
            className: "flex w-full",
          }}
        >
          {row.getVisibleCells().map((cell) => {
            return (
              <div
                key={cell.id}
                {...{
                  className: `border border-white p-1 w-full ${cell.column.id === "message" ? "text-left hover:bg-white/30 cursor-pointer" : "text-center"}`,
                  style: {
                    width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                  },
                  onClick: () => openModal(cell.getContext().row.original),
                }}
              >
                {" "}
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

//special memoized wrapper for our table body that we will use during column resizing
export const MemoizedTableBody = memo(
  TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof TableBody;
