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
import { BokingStatus, Booking, Event, Team, User } from "@prisma/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Copy,
  CopyCheck,
  Edit,
  HeartCrack,
  LayoutGrid,
  Loader2,
  MoreHorizontal,
  PartyPopper,
  Trash,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import Image from "next/image"

interface TeamWithMembers extends Team {
  members: User[]
}

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { z } from "zod"

interface BookingWithTeam extends Booking {
  team: TeamWithMembers
  event: Event
}

interface CellActionProps {
  data: BookingWithTeam
}

const BookingFormSchema = z.object({
  bookingId: z.string().nonempty("Booking ID is required"),
  isPaid: z.boolean().optional(),
  status: z
    .nativeEnum(BokingStatus, {
      required_error: "Status is required",
    })
    .optional(),
})

type BookingFormValues = z.infer<typeof BookingFormSchema>

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [cancelling, setCancelling] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)

  const queryClient = useQueryClient()

  const { mutate: updateBooking, isPending: isUpdatingBooking } = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      const response = await client.booking.updateBooking.$post(data)
      if (!response.ok) {
        throw new Error("Failed to update status")
      }
      const json = await response.json()
      if (!json.success) {
        throw new Error(json.message || "Failed to update status")
      }
      return json
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-bookings"] })
      setSheetOpen(false)
      toast.success("Booking updated successfully")
      setCancelling(false)
      setConfirming(false)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const { mutate: deleteAdmin, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await client.booking.deleteBooking.$post({ bookingId: id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-bookings"] })
      toast.success("Booking deleted successfully")
    },
  })

  const onCopy = (id: string) => {
    setIsCopying(true)
    navigator.clipboard.writeText(id)
    toast("Booking ID Copied")
    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  }
  const onConfirm = () => {
    deleteAdmin(data.id)
    setOpen(false)
  }

  const loading = isPending

  const confirmBooking = () => {
    setConfirming(true)
    updateBooking({
      bookingId: data.id,
      status: "CONFIRMED",
      isPaid: true,
    })
  }

  const cancelBooking = () => {
    setCancelling(true)
    updateBooking({
      bookingId: data.id,
      status: "CANCELLED",
    })
  }

  const deleteBooking = () => {
    deleteAdmin(data.id)
  }
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
            onClick={() => {
              setSheetOpen(true)
            }}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isPending} onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy(data.bookingId)}
          >
            {isCopying ? (
              <CopyCheck className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy Id
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="p-4 overflow-y-scroll">
          <SheetHeader>
            <SheetTitle className="uppercase text-md md:text-lg flex items-center gap-2 mb-2">
              <LayoutGrid className="size-5 shrink-0 mt-1" />
              Booking Details
            </SheetTitle>
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-sm font-medium">
                Booking ID : {data.bookingId}
              </h1>
              <h1 className="text-sm font-medium">
                Team ID : {data.team.teamId}
              </h1>
              <h1 className="text-sm font-medium">
                Team Size :{data.team.groupSize}
              </h1>
              <h1 className="text-sm font-medium">
                Present Members Count :{data.team?.members?.length}
              </h1>
              <h1 className="text-sm font-medium">
                Event Name :{data.event.title}
              </h1>
              <h1 className="text-lg font-medium mt-2">Team Members :</h1>
              {data.team?.members?.map((member) => (
                <div key={member.id} className="flex items-center gap-2">
                  <span className="text-sm font-medium">{member.name}</span>
                  <span className="text-sm font-medium">({member.email})</span>
                </div>
              ))}
              <h1 className="text-lg font-medium mt-2">
                Booking Price : ₹ {data.price} /-
              </h1>
              <h1 className="text-sm font-medium">Payment Screenshot : </h1>
              {data.paymentScreenshot && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Image
                      src={data.paymentScreenshot}
                      alt="payment-screenshot"
                      width={200}
                      height={200}
                      className="rounded-md object-cover select-none cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="mb-4 select-none">
                        View Screenshot
                      </DialogTitle>
                      <Image
                        src={data.paymentScreenshot}
                        alt="payment-screenshot"
                        width={300}
                        height={300}
                        className="w-full h-full rounded-md object-cover select-none pointer-events-none"
                      />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex items-center gap-2 justify-start pt-4 w-full">
              {data.status === "PENDING" ? (
                <>
                  <Button
                    onClick={cancelBooking}
                    variant={"destructive"}
                    className="w-full"
                  >
                    Cancel Booking{" "}
                    {cancelling ? (
                      <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                    ) : (
                      <HeartCrack className="size-4 shrink-0 ml-2" />
                    )}
                  </Button>
                  <Button onClick={confirmBooking} className="w-full">
                    Confirm Booking
                    {confirming ? (
                      <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                    ) : (
                      <PartyPopper className="size-4 shrink-0 ml-2" />
                    )}
                  </Button>
                </>
              ) : data.status === "CONFIRMED" ? (
                <Button
                  onClick={cancelBooking}
                  variant={"destructive"}
                  disabled={isUpdatingBooking}
                  className="w-full"
                >
                  Cancel Booking{" "}
                  {isUpdatingBooking ? (
                    <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                  ) : (
                    <HeartCrack className="size-4 shrink-0 ml-2" />
                  )}
                </Button>
              ) : (
                <Button
                  onClick={deleteBooking}
                  variant={"destructive"}
                  className="w-full"
                >
                  Delete Booking
                  {isUpdatingBooking ? (
                    <Loader2 className="size-4 shrink-0 ml-2 animate-spin" />
                  ) : (
                    <Trash2 className="size-4 shrink-0 ml-2" />
                  )}
                </Button>
              )}
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}
