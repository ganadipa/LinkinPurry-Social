import { AuthContext } from "@/contexts/auth-context";
import { User } from "@/types/user";
import { useContext, useEffect, useState } from "react";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
