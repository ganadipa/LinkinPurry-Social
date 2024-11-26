import { loginResponse } from "@/types/response";
import { User } from "@/types/user";
import React, { useEffect, useState } from "react";

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (
    identifier: string,
    password: string
  ) => Promise<{
    ok: boolean;
    message: string;
  }>;
  logout: () => Promise<{
    ok: boolean;
    message: string;
  }>;
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
    const expected = loginResponse.safeParse(json);
    if (expected.success) {
      setUser(json);
      setIsLoading(false);
      return {
        ok: true,
        message: expected.data.message,
      };
    } else {
      return {
        ok: false,
        message: "Something went wrong",
      };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    const resp = await fetch("/api/logout", {
      method: "POST",
    });

    if (resp.ok) {
      setUser(null);
      setIsLoading(false);
      return {
        ok: true,
        message: "Successfully logged out",
      };
    } else {
      return {
        ok: false,
        message: "Something went wrong",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
