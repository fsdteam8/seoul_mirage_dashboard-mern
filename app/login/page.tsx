"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/auth-layout";
import { useState } from "react";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl:"/dashboard"
      });
      if (!res?.ok) {
        toast({
          title: (res && res.error) || "Login Failed",
          description: res?.error || "An error occurred during login.",
          variant: "destructive",
        });
        return;
      }

      // add rotue push 
      setTimeout(() => {
  router.push("/dashboard");
}, 100); // 100ms delay
      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
        variant: "default",
      });

    } catch {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Please enter your credentials to continue"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-brand-gray" aria-hidden="true" />
            </div>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              {...form.register("email")}
              className="pl-10"
            />
          </div>
          {form.formState.errors.email && (
            <p className="mt-2 text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-brand-gray" aria-hidden="true" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your Password"
              {...form.register("password")}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-gray hover:text-brand-text-dark"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="mt-2 text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox id="remember-me" {...form.register("rememberMe")} />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-brand-text-dark"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              href="/reset-password"
              className="font-medium text-brand-pink hover:text-brand-pink/80"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-brand-black text-brand-white hover:bg-brand-black/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
