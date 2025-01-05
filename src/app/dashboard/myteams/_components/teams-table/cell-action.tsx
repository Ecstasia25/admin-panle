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
import { Team } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Copy, CopyCheck, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface CellActionProps {
  data: Team;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isCopying, setIsCopying] = useState(false)
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: deleteTeam, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await client.team.deleteTeam.$post({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-all-teams"] })
      toast.success("Team deleted successfully")
    }
  })

  const onCopy = (id: string) => {
    setIsCopying(true)
    navigator.clipboard.writeText(id);
    toast("Team Code Copied");
    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  };
  const onConfirm = () => {
    deleteTeam(data.id);
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
            onClick={() => router.push(`/dashboard/teams/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};