import { redirect as red } from "@tanstack/react-router";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirect({ to }: { to: string }) {
  red({ to });
  window.location.href = to;
}
