"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LoginForm } from "@/components/auth/login-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (mounted) {
          setUser(user)
          setLoading(false)

          if (user) {
            router.push("/dashboard")
          }
        }
      } catch (error) {
        console.error("Error checking user:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
        router.push("/dashboard")
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/")
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Memuat Sistem RKAS Jakarta...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Mengarahkan ke dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">R</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">RKAS Jakarta</h1>
            <h2 className="text-xl font-semibold text-green-700 mb-1">SMPN 25 Jakarta</h2>
            <p className="text-gray-600">Sistem Rencana Kegiatan dan Anggaran Sekolah</p>
            <p className="text-sm text-green-600 mt-2">Pemerintah Provinsi DKI Jakarta</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
