import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/provider/AuthProvider";
import { Providers } from "@/components/provider/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seoul Mirage Dashboard",
  description: "Dashboard for Seoul Mirage",
   icons:{
    icon:"/Design-sans-titre.svg"
   }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
        <Providers>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </Providers>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
