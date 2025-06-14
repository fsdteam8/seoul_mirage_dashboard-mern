"use client";

import { CalendarDays, Package, CreditCard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { OrderDetailApiResponse } from "@/types/OrderShowDataType";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface OrderDetailsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderId: string;
}

export default function OrderDetails({
  open,
  setOpen,
  orderId,
}: OrderDetailsProps) {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const { data, error, isLoading } = useQuery<OrderDetailApiResponse>({
    queryKey: ["orderDetails", orderId],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
  });

  const order = data?.data;
  console.log(error);
  console.log(isLoading);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order?.id}
          </DialogTitle>
          <DialogDescription>
            Complete order details and information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order Information</span>
                <Badge className={getStatusColor(order?.status ?? "")}>
                  {order?.status
                    ? order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)
                    : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Order Date</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order?.created_at ?? "")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          {order?.products?.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>Product: {product.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      product.image ? `/${product.image}` : "/placeholder.svg"
                    }
                    alt={product.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                    <Badge variant="secondary">{product.category_id}</Badge>
                    <p className="text-sm">
                      Price: ${product.price} | Quantity:{" "}
                      {product.pivot?.quantity}
                    </p>
                    <p className="font-semibold">
                      Total: $
                      {(
                        parseFloat(product.price) *
                        (product.pivot?.quantity ?? 1)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>
                <CreditCard className="h-4 w-4 inline mr-2" />
                Payment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order?.shipping_price}</span>
              </div>
              <div className="flex justify-between">
                <span>Summary</span>
                <span>{order?.order_summary}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${order?.total}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-sm text-muted-foreground">
                  Payment Method
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{order?.payment_method}</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    {order?.payment_status ?? ""
                      ? order &&
                        order?.payment_status?.charAt(0).toUpperCase() +
                          order?.payment_status?.slice(1)
                      : ""}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promocode */}
          {order?.promocode && (
            <Card>
              <CardHeader>
                <CardTitle>Promocode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.promocode.name}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline">Print Order</Button>
            <Button variant="outline">Download Invoice</Button>
            <Button>Track Package</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
