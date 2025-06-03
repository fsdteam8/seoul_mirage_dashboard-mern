"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const generalSettingsSchema = z.object({
  supportEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Support email is required"),
});
type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

const securitySettingsSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  });
type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;

// Simulated server actions
async function updateGeneralSettings(data: GeneralSettingsFormValues) {
  console.log("Updating general settings:", data);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Simulate success/failure
  if (data.supportEmail.includes("fail")) {
    return {
      success: false,
      message: "Failed to update support email (simulated).",
    };
  }
  return { success: true, message: "Support email updated successfully!" };
}

async function changePassword(data: SecuritySettingsFormValues) {
  console.log("Changing password for:", data); // Don't log passwords in real apps
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (data.currentPassword === "password123") {
    // Simulate correct current password
    return { success: true, message: "Password changed successfully!" };
  }
  return { success: false, message: "Incorrect current password (simulated)." };
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [isGeneralSubmitting, setIsGeneralSubmitting] = useState(false);
  const [isSecuritySubmitting, setIsSecuritySubmitting] = useState(false);

  const generalForm = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      supportEmail: "support@seoulmirage.com", // Default or fetched value
    },
  });

  const securityForm = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onGeneralSubmit = async (data: GeneralSettingsFormValues) => {
    setIsGeneralSubmitting(true);
    const result = await updateGeneralSettings(data);
    toast({
      title: result.success ? "Settings Updated" : "Update Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    setIsGeneralSubmitting(false);
  };

  const onSecuritySubmit = async (data: SecuritySettingsFormValues) => {
    setIsSecuritySubmitting(true);
    const result = await changePassword(data);
    toast({
      title: result.success ? "Password Changed" : "Change Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    if (result.success) {
      securityForm.reset();
    }
    setIsSecuritySubmitting(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-brand-text-dark">Settings</h2>

      <Card className="shadow-[0px_4px_12px_0px_#0000001A] border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold leading-[120%]">
            General
          </CardTitle>
          {/* <CardDescription>Manage your general application settings.</CardDescription> */}
        </CardHeader>
        <CardContent className="">
          <form
            onSubmit={generalForm.handleSubmit(onGeneralSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              <Label
                htmlFor="supportEmail"
                className="w-40 text-base font-normal leading-[120%]"
              >
                Support Email:
              </Label>
              <Input
                id="supportEmail"
                placeholder="support@seoulmirage.com"
                type="email"
                className="flex-1 w-full"
                {...generalForm.register("supportEmail")}
              />
            </div>
            {generalForm.formState.errors.supportEmail && (
              <p className="text-xs text-red-500 mt-1 ml-44">
                {generalForm.formState.errors.supportEmail.message}
              </p>
            )}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isGeneralSubmitting}
                className="bg-brand-black text-brand-white hover:bg-brand-black/90"
              >
                {isGeneralSubmitting ? "Saving..." : "Save General Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-[0px_4px_12px_0px_#0000001A] border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold leading-[120%]">
            Security
          </CardTitle>
          {/* <CardDescription>Manage your account password.</CardDescription> */}
        </CardHeader>
        <CardContent>
          <form
            onSubmit={securityForm.handleSubmit(onSecuritySubmit)}
            className="space-y-4"
          >
            {/* Current Password */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="currentPassword"
                className="w-40 text-base font-normal leading-[120%]"
              >
                Current Password:
              </Label>
              <Input
                id="currentPassword"
                placeholder="password123"
                type="password"
                className="flex-1 w-full"
                {...securityForm.register("currentPassword")}
              />
            </div>
            {securityForm.formState.errors.currentPassword && (
              <p className="text-xs text-red-500 mt-1 ml-44">
                {securityForm.formState.errors.currentPassword.message}
              </p>
            )}

            {/* New Password */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="newPassword"
                className="w-40 text-base font-normal leading-[120%]"
              >
                New Password:
              </Label>
              <Input
                id="newPassword"
                placeholder="password123"
                type="password"
                className="flex-1 w-full h-[49px]"
                {...securityForm.register("newPassword")}
              />
            </div>
            {securityForm.formState.errors.newPassword && (
              <p className="text-xs text-red-500 mt-1 ml-44">
                {securityForm.formState.errors.newPassword.message}
              </p>
            )}

            {/* Confirm Password */}
            <div className="flex items-center gap-4">
              <Label
                htmlFor="confirmPassword"
                className="w-40 text-base font-normal leading-[120%]"
              >
                Confirm Password:
              </Label>
              <Input
                id="confirmPassword"
                placeholder="password123"
                type="password"
                className="flex-1 w-full h-[49px]"
                {...securityForm.register("confirmPassword")}
              />
            </div>
            {securityForm.formState.errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 ml-44">
                {securityForm.formState.errors.confirmPassword.message}
              </p>
            )}

            {/* Submit Button aligned right */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSecuritySubmitting}
                className="bg-brand-black text-brand-white hover:bg-brand-black/90"
              >
                {isSecuritySubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
