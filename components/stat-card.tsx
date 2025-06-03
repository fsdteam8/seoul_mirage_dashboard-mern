import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-4 pb-2">
        <CardTitle className="text-sm font-medium text-brand-text-dark">
          {title}
        </CardTitle>
        <Icon className="h-7 w-7 text-black" />
      </CardHeader>
      <CardContent className="mt-4">
        <div className="text-2xl font-bold text-brand-black">{value}</div>
      </CardContent>
    </Card>
  );
}
