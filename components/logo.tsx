import Image from "next/image"
import Link from "next/link"

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={`inline-block ${className}`}>
      <Image
        src="/images/sidebarImage.png" // Using the uploaded logo
        alt="Seoul Mirage Logo"
        width={150}
        height={50}
        priority
        className="object-contain"
      />
    </Link>
  )
}
