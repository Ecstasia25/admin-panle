'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Event } from '@prisma/client';
import { format } from 'date-fns';

export const columns: ColumnDef<Event>[] = [
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
    accessorKey: 'title',
    header: 'TITLE',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.title}
        </span>
      )
    }
  },
  {
    accessorKey: 'stage',
    header: 'STAGE TYPE',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.stage}
        </span>
      )
    }
  },
  {
    accessorKey: 'groupSize',
    header: 'GROUP SIZE',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.groupSize}
        </span>
      )
    }
  },
  {
    accessorKey: 'slotCount',
    header: 'SLOT COUNT',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.slotCount}
        </span>
      )
    }
  },
  {
    accessorKey: 'price',
    header: 'PRICE',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.price}
        </span>
      )
    }
  },
  {
    accessorKey: 'discount',
    header: 'DISCOUNT',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.discount} %
        </span>
      )
    }
  },
  {
    accessorKey: 'finalPrice',
    header: 'DISCOUNTED PRICE',
    cell: ({ row }) => {
      return (
        <span className='min-w-[150px] flex items-center'>
          {row.original.finalPrice}
        </span>
      )
    }
  },
  {
    accessorKey: 'date',
    header: 'EVENT DATE',
    cell: ({ row }) => {
      return (
        <span className='min-w-[200px] flex items-center'>
          {format(new Date(row.original.date), 'PPP hh:mm a')}
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