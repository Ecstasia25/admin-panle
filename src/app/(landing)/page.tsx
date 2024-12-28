

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import LandingPageContent from "../_components/landing/landing-content"
import { Metadata } from "next"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Home | Ecstasia Admin",
}


export default async function Home() {
  const queryClient = new QueryClient()
  const auth = await currentUser()

  if (auth?.id) {
    redirect('/dashboard')
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingPageContent />
    </HydrationBoundary>
  )
}
