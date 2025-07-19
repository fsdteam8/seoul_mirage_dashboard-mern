"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type StatusType = "pending" | "cancelled" | "delivered";

const statusOptions: { value: StatusType; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
  { value: "delivered", label: "Delivered" },
];

export default function StatusCell({
  orderId,
  initialStatus,
}: {
  orderId: string;
  initialStatus: StatusType;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>(initialStatus);
  const queryClient = useQueryClient();
  const session = useSession()
  const { mutate, isPending } = useMutation({
    mutationFn: async (newStatus: StatusType) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders-status/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.accessToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      return res.json();
    },
    onSuccess: (_, newStatus) => {
      setStatus(newStatus);
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  // Map statuses to your className styles
  const getStatusBadgeClass = (status: StatusType) => {
    return status === "delivered"
      ? "bg-green-100 text-green-700 border-green-200"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : status === "cancelled"
      ? "bg-red-100 text-red-700 border-red-200"
      : "";
  };

  const getLabel = (status: StatusType) =>
    statusOptions.find((opt) => opt.value === status)?.label ?? status;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <span
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md border flex items-center gap-1",
                getStatusBadgeClass(status)
              )}
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : null}
              {getLabel(status)}
              <ChevronDown className="h-3 w-3 ml-1" />
            </span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[180px]">
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                status === option.value && "bg-muted"
              )}
              onClick={() => {
                if (status !== option.value) {
                  mutate(option.value);
                  setOpen(false);
                }
              }}
              disabled={isPending}
            >
              {status === option.value && <Check className="h-4 w-4" />}
              <span className={status === option.value ? "ml-0" : "ml-6"}>
                {option.label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
