"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Booking, Event, Team, User } from "@prisma/client"
import { format } from "date-fns"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TeamWithMembers extends Team {
  members: User[];
}

interface BookingWithTeam extends Booking {
  team: TeamWithMembers;
  event: Event
}

export const columns: ColumnDef<BookingWithTeam>[] = [
  {
    accessorKey: "bookingId",
    header: "BOOKING ID",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.bookingId}
        </span>
      )
    },
  },
  {
    accessorKey: "team.teamId",
    header: "TEAM CODE",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.team.teamId}
        </span>
      )
    },
  },
  {
    accessorKey: "team.name",
    header: "TEAM NAME",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.team.name}
        </span>
      )
    },
  },
  {
    accessorKey: "event.category",
    header: "EVENT CATEGORY",
    cell: ({ row }) => {
      return (
        <span className="min-w-[150px] flex items-center">
          {row.original.event.category}
        </span>
      )
    },
  },
  {
    accessorKey: "event.title",
    header: "EVENT NAME",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.event.title}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.status}
        </span>
      )
    },
  },
  {
    accessorKey: "isPaid",
    header: "PAYMENT STATUS",
    cell: ({ row }) => {
      return row.original.isPaid ? (
        <span className="min-w-[150px] flex items-center">PAID</span>
      ) : (
        <span className="min-w-[150px] flex items-center">NOT PAID</span>
      )
    },
  },
  {
    accessorKey: "paymentScreenshot",
    header: "SCREENSHOT",
    cell: ({ row }) => {
      return (
        <div className="min-w-[150px] flex items-center cursor-pointer">
          {row.original.paymentScreenshot ? (
            <Dialog>
              <DialogTrigger asChild>
                <Image
                  src={row.original.paymentScreenshot}
                  alt="payment-screenshot"
                  width={100}
                  height={100}
                  className="w-30 h-14 rounded-md object-cover cursor-pointer select-none"
                />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-4 select-none">
                    View Screenshot
                  </DialogTitle>
                  <Image
                    src={row.original.paymentScreenshot}
                    alt="payment-screenshot"
                    width={300}
                    height={300}
                    className="w-full h-full rounded-md object-cover select-none pointer-events-none"
                  />
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <span>No Screenshot</span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "price",
    header: "AMOUNT",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.price}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "CREATED AT",
    cell: ({ row }) => {
      return (
        <span className="min-w-[200px] flex items-center">
          {format(new Date(row.original.createdAt), "PPP hh:mm a")}
        </span>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: "UPDATED AT",
    cell: ({ row }) => {
      return (
        <span className="min-w-[200px] flex items-center">
          {format(new Date(row.original.updatedAt), "PPP hh:mm a")}
        </span>
      )
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
