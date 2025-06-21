"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import AuthLayout from "@/components/auth-layout"
import { useState } from "react"

const newPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  })

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>

export default function NewPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })
 
  const onSubmit = async (data: NewPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("New password set:", data.newPassword)
    toast({
      title: "Password Reset Successful",
      description: "Your password has been updated. Please login.",
    })
    router.push("/login")
  }

  return (
    <AuthLayout title="Reset password" subtitle="Enter your new password">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="sr-only">
            New Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-brand-gray" aria-hidden="true" />
            </div>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              {...form.register("newPassword")}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-gray hover:text-brand-text-dark"
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {form.formState.errors.newPassword && (
            <p className="mt-2 text-xs text-red-600">{form.formState.errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-brand-gray" aria-hidden="true" />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...form.register("confirmPassword")}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-gray hover:text-brand-text-dark"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="mt-2 text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-brand-black text-brand-white hover:bg-brand-black/90"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Continuing..." : "Continue"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
