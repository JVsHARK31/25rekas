"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface RKASFiltersProps {
  onFilter: (filters: any) => void
}

export function RKASFilters({ onFilter }: RKASFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    bidang: "all",
    year: "all",
    status: "all",
  })

  const [bidangOptions, setBidangOptions] = useState([])

  useEffect(() => {
    loadBidangOptions()
  }, [])

  // Use useCallback to memoize the filter function call
  const applyFilters = useCallback(() => {
    onFilter(filters)
  }, [filters, onFilter])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const loadBidangOptions = async () => {
    const { data } = await supabase.from("rkas_bidang").select("*").order("kode_bidang")
    if (data) setBidangOptions(data)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      bidang: "all",
      year: "all",
      status: "all",
    })
  }

  const hasActiveFilters =
    filters.search || filters.bidang !== "all" || filters.year !== "all" || filters.status !== "all"

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filter & Pencarian</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="w-full sm:w-auto bg-transparent">
            <X className="w-4 h-4 mr-2" />
            Hapus Filter
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari kegiatan..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Bidang Filter */}
        <Select value={filters.bidang} onValueChange={(value) => handleFilterChange("bidang", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Bidang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Bidang</SelectItem>
            {bidangOptions.map((bidang: any) => (
              <SelectItem key={bidang.kode_bidang} value={bidang.kode_bidang}>
                {bidang.kode_bidang} - {bidang.nama_bidang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {Array.from({ length: 9 }, (_, i) => 2023 + i).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Diajukan</SelectItem>
            <SelectItem value="approved">Disetujui</SelectItem>
            <SelectItem value="rejected">Ditolak</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-xs text-gray-500">Filter aktif:</span>
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Pencarian: "{filters.search}"
            </span>
          )}
          {filters.bidang !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Bidang: {filters.bidang}
            </span>
          )}
          {filters.year !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Tahun: {filters.year}
            </span>
          )}
          {filters.status !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
              Status: {filters.status}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
