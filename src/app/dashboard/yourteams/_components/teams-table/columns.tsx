"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import { Team, User } from "@prisma/client"
import { format } from "date-fns"

export const columns: ColumnDef<Team>[] = [
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
