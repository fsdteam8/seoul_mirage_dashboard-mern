"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/auth-layout";

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Reset password email:", data.email);
    toast({
      title: "OTP Sent",
      description: "An OTP has been sent to your email address.",
    });
    // Typically, you'd navigate to an OTP entry page or a page to set new password if OTP is handled differently
    router.push("/reset-password/confirm");
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email to receive the OTP"
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
          <Button
            type="submit"
            className="w-full bg-brand-black text-brand-white hover:bg-brand-black/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
