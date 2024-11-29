import { redirect as red } from "@tanstack/react-router";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirect({
  to,
  params,
}: {
  to: string;
  params?: Record<string, string>;
}) {
  red({ to, params });
  const query = new URLSearchParams(params).toString();
  window.location.href = `${to}?${query}`;
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
