"use client"

import PageContainer from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FormCardSkeleton from "@/components/ui/form-card-skeleton"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { client } from "@/utils/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Check,
  ChevronDown,
  Copy,
  CopyCheck,
  Loader2,
  Save,
  TriangleAlert,
} from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ImageUploader } from "@/components/shared/image-uploader"
import { useEffect, useState } from "react"
import { PhoneInput } from "@/components/ui/phone-input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DynamicModal } from "@/components/ui/dynamic-modal"
import { useRouter } from "next/navigation"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import data from "@/constants/colleges.json"
import { cn } from "@/utils"

const ProfileFormSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  phone: z.string().optional(),
  collegeName: z.string().optional(),
  address: z.string().optional(),
  image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof ProfileFormSchema>

type College = {
  "College Name": string
}

const CollegeList = data.map((college: College) => ({
  label: college["College Name"],
  value: college["College Name"],
}))

const ProfilePageContent = () => {
  const [isCopying, setIsCopying] = useState(false)
  const [isCopying2, setIsCopying2] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [initialCollegeName, setInitialCollegeName] = useState("")

  const queryClient = useQueryClient()
  const router = useRouter()
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const response = await client.auth.getUser.$get()
      const { user } = await response.json()
      return user
    },
  })

  const deleteAccountSchema = z.object({
    id: z.string(),
    email: z
      .string()
      .email()
      .refine((value) => value === user?.email, {
        message: "Email does not match",
      }),
    confirmText: z.literal("delete my account", {
      message: "Text does not match",
    }),
  })

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
      const collegeNameValue = user.collegeName || ""
      setInitialCollegeName(collegeNameValue)
      form.reset({
        id: user.id || "",
        name: user.name || "",
        phone: user.phone || "",
        collegeName: collegeNameValue,
        address: user.address || "",
        image: user.image || "",
      })
    }
  }, [user, form])

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof ProfileFormSchema>) => {
      const res = await client.auth.updateProfile.$post(data)
      const json = await res.json()

      if (!json.success) {
        throw new Error(json.message)
      }
      return json
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-user"],
      })
      toast.success("Profile updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update")
    },
  })

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      await client.auth.deleteUser.$post({ id })
    },
    onSuccess: () => {
      router.push("/")
      toast.success("Account deleted successfully")
      setShowDeleteModal(false)
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete")
      setShowDeleteModal(false)
    },
  })

  const onCopy = (id: string) => {
    setIsCopying(true)
    navigator.clipboard.writeText(id)
    toast.success("Email ID Copied")
    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  }

  const onCopyText = (id: string) => {
    setIsCopying2(true)
    navigator.clipboard.writeText(id)
    toast.success("Confirmation Text Copied")
    setTimeout(() => {
      setIsCopying2(false)
    }, 2000)
  }

  type deleteFormValues = z.infer<typeof deleteAccountSchema>

  const deleteAccountForm = useForm<deleteFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      id: user?.clerkId || "",
    },
  })

  useEffect(() => {
    if (user) {
      deleteAccountForm.reset({
        id: user?.clerkId || "",
      })
    }
  }, [user, deleteAccountForm])

  function onSubmit(values: ProfileFormValues) {
    updateProfile(values)
  }

  function onDeleteSubmit(values: deleteFormValues) {
    if (user?.clerkId) {
      deleteAccount(values.id)
    }
  }

  if (isLoading) {
    return <FormCardSkeleton />
  }

  const newChangesMade =
    form.formState.isDirty ||
    form.getValues("name") !== user?.name ||
    form.getValues("phone") !== user?.phone ||
    form.getValues("collegeName") !== initialCollegeName ||
    form.getValues("address") !== user?.address ||
    form.getValues("image") !== user?.image

  const handleClose = () => {
    setShowDeleteModal(false)
  }

  return (
    <>
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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 w-full"
                >
                  <div className="w-full flex flex-col md:flex-row items-start h-full">
                    <div className="w-full md:w-2/6 h-full">
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Profile Image</FormLabel>
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
                            <FormItem className="w-full">
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="id"
                          render={({ field }) => (
                            <FormItem className="w-full hidden">
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>Phone Number</FormLabel>
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
                          <FormItem className="flex flex-col w-full">
                            <FormLabel>College Name</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between text-left text-xs md:text-sm !h-12",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value
                                      ? CollegeList.find(
                                          (college) =>
                                            college.value === field.value
                                        )?.label
                                      : "Select College"}
                                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command className="w-full">
                                  <CommandInput placeholder="Search college..." />
                                  <CommandList className="w-full">
                                    <CommandEmpty>
                                      No college found.
                                    </CommandEmpty>
                                    <CommandGroup className="w-full">
                                      {CollegeList.map((college) => (
                                        <CommandItem
                                          value={college.label}
                                          key={college.value}
                                          onSelect={() => {
                                            form.setValue(
                                              "collegeName",
                                              college.value,
                                              {
                                                shouldDirty: true,
                                              }
                                            )
                                          }}
                                        >
                                          {college.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              college.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Full Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your address"
                                {...field}
                                className="h-[100px] resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-end gap-5">
                    <Button
                      disabled={isLoading || isPending}
                      type="button"
                      variant={"destructive"}
                      onClick={() => setShowDeleteModal(true)}
                      className="active:scale-95"
                    >
                      Delete Account
                      {isDeleting ? (
                        <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                      ) : (
                        <TriangleAlert className="ml-2 size-4 shrink-0" />
                      )}
                    </Button>
                    <Button
                      disabled={isLoading || isPending || !newChangesMade}
                      type="submit"
                      className="active:scale-95"
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
      <DynamicModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        onClose={handleClose}
      >
        <div className="flex flex-col gap-3 px-6 py-6 md:px-3 md:py-3">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            Delete Account
            <TriangleAlert className="size-4 shrink-0 mt-0.5" />
          </h1>
          <p className="text-sm font-normal">
            This account will be deleted, along with all of its information,
            bookings and tickets.(this action cannot be undone)
          </p>
          <Form {...deleteAccountForm}>
            <form
              className="space-y-3"
              onSubmit={deleteAccountForm.handleSubmit(
                onDeleteSubmit as SubmitHandler<deleteFormValues>
              )}
            >
              <FormField
                control={deleteAccountForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="w-full flex items-center justify-between">
                      <FormLabel>Enter Account Email</FormLabel>
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"outline"}
                        className="active:scale-95 flex items-center justify-center"
                        onClick={() => onCopy(user?.email || "")}
                      >
                        {isCopying ? (
                          <CopyCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Input placeholder="enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deleteAccountForm.control}
                name="confirmText"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <div className="w-full flex items-center justify-between">
                      <FormLabel>
                        Enter Confirmation Text{" "}
                        <span className="text-muted-foreground ml-1">
                          (delete my account)
                        </span>
                      </FormLabel>
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"outline"}
                        className="active:scale-95 flex items-center justify-center"
                        onClick={() => onCopyText("delete my account")}
                      >
                        {isCopying2 ? (
                          <CopyCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Input placeholder="enter text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={deleteAccountForm.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="w-full hidden">
                    <FormControl>
                      <Input
                        value={user?.clerkId || ""}
                        placeholder="enter text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    handleClose()
                    deleteAccountForm.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isDeleting}
                  variant={"destructive"}
                >
                  Delete
                  {isDeleting ? (
                    <Loader2 className="ml-2 size-4 shrink-0 animate-spin" />
                  ) : null}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DynamicModal>
    </>
  )
}

export default ProfilePageContent
