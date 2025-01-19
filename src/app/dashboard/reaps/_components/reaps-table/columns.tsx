'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { User } from '@prisma/client';
import { format } from 'date-fns';
import { formatedString } from '@/utils';



export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'NAME',
    cell: ({ row }) => {
      return (
        <span className='min-w-[150px] flex items-center'>
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
    accessorKey: 'collegeName',
    header: 'COLLEGE NAME',
    cell: ({ row }) => {
      return (
        <span className='min-w-[150px] flex items-center'>
         {row.original.collegeName ? formatedString(row.original.collegeName) : (
            <span
              className='italic'
            >
              null
            </span>
          )}
        </span>
      )
    }
  },
  {
    accessorKey: '',
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
        <span className='min-w-[200px] flex items-center'>
          {format(new Date(row.original.createdAt), 'PPP hh:mm a')}
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
