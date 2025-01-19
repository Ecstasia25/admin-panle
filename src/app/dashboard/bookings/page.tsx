import { SearchParams } from "nuqs/parsers"
import { searchParamsCache } from "@/lib/searchparams"
import AllBookingsList from "./_components/all-boking-list"

type pageProps = {
  searchParams: SearchParams
}

export const metadata = {
  title: "All Bookings | Ecstasia Panel",
}

export default async function Page({ searchParams }: pageProps) {
  searchParamsCache.parse(searchParams)

  const page = searchParamsCache.get("page")
  const pageLimit = searchParamsCache.get("limit")
  const search = searchParamsCache.get("q") || ""
  const groupSize = searchParamsCache.get("groupSize") || ""
  const validCategories = [
    "DANCE",
    "MUSIC",
    "DRAMA",
    "LITERARY",
    "INFORMALS",
    "ART",
    "SPORTS",
    "PHOTORAPHY",
  ] as const
  const category = searchParamsCache.get("category") as
    | (typeof validCategories)[number]
    | undefined
  const validBookingStatuses = ["PENDING", "CONFIRMED", "CANCELLED"] as const
  const bookingStatus = validBookingStatuses.includes(
    searchParamsCache.get("bookingStatus") as any
  )
    ? (searchParamsCache.get("bookingStatus") as
        | "PENDING"
        | "CONFIRMED"
        | "CANCELLED")
    : undefined
  return (
    <AllBookingsList
      page={page}
      pageLimit={pageLimit}
      search={search}
      groupSize={groupSize}
      category={category}
      bookingStatus={bookingStatus}
    />
  )
}
