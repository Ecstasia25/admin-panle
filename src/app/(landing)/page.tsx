

import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import LandingPageContent from "../_components/landing/landing-content"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home | Ecstasia Admin",
}


export default async function Home() {
  const queryClient = new QueryClient()
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LandingPageContent />
    </HydrationBoundary>
  )
}
