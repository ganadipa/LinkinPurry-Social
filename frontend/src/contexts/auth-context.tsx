import { wait } from "@/lib/utils";
import { ErrorSchema } from "@/schemas/error.schema";
import { loginResponse } from "@/types/response";
import { User } from "@/types/user";
import React, { useEffect, useState } from "react";
import { NotificationService } from "@/lib/notification";

export interface AuthContext {
  user: User | null;
  isLoading: boolean;
  login: (
    identifier: string,
    password: string
  ) => Promise<{
    ok: boolean;
    message: string;
    user: User | null

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
        return userData.body
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    await wait(1000);

    const json = await response.json();
    const failureResponse = ErrorSchema.safeParse(json);
    if (failureResponse.success) {
      throw new Error(failureResponse.data.message);
    }

    const expectedSuccess = loginResponse.safeParse(json);
    if (expectedSuccess.success) {
      if (expectedSuccess.data.success) {
        setIsLoading(true);
        const usr = await checkAuth() ?? null;

        return {
          ok: true,
          message: "Successfully logged in",
          user: usr
        };
      }
    }

    throw new Error("Something went wrong");
  };

  const logout = async () => {
    const userId = user?.id;
    if (userId !== undefined) {
      const notificationService = NotificationService.getInstance(userId);
      if (await notificationService.isServiceWorkerRegistered()) {
        await notificationService.unsubscribeFromPush();
      } else {
        console.log("Not registered yet but let's just log out");
      }
    }

    NotificationService.resetInstance();

    const resp = await fetch("/api/logout", {
      method: "POST",
    });

    if (resp.ok) {
      setUser(null);
      return {
        ok: true,
        message: "Successfully logged out",
      };
    }

    throw new Error("Something went wrong");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
