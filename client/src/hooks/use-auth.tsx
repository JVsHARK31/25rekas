import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthService, AuthResponse, LoginCredentials } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: AuthResponse['user'] | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = AuthService.getToken();
      const savedUser = AuthService.getUser();

      if (token && savedUser) {
        try {
          // Verify token is still valid
          const response = await apiRequest('GET', '/api/auth/me');
          const userData = await response.json();
          setUser(userData);
          AuthService.setUser(userData);
        } catch (error) {
          // Token is invalid, clear auth
          AuthService.clearAuth();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      const authResponse: AuthResponse = await response.json();

      AuthService.setToken(authResponse.token);
      AuthService.setUser(authResponse.user);
      setUser(authResponse.user);

      toast({
        title: "Login berhasil",
        description: `Selamat datang, ${authResponse.user.fullName}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message || "Email atau password salah",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.clearAuth();
    setUser(null);
    toast({
      title: "Logout berhasil",
      description: "Sampai jumpa lagi!",
    });
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
