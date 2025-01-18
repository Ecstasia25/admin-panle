"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Team, User } from "@prisma/client"
import { format } from "date-fns"


interface TeamWithReap extends Team {
  reap?: User
}

export const columns: ColumnDef<TeamWithReap>[] = [
  {
    id: "select",
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
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "TEAM NAME",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.name}
        </span>
      )
    },
  },
  {
    accessorKey: "reap.name",
    header: "REAP NAME",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.reap?.name}
        </span>
      )
    },
  },
  {
    accessorKey: "teamId",
    header: "TEAM ID",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.teamId}
        </span>
      )
    },
  },
  {
    accessorKey: "groupSize",
    header: "GROUP SIZE",
    cell: ({ row }) => {
      return (
        <span className="min-w-[100px] flex items-center">
          {row.original.groupSize}
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
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
