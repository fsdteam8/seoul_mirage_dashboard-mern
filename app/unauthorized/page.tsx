"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, Home, User, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-xl animate-bounce delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-bounce delay-500"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-lg w-full">
          {/* Main content */}
          <div className="text-center space-y-8">
            {/* Lock icon with glow effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gray-900 to-black border border-red-500/50 rounded-full w-24 h-24 mx-auto flex items-center justify-center">
                <Lock className="w-12 h-12 text-red-400" />
              </div>
            </div>

            {/* Error code with glitch effect */}
            <div className="space-y-4">
              <h1 className="text-8xl font-black bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                401
              </h1>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">ACCESS DENIED</h2>
                <div className="flex items-center justify-center gap-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-lg font-mono">
                    UNAUTHORIZED_REQUEST
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                Your security clearance is insufficient to access this
                classified area. Authentication required to proceed.
              </p>

              {/* Status bar */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">STATUS:</span>
                  <span className="text-red-400 font-bold">UNAUTHORIZED</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">CODE:</span>
                  <span className="text-yellow-400">HTTP_401</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">ACTION:</span>
                  <span className="text-green-400">LOGIN_REQUIRED</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4 pt-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 border border-purple-500/50"
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-3"
                >
                  <User className="w-5 h-5" />
                  AUTHENTICATE
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-800/50"
              >
                <Link
                  href="/"
                  className="flex items-center justify-center gap-3"
                >
                  <Home className="w-5 h-5" />
                  RETURN HOME
                </Link>
              </Button>
              <Button
                onClick={() => signOut()}
                asChild
                variant="outline"
                className="w-full bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-gray-800/50"
              >
                <div
                  className="flex items-center justify-center gap-3"
                >
                  <Home className="w-5 h-5" />
                 Log Out
                </div>
              </Button>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-gray-800">
              <p className="text-gray-500 text-sm font-mono">
                SYSTEM_ID:{" "}
                {Math.random().toString(36).substr(2, 9).toUpperCase()} |
                <span className="text-cyan-400 ml-2">
                  SECURITY_LEVEL_REQUIRED
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
