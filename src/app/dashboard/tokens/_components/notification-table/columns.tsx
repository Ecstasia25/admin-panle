'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Event, FcmTokens } from '@prisma/client';
import { format } from 'date-fns';
import { formatedString } from '@/utils';

export const columns: ColumnDef<FcmTokens>[] = [
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
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {formatedString(row.original.id)}
        </span>
      )
    }
  },
  {
    accessorKey: 'token',
    header: 'TOEKN',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {formatedString(row.original.token)}
        </span>
      )
    }
  },
  {
    accessorKey: 'userId',
    header: 'USER ID',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {formatedString(row.original.userId)}
        </span>
      )
    }
  },
  {
    accessorKey: 'deviceOs',
    header: 'DEVICE OS',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.deviceOs}
        </span>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
    cell: ({ row }) => {
      return (
        <span className='min-w-[200px] flex items-center'>
          {format(new Date(row.original.createdAt), 'PPP hh:mm a')}
        </span>
      )
    }
  },
  {
    accessorKey: "updatedAt",
    header: "UPDATED AT",
    cell: ({ row }) => {
      return (
        <span className='min-w-[200px] flex items-center'>
          {format(new Date(row.original.updatedAt), 'PPP hh:mm a')}
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
