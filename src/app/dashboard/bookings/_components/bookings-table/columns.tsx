'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Booking, Event, Team, } from '@prisma/client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface BookingWithTeam extends Booking {
  team: Team;
  event: Event;
}



export const columns: ColumnDef<BookingWithTeam>[] = [

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
    accessorKey: 'bookingId',
    header: 'BOOKING ID',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.bookingId}
        </span>
      )
    }
  },
  {
    accessorKey: 'team.teamId',
    header: 'TEAM CODE',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.team.teamId}
        </span>
      )
    }
  },
  {
    accessorKey: 'team.name',
    header: 'TEAM NAME',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.team.name}
        </span>
      )
    }
  },
  {
    accessorKey: 'event.category',
    header: 'EVENT CATEGORY',
    cell: ({ row }) => {
      return (
        <span className='min-w-[150px] flex items-center'>
          {row.original.event.category}
        </span>
      )
    }
  },
  {
    accessorKey: 'event.title',
    header: 'EVENT NAME',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.event.title}
        </span>
      )
    }
  },
  {
    accessorKey: 'price',
    header: 'AMOUNT',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.price}
        </span>
      )
    }
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      return (
        <span className='min-w-[100px] flex items-center'>
          {row.original.status}
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
