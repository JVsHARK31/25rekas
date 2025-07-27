"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Eye, EyeOff, Shield } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("admin@rkas.com")
  const [password, setPassword] = useState("123456")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        console.log("Login successful for user:", data.user.email)
      } else {
        setError("Login gagal. Silakan coba lagi.")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Terjadi kesalahan saat login. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Masuk ke Sistem RKAS</CardTitle>
            <CardDescription className="text-green-100">
              Sistem Rencana Kegiatan dan Anggaran Sekolah DKI Jakarta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="border-green-200 bg-green-50">
            <Info className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Sistem Demo:</strong> Aplikasi berjalan dalam mode demo dengan data simulasi SMPN 25 Jakarta.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email / Username
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Masukkan email atau username"
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="Masukkan password"
                className="border-gray-300 focus:border-green-500 focus:ring-green-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Memproses...
              </div>
            ) : (
              "Masuk ke Sistem"
            )}
          </Button>

          <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="font-medium mb-2 text-blue-800">Kredensial Demo SMPN 25 Jakarta:</p>
            <div className="space-y-1">
              <p>
                <strong>Email:</strong> admin@rkas.com
              </p>
              <p>
                <strong>Password:</strong> 123456
              </p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 pt-4 border-t">
            <p>© 2024 Pemerintah Provinsi DKI Jakarta</p>
            <p>Dinas Pendidikan DKI Jakarta</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
