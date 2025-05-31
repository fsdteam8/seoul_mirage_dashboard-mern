import type React from "react"
import { Logo } from "@/components/logo"

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Logo className="mx-auto h-16 w-auto" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-text-dark">{title}</h2>
          <p className="mt-2 text-center text-sm text-brand-gray">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
