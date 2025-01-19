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
  event:Event;
}



export const columns: ColumnDef<BookingWithTeam>[] = [
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
