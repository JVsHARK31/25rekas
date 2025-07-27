import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { School } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { login, isLoading, isAuthenticated } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@rkas.com",
      password: "123456",
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated) {
    return null;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      await login({ email: data.email, password: data.password });
      setLocation("/dashboard");
    } catch (error) {
      // Error is handled in the auth hook
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-erkas-primary rounded-xl flex items-center justify-center mb-6">
            <School className="text-white text-2xl" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">eRKAS Pro</h2>
          <p className="text-erkas-secondary">SMPN 25 Jakarta</p>
          <p className="text-sm text-slate-500">Sistem Manajemen Anggaran Sekolah</p>
        </div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="rounded-xl"
                    placeholder="admin@rkas.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    className="rounded-xl"
                    placeholder="••••••••"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    {...form.register("rememberMe")}
                  />
                  <Label htmlFor="remember-me" className="text-sm text-slate-700">
                    Ingat saya
                  </Label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-erkas-primary hover:text-blue-500">
                    Lupa password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-erkas-primary hover:bg-blue-700 text-white rounded-xl py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="erkas-loading" />
                ) : (
                  "Masuk"
                )}
              </Button>
            </form>

            <div className="text-center text-xs text-slate-500 mt-4">
              <p>Default Admin: admin@rkas.com / 123456</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
