import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { signInFormSchema } from "@/schemas/auth/sign-in-form.schema";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/auth";
import { redirect } from "@/lib/utils";
import { NotificationService } from "@/lib/notification";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const promise = login(values.identifier, values.password);
    toast.promise(promise, {
      loading: "Signing in...",
      success: (data) => data.message,
      error: (err) => err.message,
    });

    promise.then(async (result) => {
      if (result.ok) {
        const userId = result.user?.id;
        console.log('User ID AAAAAAAAA:', result.user?.id); // debug
        if (userId) {
            if (userId !== undefined) {
                const notificationService = NotificationService.getInstance(userId);
                console.log("Notification service:", notificationService); // debug
              try {
                  const subscription = await notificationService.subscribeToPush();
                  if (subscription) {
                    console.log(JSON.stringify(subscription)); // debug
                    await fetch("/api/notifications/subscribe", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(subscription),
                    });
                    console.log("Push subscription successful"); // debug
                  }
              } catch (error) {
                console.error("Failed to subscribe to push notifications:", error);
              }    
            }

        redirect({
          to: "/",
          });
        }
      }
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center text-[#0a66c2]">
          Sign in
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Sign in to LinkinPurry
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or username"
                      {...field}
                      className="focus:border-[#0a66c2] focus:ring-[#0a66c2]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="focus:border-[#0a66c2] focus:ring-[#0a66c2] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white"
            >
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
