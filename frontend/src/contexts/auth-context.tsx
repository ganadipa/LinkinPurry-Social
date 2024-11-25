import { User } from "@/types/user";
import React, { useEffect, useState } from "react";

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/me");
      if (response.ok) {
        const userData = (await response.json()) as {
          success: boolean;
          message: string;
          body: User | null;
        };

        setUser(userData.body);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    const json = await response.json();
    if (response.ok) {
      setUser(json);
      setIsLoading(false);
    } else {
      throw new Error(json.message);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await fetch("/api/logout", {
      method: "POST",
    });

    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
