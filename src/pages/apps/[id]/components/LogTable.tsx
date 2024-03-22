import {
  type FilterFn,
  type FilterMeta,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useMemo, useState } from "react";
import { MemoizedTableBody, TableBody } from "./TableBody";
import { Dropdown } from "./Dropdown";
import { Select } from "./Select";
import { IoClose } from "react-icons/io5";
import { Pagination } from "./Pagination";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
export type Log = {
  id: number;
  date: Date;
  type: string;
  route: string;
  message: string;
};

interface props {
  logs: Log[];
}

const LogTable = ({ logs }: props): JSX.Element => {
  const deleteLog = api.logs.deleteLog.useMutation();
  const [typeFilter, setTypeFilter] = useState<
    "error" | "warning" | "debug" | "info" | ""
  >("");
  const [routeFilter, setRouteFilter] = useState(" ");
  const [dateFilter, setDateFilter] = useState(" ");
  const columnHelper = createColumnHelper<Log>();

  const dateFilterFn: FilterFn<any> = (
    row,
    columnId: string,
    filterValue: any,
  ): boolean => {
    const provided: Date = row.getValue(columnId);
    const filterDate: string = filterValue;
    return filterDate === provided.toLocaleString();
  };

  const defaultColumns = [
    columnHelper.accessor("date", {
      cell: (info) => info.getValue().toLocaleString(),
      header: "Date",
      filterFn: dateFilterFn,
    }),
    columnHelper.accessor("type", {
      cell: (info) => {
        const value = info.getValue();
        switch (value) {
          case "info":
            return (
              <Badge className="w-5/12 min-w-24 justify-center bg-blue-900 hover:bg-blue-900">
                Info
              </Badge>
            );
          case "error":
            return (
              <Badge className="w-5/12 min-w-24 justify-center bg-red-700  hover:bg-red-700">
                Error
              </Badge>
            );
          case "warning":
            return (
              <Badge className="w-5/12 min-w-24 justify-center bg-orange-500 hover:bg-orange-500">
                Warning
              </Badge>
            );
          case "debug":
            return (
              <Badge className="w-5/12 min-w-24 justify-center bg-indigo-400 hover:bg-indigo-400">
                Debug
              </Badge>
            );
        }
      },
      header: "Level",
      filterFn: "equalsString",
    }),
    columnHelper.accessor("route", {
      cell: (info) => <code>{info.getValue()}</code>,
      header: "Route",
      filterFn: "equalsString",
    }),
    columnHelper.accessor("message", {
      cell: (info) => info.getValue(),
      header: "Message",
    }),
  ];

  const table = useReactTable({
    data: logs,
    columns: defaultColumns,
    defaultColumn: {
      size: 315,
      minSize: 50,
      maxSize: 800,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode: "onChange",
  });

  useEffect(() => {
    table
      .getColumn("date")
      ?.setFilterValue(dateFilter === " " ? undefined : dateFilter);
  }, [dateFilter]);

  useEffect(() => {
    table
      .getColumn("type")
      ?.setFilterValue(typeFilter === "" ? undefined : typeFilter);
  }, [typeFilter]);

  useEffect(() => {
    table
      .getColumn("route")
      ?.setFilterValue(routeFilter === " " ? undefined : routeFilter);
  }, [routeFilter]);
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: Record<string, number> = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo]);

  const dropdownOptions = [
    {
      label: (
        <Badge className="w-5/12 min-w-24 cursor-pointer justify-center bg-black">
          All
        </Badge>
      ),
      value: "",
    },
    {
      label: (
        <Badge className="w-5/12 min-w-24 cursor-pointer justify-center bg-red-700 hover:bg-red-800">
          Error
        </Badge>
      ),
      value: "error",
    },
    {
      label: (
        <Badge className="w-5/12 min-w-24 cursor-pointer justify-center bg-orange-500 hover:bg-orange-700">
          Warning
        </Badge>
      ),
      value: "warning",
    },
    {
      label: (
        <Badge className="w-5/12 min-w-24 cursor-pointer justify-center bg-indigo-400 hover:bg-indigo-500">
          Debug
        </Badge>
      ),
      value: "debug",
    },
    {
      label: (
        <Badge className="w-5/12 min-w-24 cursor-pointer justify-center bg-blue-800 hover:bg-blue-900">
          Info
        </Badge>
      ),
      value: "info",
    },
  ];

  const [currentLog, setCurrentLog] = useState<Log>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (log: Log): void => {
    setCurrentLog(log);
    setIsModalOpen(true);
  };

  const Modal = (): JSX.Element => {
    if (isModalOpen) {
      let col = "";
      switch (currentLog?.type) {
        case "error":
          col = "bg-red-700";
          break;
        case "warning":
          col = "bg-orange-500";
          break;
        case "debug":
          col = "bg-indigo-400";
          break;
        case "info":
          col = "bg-blue-800";
          break;
      }
      return (
        <div className="absolute top-0 z-20 flex h-full w-full flex-col items-center justify-center bg-white/70 p-4 text-black backdrop-blur">
          <div className="mb-2 flex w-full w-full flex-row  rounded-md border-2 border-black p-2">
            <div className="flex flex-row">
              <Button
                className="flex h-7 min-w-16 cursor-pointer rounded-md bg-red-700 p-1 text-white hover:bg-red-900"
                onClick={() => {
                  if (currentLog) {
                    deleteLog.mutate({ logId: currentLog.id });
                    setIsModalOpen(false);
                  }
                }}
              >
                Delete
              </Button>
            </div>

            <div className="flex w-full flex-row justify-center gap-2">
              <Badge className="bg-emerald-500">
                {currentLog?.date.toLocaleString()}
              </Badge>
              <Badge className={`w-24 justify-center ${col}`}>
                {currentLog &&
                  currentLog?.type[0]?.toUpperCase() +
                    currentLog?.type.slice(1)}
              </Badge>
              <Badge>{currentLog?.route}</Badge>
            </div>

            <div className="ml-auto flex flex-row">
              <Button
                className="ml-auto flex h-6 w-6 cursor-pointer flex-row items-center justify-center self-end rounded-md bg-red-500 p-1 text-white hover:bg-red-700"
                onClick={() => setIsModalOpen(false)}
              >
                <IoClose />
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto overflow-y-auto rounded-md border-2 border-black p-4 shadow-lg">
            <Editor
              value={currentLog?.message}
              options={{ readOnly: true }}
              height="70vh"
              theme="vs-dark"
            />
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };
  return (
    <>
      <Modal />
      <div
        className={`mb-2 flex w-full flex-row justify-center gap-20 rounded-md bg-white/20 p-2`}
      >
        <div className="gap flex flex-col">
          <div className="w-11/12 text-center font-bold">Date</div>
          <Select
            value={dateFilter}
            setValue={setDateFilter}
            /*This is awful but
            Convert the logs to an array of dates, convert to a set to remove dupes,
            then convert back to an array and map to get the correct format.
            */
            options={Array.from(
              new Set(logs.map((log) => log.date.toLocaleString())),
            ).map((date) => ({
              label: date.replace(",", "\n"),
              value: date,
            }))}
          />
        </div>
        <div className="gap flex flex-col">
          <div className="text-center font-bold">Level</div>
          <Dropdown
            value={typeFilter}
            setValue={setTypeFilter}
            options={dropdownOptions}
          />
        </div>

        <div className="gap flex flex-col">
          <div className="w-11/12  text-center font-bold">Route</div>
          <Select
            value={routeFilter}
            setValue={setRouteFilter}
            /*This is awful but
            Convert the logs to an array of routes, convert to a set to remove dupes,
            then convert back to an array and map to get the correct format.
            */
            options={Array.from(new Set(logs.map((log) => log.route))).map(
              (route) => ({ label: route, value: route }),
            )}
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        {/* Here in the <table> equivalent element (surrounds all table head and data cells), we will define our CSS variables for column sizes */}
        <div
          {...{
        
            className: "w-full border borer-lightgrey w-full",
            style: {
              ...columnSizeVars, //Define column sizes on the <table> element
              width: table.getTotalSize(),
            },
          }}
        >
          <div className="thead w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <div
                {...{
                  key: headerGroup.id,
                  className: "w-full h-30 flex",
                }}
              >
                {headerGroup.headers.map((header) => (
                  <div
                    {...{
                      key: header.id,
                      className: "border border-white p-1 relative",
                      style: {
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      },
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `absolute top-0 h-full right-0 w-[2px] bg-white cursor-pointer ${
                          header.column.getIsResizing()
                            ? "bg-blue-400 opacity-1"
                            : ""
                        }`,
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* When resizing any column we will render this special memoized version of our table body */}
          {table.getState().columnSizingInfo.isResizingColumn ? (
            <MemoizedTableBody table={table} openModal={openModal} />
          ) : (
            <TableBody table={table} openModal={openModal} />
          )}
        </div>
        {table.getPageCount() !== 1 && (
          <div className="mt-2 flex w-full flex-row justify-center gap-2 rounded-md bg-white/20 p-2">
            <Pagination
              page={table.getState().pagination.pageIndex}
              totalPages={table.getPageCount()}
              setPage={table.setPageIndex}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LogTable;
