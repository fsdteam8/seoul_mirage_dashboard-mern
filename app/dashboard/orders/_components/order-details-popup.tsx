"use client";

import {
  CalendarDays,
  Package,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";

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

// Sample order data based on your product structure
const orderData = {
  id: "ORD-2024-001",
  status: "delivered",
  orderDate: "2025-06-13T12:09:37.000000Z",
  deliveryDate: "2025-06-15T14:30:00.000000Z",
  customer: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  },
  shippingAddress: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  product: {
    id: 4,
    name: "realme c20",
    description: "realme",
    image: null,
    price: "100.00",
    category_id: 1,
    status: "active",
    cost_price: "159",
    stock_quantity: 3,
    created_at: "2025-06-13T12:09:37.000000Z",
    updated_at: "2025-06-13T12:33:59.000000Z",
    category: {
      id: 1,
      name: "Electronics",
      description: "Explore our wide selection of electronics.",
      type: "Products",
      image: null,
      created_at: "2025-06-13T11:55:27.000000Z",
      updated_at: "2025-06-13T11:55:27.000000Z",
    },
  },
  quantity: 2,
  subtotal: 200.0,
  shipping: 15.0,
  tax: 17.25,
  total: 232.25,
  paymentMethod: "Credit Card",
  paymentStatus: "paid",
};

interface OrderDetailsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function OrderDetails({ open, setOpen }: OrderDetailsProps) {
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
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order {orderData.id}
            </DialogTitle>
            <DialogDescription>
              Complete order details and information
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Order Status and Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Information</span>
                  <Badge className={getStatusColor(orderData.status)}>
                    {orderData.status.charAt(0).toUpperCase() +
                      orderData.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Order Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(orderData.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Delivery Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(orderData.deliveryDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={
                        orderData.product.image ||
                        "/placeholder.svg?height=80&width=80&query=smartphone"
                      }
                      alt={orderData.product.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold">
                        {orderData.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {orderData.product.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">
                        {orderData.product.category.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        SKU: {orderData.product.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm">
                          Quantity: {orderData.quantity}
                        </span>
                        <span className="text-sm">
                          Price: ${orderData.product.price}
                        </span>
                      </div>
                      <span className="font-semibold">
                        $
                        {(
                          Number.parseFloat(orderData.product.price) *
                          orderData.quantity
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="font-medium">{orderData.customer.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{orderData.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{orderData.customer.phone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p>{orderData.shippingAddress.street}</p>
                    <p>
                      {orderData.shippingAddress.city},{" "}
                      {orderData.shippingAddress.state}{" "}
                      {orderData.shippingAddress.zipCode}
                    </p>
                    <p>{orderData.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${orderData.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${orderData.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${orderData.total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-muted-foreground">
                    Payment Method
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{orderData.paymentMethod}</span>
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      {orderData.paymentStatus.charAt(0).toUpperCase() +
                        orderData.paymentStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button variant="outline">Print Order</Button>
              <Button variant="outline">Download Invoice</Button>
              <Button>Track Package</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
