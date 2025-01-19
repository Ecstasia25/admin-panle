'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@prisma/client';
import { format } from 'date-fns';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
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
          {row.original.phone === null ? (
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
        <span className='min-w-[200px] flex items-center'>
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
