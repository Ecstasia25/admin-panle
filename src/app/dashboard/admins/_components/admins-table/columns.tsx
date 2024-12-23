'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@prisma/client';
import { format } from 'date-fns';

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => {
      return (
        <span className='min-w-[200px] flex items-center'>
          {row.original.name}
        </span>
      )
    }
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'phone',
    header: 'PHONE',
    cell: ({ row }) => {
      return (
        <span className='flex items-center'>
          {row.original.phone === null || row.original.phone === undefined ? (
            <span
              className='italic'
            >
              null
            </span>
          ) : row.original.phone}
        </span>
      )
    }
  },
  {
    accessorKey: 'role',
    header: 'ROLE'
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
    cell: ({ row }) => {
      return (
        <span>
          {format(new Date(row.original.createdAt), 'PPP hh:mm')}
        </span>
      )
    }
  },
  {
    id: 'actions',
    header: 'ACTIONS',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
