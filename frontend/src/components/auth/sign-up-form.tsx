import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
import {
  RegistrationFormValues,
  registrationFormSchema,
} from "@/schemas/auth/sign-up-form.schema";
import toast from "react-hot-toast";
import { redirect } from "@/lib/utils";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      username: "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    const toastId = toast.loading("Creating account...");
    const resp = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await resp.json();
    if (!resp.ok) {
      toast.dismiss(toastId);
      toast.error(data.message);
      return;
    } else {
      toast.dismiss(toastId);
      toast.success("Account created successfully");
      toast.loading("Redirecting to login page...");
      setTimeout(() => {
        redirect({
          to: "/signin",
        });
      }, 2000);
    }
  };

  return (
    <Card className="w-full max-w-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center text-[#0a66c2]">
          Create Account
        </CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Fill in to make an account at LinkinPurry
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter username"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email"
                        {...field}
                        className="focus:border-[#0a66c2] focus:ring-[#0a66c2]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter full name"
                      {...field}
                      className="focus:border-[#0a66c2] focus:ring-[#0a66c2]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="Enter password"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          {...field}
                          className="focus:border-[#0a66c2] focus:ring-[#0a66c2] pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
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
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white"
            >
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
