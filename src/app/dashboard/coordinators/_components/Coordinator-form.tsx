'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useUser } from '@/hooks/users/use-user';
import { client } from '@/utils/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Role, User } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    role: z.nativeEnum(Role)
});

export default function CoordinatorForm({
    initialData,
    pageTitle
}: {
    initialData: User | null;
    pageTitle: string;
}) {

    const { user } = useUser();
    const queryClient = useQueryClient();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            role: 'COORDINATOR'
        }
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || '',
                phone: initialData.phone || '',
                role: initialData.role || 'COORDINATOR'
            });
        }
    }, [initialData, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema> & {
            id: string;
        }) => {
            const res = await client.auth.updateUser.$post({
                id: data.id,
                name: data.name,
                phone: data.phone,
                role: data.role,
            });
            const json = await res.json();

            if (!json.success) {
                throw new Error(json.message);
            }
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['get-coordinator']
            });
            toast.success('Coordinator updated successfully');
            router.push('/dashboard/coordinators');
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update");
        }
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (initialData) {
            mutate({
                ...values,
                id: initialData.id,
            });
        }
    }

    return (
        <Card className="mx-auto w-full">
            <CardHeader>
                <CardTitle className="text-left text-2xl font-bold">
                    {pageTitle} {initialData ? `(${initialData.name})` : ''}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Coordinator Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter admin name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Role
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Update Role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {user?.role === "SUPERADMIN" && (
                                                    <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                                                )}
                                                {(user?.role === "ADMIN" || user?.role === "SUPERADMIN") && (
                                                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                                                )}
                                                <SelectItem value="COORDINATOR">COORDINATOR</SelectItem>
                                                <SelectItem value="USER">USER</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col items-start">
                                        <FormLabel className="text-left">
                                            Phone Number
                                        </FormLabel>
                                        <FormControl className="w-full">
                                            <PhoneInput
                                                placeholder="Enter a phone number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='w-full flex items-center justify-end'>
                            <Button
                                disabled={isPending || initialData === null}
                                type="submit">
                                {isPending ? 'Updating' : 'Update'}
                                {isPending ? (
                                    <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                                ) : (<Save className="ml-2 size-4 shrink-0" />)}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}