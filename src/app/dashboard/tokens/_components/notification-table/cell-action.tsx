'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { client } from '@/utils/client';
import { Event, FcmTokens, User } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, CopyCheck, Edit, FileText, MoreHorizontal, Trash, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from '@/components/ui/input';
import { CopyButton } from '@/components/shared/copy-button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';



interface CellActionProps {
  data: FcmTokens;
}
interface TokenDetailsUnitProps {
  label: string;
  value?: string;
}


const TokenDetailsUnit = ({ label, value }: TokenDetailsUnitProps) => {
  return (
    <div className='w-full flex flex-col gap-2 items-start'>
      <Label>
        {label}
      </Label>
      <div className='w-full flex items-center gap-2'>
        <Input
          value={value}
        />
        {value && (<CopyButton value={value} label={label} />)}

      </div>
    </div>
  )
}


export const CellAction: React.FC<CellActionProps> = ({ data }) => {

  const [showDetails, setShowDetails] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [open, setOpen] = useState(false);


  const queryClient = useQueryClient();

  const { mutate: deleteAdmin, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await client.fcm.deleteFcmToken.$post({ id })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-fcms"] })
      toast.success("FCM Token deleted successfully")
    }
  })


  const onCopy = (id: string) => {
    setIsCopying(true)
    navigator.clipboard.writeText(id);
    toast("FCM Token  Copied");
    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  };
  const onConfirm = () => {
    deleteAdmin(data.id);
    setOpen(false);
  };

  const loading = isPending;

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
            onClick={() => setShowDetails(true)}
          >
            <FileText className="mr-2 h-4 w-4" />
            Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy(data.token)}
          >
            {isCopying ? (
              <CopyCheck className="w-4 h-4 mr-2 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            Copy Token
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet
        open={showDetails}
        onOpenChange={setShowDetails}
      >
        <SheetContent className='!px-4 !py-6'>
          <SheetHeader>
            <SheetTitle>
              FCM Token Details
            </SheetTitle>
            <SheetDescription>
              Details of the FCM Token and the user associated with this token and the device OS
            </SheetDescription>
          </SheetHeader>
          <div className='w-full flex flex-col gap-4 py-3 mt-4'>
            <TokenDetailsUnit label="FCM Token" value={data.token} />
            <TokenDetailsUnit label="User ID" value={data.userId} />
            <Button
              variant={"outline"}
              className='active:scale-95 pointer-events-none select-none flex justify-start'
            >
              Device OS : {data.deviceOs}
            </Button>
          </div>
          <SheetFooter>
            <Button
              variant={"destructive"}
              onClick={() => {
                setShowDetails(false)
                setOpen(true)
              }}
            >
              Delete Token
              <Trash2 className='size-4 shrink-0 ml-2' />
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    </>
  );
};
