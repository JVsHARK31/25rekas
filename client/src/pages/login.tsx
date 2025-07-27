import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast({
        title: "Login berhasil",
        description: "Selamat datang di RKAS Jakarta",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Login gagal",
        description: "Email atau password salah",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-white space-y-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">RKAS Jakarta</h1>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold">SMPN 25 Jakarta</h2>
              <p className="text-xl text-blue-100">Sistem Rencana Kegiatan dan Anggaran Sekolah</p>
              <p className="text-lg text-blue-200">Pemerintah Provinsi DKI Jakarta</p>
            </div>
          </div>
          
          <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg p-6 border border-blue-600/30">
            <h3 className="text-xl font-semibold mb-3">Masuk ke Sistem RKAS</h3>
            <p className="text-blue-100 leading-relaxed">
              Sistem Rencana Kegiatan dan Anggaran Sekolah DKI Jakarta
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              25
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-900">
                Masuk ke Sistem RKAS
              </CardTitle>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-800">
                  <strong>Sistem Demo:</strong> Aplikasi berjalan dalam mode demo dengan data simulasi SMPN 25 Jakarta.
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email / Username
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="mt-1 h-11"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  className="mt-1 h-11"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk ke Sistem"}
              </Button>
            </form>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">
                Kredensial Demo SMPN 25 Jakarta:
              </p>
              <div className="space-y-1 text-sm text-slate-600">
                <p><strong>Email:</strong> admin@rkas.com</p>
                <p><strong>Password:</strong> 123456</p>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 border-t pt-4">
              <p>© 2024 Pemerintah Provinsi DKI Jakarta</p>
              <p className="mt-1">Dinas Pendidikan DKI Jakarta</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}