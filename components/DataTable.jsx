// @/components/DataTable.js

"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa"; // Import search icon

export function DataTable({ columns, data }) {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString", // You can customize the filter function here
  });

  return (
    <div style={{ backgroundColor: "#F2F4F0" }}>
      {" "}
      {/* Overall background color */}
      <div className="flex items-center py-2 px-4">
        <Input
          placeholder="Filter key fields"
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm border border-gray-300 rounded-md"
        />
        {/* <div className="relative max-w-sm w-full ml-60">
    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> 
    <Input
      placeholder="Search"
      className="w-60 pl-10 border border-gray-300 rounded-md" 
    />
  </div> */}
      </div>
      <div className="rounded-md border border-gray-300 overflow-hidden">
        <Table className="min-w-full bg-white">
          <TableHeader
            style={{ backgroundColor: "#EAEAEA" }}
            className="border-b border-gray-300"
          >
            {" "}
            {/* Header background color with border */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="text-left border-b border-gray-300"
              >
                {" "}
                {/* Horizontal border for row */}
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="py-3 px-4 font-semibold text-gray-700 border border-gray-300" // Added border for cells
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`text-sm text-gray-700 border-b border-gray-300 ${
                    row.getIsSelected() ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2 px-4 border border-gray-300"
                    >
                      {" "}
                      {/* Added border for cells */}
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-800"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border-gray-400 text-gray-600 hover:bg-gray-200"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border-gray-400 text-gray-600 hover:bg-gray-200"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
