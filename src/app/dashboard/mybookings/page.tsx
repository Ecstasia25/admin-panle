import { SearchParams } from "nuqs/parsers"
import React from "react"

import { searchParamsCache } from "@/lib/searchparams"
import MyBookingsList from "./_components/my-booking-list"

type pageProps = {
  searchParams: SearchParams
}

export const metadata = {
  title: "Teams | Ecstasia Panel",
}

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams)

  const page = searchParamsCache.get("page")
  const pageLimit = searchParamsCache.get("limit")
  const search = searchParamsCache.get("q") || ""

  return <MyBookingsList page={page} pageLimit={pageLimit} search={search} />
}
