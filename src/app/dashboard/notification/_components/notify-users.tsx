"use client"

import PageContainer from "@/components/layout/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { client } from "@/utils/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/utils/uploadthing"
import { BellPlus, Loader2, XCircle } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import axios from "axios"

const formSchema = z.object({
  title: z.string().nonempty("Title is required"),
  body: z.string().nonempty("Body is required"),
  imageUrl: z.string(),
  logoUrl: z.string(),
  tokens: z.array(z.string()).nonempty("Tokens are required"),
})

type formValues = z.infer<typeof formSchema>

const NotifyUsersPage = () => {
  const [image, setImage] = useState<string | undefined>()
  const [imageIsDeleting, setImageIsDeleting] = useState(false)
  const [logoImage, setLogoImage] = useState<string | undefined>(
    "https://utfs.io/f/YBGOKELy3ajCdcMEi7vVtoHPD4q7ZvyEMTOf0FkmB6gQaJSs"
  )
  const [logoImageIsDeleting, setLogoImageIsDeleting] = useState(false)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-all-fcms-tokens"],
    queryFn: async () => {
      const response = await client.fcm.getAllFcmTokens.$get()
      const { fcmTokens } = await response.json()
      return fcmTokens
    },
    refetchOnMount: true,
  })

  const tokensCount = data?.length || 0

  const form = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      imageUrl: "",
      logoUrl: "",
      tokens: [],
    },
  })

  useEffect(() => {
    if (data) {
      form.reset({
        tokens: data.map((token) => token.token),
      })
    }
  }, [data])

  useEffect(() => {
    if (typeof image === "string" && image.length > 0) {
      form.setValue("imageUrl", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }, [image])

  useEffect(() => {
    if (typeof logoImage === "string" && logoImage.length > 0) {
      form.setValue("logoUrl", logoImage, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    }
  }, [logoImage])

  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true)
    const imageKey = image.substring(image.lastIndexOf("/") + 1)
    axios
      .post("/api/uploadthing/delete", {
        imageKey,
      })
      .then((res) => {
        if (res.data.success) {
          setImage("")
          toast.success("Image deleted successfully")
        }
      })
      .catch((error) => {
        toast.error(error.message || "Failed to delete image")
      })
      .finally(() => {
        setImageIsDeleting(false)
      })
  }

  const handleLogoDelete = (image: string) => {
    setLogoImageIsDeleting(true)
    const imageKey = image.substring(image.lastIndexOf("/") + 1)
    axios
      .post("/api/uploadthing/delete", {
        imageKey,
      })
      .then((res) => {
        if (res.data.success) {
          setImage("")
          toast.success("Logo deleted successfully")
        }
      })
      .catch((error) => {
        toast.error(error.message || "Failed to delete logo")
      })
      .finally(() => {
        setLogoImageIsDeleting(false)
      })
  }

  const { mutate: sendNotification, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await client.notification.sendNotification.$post(data)
      const json = await res.json()
      if (!json.success) throw new Error(json.message)
      return json
    },
    onSuccess: () => {
      form.reset()
      setImage("")
      toast.success("Notification sent successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send notification")
    },
  })

  function onSubmit(values: formValues) {
    sendNotification(values)
  }

  console.log(logoImage)

  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Notify Users (${tokensCount})`}
            description="Notify all the users in the system"
          />

          <div className="flex items-center gap-2"></div>
        </div>
        <Separator />
        <Card className="mx-auto w-full">
          <CardHeader>
            <div className="w-full flex items-center justify-between">
              <CardTitle className="text-left text-2xl font-bold">
                Craft The Notification
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <div className="w-full flex flex-col items-start h-full gap-6">
                  <div className="w-full h-full flex flex-col md:flex-row gap-8">
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2 mt-4 w-full">
                          <FormLabel>Upload an Image</FormLabel>
                          <FormControl>
                            {image ? (
                              <>
                                <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4 border-2 border-dotted border-gray-400 rounded-sm">
                                  <Image
                                    src={image}
                                    alt="notification img"
                                    fill
                                    className="object-contain p-2"
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0 "
                                    onClick={() => handleImageDelete(image)}
                                  >
                                    {imageIsDeleting ? (
                                      <Loader2
                                        className="animate-spin"
                                        size={20}
                                      />
                                    ) : (
                                      <XCircle size={20} />
                                    )}
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col items-center max-w-[4000px] border-2 border-dotted border-primary/50 justify-center pt-6 pb-3  rounded-sm">
                                  <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      setImage(res[0].url)
                                      toast.success(
                                        "Image uploaded successfully"
                                      )
                                    }}
                                    onUploadError={(error: Error) => {
                                      toast.error(error.message)
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-2 mt-4 w-full">
                          <FormLabel>Upload a Logo</FormLabel>
                          <FormControl>
                            {logoImage ? (
                              <>
                                <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4 border-2 border-dotted border-gray-400 rounded-sm">
                                  <Image
                                    src={logoImage}
                                    alt="logo img"
                                    fill
                                    className="object-contain p-2"
                                  />
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="absolute right-0 top-0 "
                                    onClick={() => handleLogoDelete(logoImage)}
                                  >
                                    {logoImageIsDeleting ? (
                                      <Loader2
                                        className="animate-spin"
                                        size={20}
                                      />
                                    ) : (
                                      <XCircle size={20} />
                                    )}
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex flex-col items-center max-w-[4000px] border-2 border-dotted border-primary/50 justify-center pt-6 pb-3  rounded-sm">
                                  <UploadButton
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      setLogoImage(res[0].url)
                                      toast.success(
                                        "Logo uploaded successfully"
                                      )
                                    }}
                                    onUploadError={(error: Error) => {
                                      toast.error(error.message)
                                    }}
                                  />
                                </div>
                              </>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full flex-1 flex flex-col gap-3 md:gap-5">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Notification Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Notification Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter description"
                              {...field}
                              className="h-32 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="w-full flex items-center justify-end">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isPending || isLoading}
                      >
                        {isPending ? "Sending" : "Send To All"}
                        {isPending ? (
                          <Loader2 className="animate-spin ml-2 size-4 shrink-0" />
                        ) : (
                          <BellPlus className="ml-2 size-4 shrink-0" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default NotifyUsersPage
