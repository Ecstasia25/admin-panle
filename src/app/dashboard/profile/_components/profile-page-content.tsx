"use client"

import PageContainer from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormCardSkeleton from '@/components/ui/form-card-skeleton'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { client } from '@/utils/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Save } from 'lucide-react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImageUploader } from '@/components/shared/image-uploader'
import { useEffect } from 'react'
import { PhoneInput } from '@/components/ui/phone-input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const ProfileFormSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    phone: z.string().optional(),
    collegeName: z.string().optional(),
    address: z.string().optional(),
    image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof ProfileFormSchema>

const ProfilePageContent = () => {

    const queryClient = useQueryClient();

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['get-user'],
        queryFn: async () => {
            const response = await client.auth.getUser.$get();
            const { user } = await response.json();
            return user;
        },
    },
    )


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            id: user?.id || "",
            name: user?.name || "",
            phone: user?.phone || "",
            collegeName: user?.collegeName || "",
            address: user?.address || "",
            image: user?.image || "",
        },
    })


    useEffect(() => {
        if (user) {
            form.reset({
                id: user.id || "",
                name: user.name || "",
                phone: user.phone || "",
                collegeName: user.collegeName || "",
                address: user.address || "",
                image: user.image || "",
            })
        }
    }, [user, form])


    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (data: z.infer<typeof ProfileFormSchema>) => {
            const res = await client.auth.updateProfile.$post(data);
            const json = await res.json();

            if (!json.success) {
                throw new Error(json.message);
            }
            return json;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['get-user']
            });
            toast.success('Profile updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update");
        }
    });


    function onSubmit(values: ProfileFormValues) {
        updateProfile(values);
    }


    if (isLoading) {
        return (
            <FormCardSkeleton />
        );
    }



    return (
        <PageContainer scrollable>
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={`Update Your Profile Details`}
                        description="Manage your profile details and settings"
                    />
                </div>
                <Separator />
                <Card className="mx-auto w-full">
                    <CardHeader>
                        <div className="w-full flex items-center justify-between">
                            <CardTitle className="text-left text-2xl font-bold">
                                {user?.name}
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">

                                <div className="w-full flex flex-col md:flex-row items-start h-full">
                                    <div className="w-full md:w-2/6 h-full">
                                        <FormField
                                            control={form.control}
                                            name="image"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Event Poster</FormLabel>
                                                    <FormControl>
                                                        <ImageUploader
                                                            value={field.value ? [field.value] : []}
                                                            onChange={(url) => field.onChange(url)}
                                                            onRemove={() => field.onChange("")}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="w-full md:w-4/6 flex-1 flex flex-col gap-3 md:gap-5">
                                        <div className="w-full flex flex-col md:flex-row gap-3">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormLabel>
                                                            Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="id"
                                                render={({ field }) => (
                                                    <FormItem className='w-full hidden'>
                                                        <FormLabel>
                                                            Name
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter your name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem className='w-full'>
                                                        <FormLabel>
                                                            Phone Number
                                                        </FormLabel>
                                                        <FormControl>
                                                            <PhoneInput
                                                                placeholder="Enter phone number"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="collegeName"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>
                                                        College Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your college name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem className='w-full'>
                                                    <FormLabel>
                                                        Full Address
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Enter your address"
                                                            {...field}
                                                            className='h-[100px] resize-none'
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                    </div>
                                </div>
                                <div className='w-full flex items-center justify-end'>
                                    <Button
                                        disabled={isLoading || isPending}
                                        type='submit'
                                    >
                                        Update
                                        {isPending ? (
                                            <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                                        ) : (
                                            <Save className="ml-2 size-4 shrink-0" />
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    )
}

export default ProfilePageContent