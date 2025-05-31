import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  description?: string
}

export function StatCard({ title, value, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-brand-text-dark">{title}</CardTitle>
        <Icon className="h-5 w-5 text-brand-gray" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-brand-black">{value}</div>
        {description && <p className="text-xs text-brand-gray">{description}</p>}
      </CardContent>
    </Card>
  )
}
