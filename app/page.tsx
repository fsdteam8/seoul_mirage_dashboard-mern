"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session?.user?.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/unauthorized");
      }
    }
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000);
  }, [status, session, router]);


  return (
    <div className="flex h-screen items-center justify-center bg-brand-bg-light">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Seoul Mirage Dashboard
        </h1>
        <p className="text-lg mb-6">
          This is the dashboard for managing your Seoul Mirage application.
        </p>
        <Link href={"/dashboard"}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
