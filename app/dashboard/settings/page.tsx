"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const generalSettingsSchema = z.object({
  supportEmail: z.string().email("Invalid email address").min(1, "Support email is required"),
})
type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>

const securitySettingsSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  })
type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>

// Simulated server actions
async function updateGeneralSettings(data: GeneralSettingsFormValues) {
  console.log("Updating general settings:", data)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // Simulate success/failure
  if (data.supportEmail.includes("fail")) {
    return { success: false, message: "Failed to update support email (simulated)." }
  }
  return { success: true, message: "Support email updated successfully!" }
}

async function changePassword(data: SecuritySettingsFormValues) {
  console.log("Changing password for:", data) // Don't log passwords in real apps
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (data.currentPassword === "password123") {
    // Simulate correct current password
    return { success: true, message: "Password changed successfully!" }
  }
  return { success: false, message: "Incorrect current password (simulated)." }
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [isGeneralSubmitting, setIsGeneralSubmitting] = useState(false)
  const [isSecuritySubmitting, setIsSecuritySubmitting] = useState(false)

  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      supportEmail: "support@seoulmirage.com", // Default or fetched value
    },
  })

  const securityForm = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onGeneralSubmit = async (data: GeneralSettingsFormValues) => {
    setIsGeneralSubmitting(true)
    const result = await updateGeneralSettings(data)
    toast({
      title: result.success ? "Settings Updated" : "Update Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    })
    setIsGeneralSubmitting(false)
  }

  const onSecuritySubmit = async (data: SecuritySettingsFormValues) => {
    setIsSecuritySubmitting(true)
    const result = await changePassword(data)
    toast({
      title: result.success ? "Password Changed" : "Change Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    })
    if (result.success) {
      securityForm.reset()
    }
    setIsSecuritySubmitting(false)
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-brand-text-dark">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Manage your general application settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" {...generalForm.register("supportEmail")} />
              {generalForm.formState.errors.supportEmail && (
                <p className="text-xs text-red-500 mt-1">{generalForm.formState.errors.supportEmail.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isGeneralSubmitting}
              className="bg-brand-black text-brand-white hover:bg-brand-black/90"
            >
              {isGeneralSubmitting ? "Saving..." : "Save General Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="currentPassword">Currently Password</Label>
              <Input id="currentPassword" type="password" {...securityForm.register("currentPassword")} />
              {securityForm.formState.errors.currentPassword && (
                <p className="text-xs text-red-500 mt-1">{securityForm.formState.errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" {...securityForm.register("newPassword")} />
              {securityForm.formState.errors.newPassword && (
                <p className="text-xs text-red-500 mt-1">{securityForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...securityForm.register("confirmPassword")} />
              {securityForm.formState.errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{securityForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSecuritySubmitting}
              className="bg-brand-black text-brand-white hover:bg-brand-black/90"
            >
              {isSecuritySubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
