"use client"
import { AlertModal } from "@/components/modal/alert-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { client } from "@/utils/client"
import { Team, User } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Copy,
  CopyCheck,
  Edit,
  Eye,
  LayoutGrid,
  MoreHorizontal,
  Trash,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CopyButton } from "@/components/shared/copy-button"

interface CellActionProps {
  data: Team & { members?: User[] } & { reap?: User }
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isCopying, setIsCopying] = useState(false)
  const [isCopying2, setIsCopying2] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutate: deleteTeam, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await client.team.deleteTeam.$post({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-teams"] })
      toast.success("Team deleted successfully")
    },
  })

  const onCopy = (id: string) => {
    setIsCopying(true)
    navigator.clipboard.writeText(id)
    toast("Team Code Copied")
    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  }
  const onConfirm = () => {
    deleteTeam(data.id)
    setOpen(false)
  }

  const loading = isPending

  const teamJoinLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/yourteams/join/${data.teamId}`
  const onCopy2 = (id: string) => {
    setIsCopying(true)
    navigator.clipboard.writeText(id)
    toast("Join Link Copied")
    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  }

  const checkMemberPresentInTeam = data.members?.some((member) => member !== undefined)

  
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy(data.teamId)}
          >
            {isCopying ? (
              <CopyCheck className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy Team Code
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy2(teamJoinLink)}
          >
            {isCopying2 ? (
              <CopyCheck className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy Join Link
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setSheetOpen(true)
            }}
          >
            <Eye className="mr-2 h-4 w-4" />
            Team Members
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="uppercase text-md md:text-lg flex items-center gap-2 mb-2">
              <LayoutGrid className="size-5 shrink-0 mt-1" />
              {data.name} Team Details
            </SheetTitle>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h1 className="text-md font-normal">
                  Team Code : {data.teamId}
                </h1>
                <CopyButton label="Team Code" value={data.teamId} />
              </div>
              {data.reap && (
                <>
                  <h1 className="text-md font-normal">
                    Representative Name :{" "}
                    <span className="text-muted-foreground">
                      {data.reap.name}
                    </span>
                  </h1>
                  <h1 className="text-md font-normal">
                    College Name :{" "}
                    <span className="text-muted-foreground">
                      {data.reap.collegeName}
                    </span>
                  </h1>
                </>
              )}
              <h1 className="text-md font-normal mt-3">Team Members :</h1>
              {data.members &&
                data.members.map((member, index) => (
                  <div key={member.id} className="flex flex-col items-start gap-1">
                  <h1 key={member.id} className="text-md text-black">
                    <span className="font-semibold mr-1">{index + 1}.</span>
                    {member.name}
                  </h1>
                  <p className="text-sm">
                   <span className="font-semibold">Email :</span> {member.email}</p>
                </div>
                ))}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}
