// @/components/RoleTable.jsx

'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const columns = [
  {
    accessorKey: 'role_name',
    header: 'Role Name',
  },
  {
    accessorKey: 'department_name',
    header: 'Department Name',
  },
];

export default function RoleTable({ roles }) {
  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableHead key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>No roles found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
