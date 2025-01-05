"use client"

import { searchParams } from "@/lib/searchparams"
import { useQueryState } from "nuqs"
import { useCallback, useMemo } from "react"

export const GROUP_SIZE_OPTIONS = [
  { value: "1", label: "SOLO" },
  { value: "2", label: "DUO" },
  { value: "4", label: "SQUAD" },
  { value: "6", label: "SEXTET" },
  { value: "8", label: "OCTET" },
  { value: "10", label: "CREW" },
]

export function useAdminTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  )

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  )

  const [groupSizeFilter, setGroupSizeFilter] = useQueryState(
    "groupSize",
    searchParams.groupSize.withOptions({ shallow: false }).withDefault("")
  )

  const resetFilters = useCallback(() => {
    setSearchQuery(null)
    setGroupSizeFilter("")
    setPage(1)
  }, [setSearchQuery, setGroupSizeFilter, setPage])

  const isAnyFilterActive = useMemo(() => {
    return Boolean(searchQuery || groupSizeFilter || page !== 1)
  }, [searchQuery, groupSizeFilter, page])

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    groupSizeFilter,
    setGroupSizeFilter,
  }
}
