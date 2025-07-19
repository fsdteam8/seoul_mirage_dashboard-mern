// "use client";

// import { useRef } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import html2pdf from "html2pdf.js";

// import Image from "next/image";
// import { CalendarDays, Package, CreditCard, User } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { OrderDetailApiResponse } from "@/types/OrderShowDataType";

// interface OrderDetailsProps {
//   open: boolean;
//   setOpen: (open: boolean) => void;
//   orderId: string;
// }

// export default function OrderDetails({
//   open,
//   setOpen,
//   orderId,
// }: OrderDetailsProps) {
//   const { data: session } = useSession();
//   const token = session?.accessToken ?? "";
//   const printRef = useRef<HTMLDivElement>(null);

//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "delivered":
//         return "bg-green-100 text-green-800 hover:bg-green-100";
//       case "shipped":
//         return "bg-blue-100 text-blue-800 hover:bg-blue-100";
//       case "processing":
//         return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
//       case "cancelled":
//         return "bg-red-100 text-red-800 hover:bg-red-100";
//       default:
//         return "bg-gray-100 text-gray-800 hover:bg-gray-100";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const { data, error, isLoading } = useQuery<OrderDetailApiResponse>({
//     queryKey: ["orderDetails", orderId],
//     queryFn: async () => {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (!res.ok) throw new Error("Failed to fetch order");
//       return res.json();
//     },
//   });

//   const order = data?.data;
// console.log(order)
//   const handlePrint = () => {
//     if (printRef.current) {
//       const printContents = printRef.current.innerHTML;
//       const printWindow = window.open("", "", "height=600,width=800");
//       if (printWindow) {
//         printWindow.document.write("<html><head><title>Order Print</title>");
//         printWindow.document.write("</head><body>");
//         printWindow.document.write(printContents);
//         printWindow.document.write("</body></html>");
//         printWindow.document.close();
//         printWindow.focus();
//         printWindow.print();
//         printWindow.close();
//       }
//     }
//   };

//   const handleDownloadPdf = () => {
//     if (printRef.current) {
//       html2pdf()
//         .from(printRef.current)
//         .set({
//           margin: 0.5,
//           filename: `order-${order?.id}.pdf`,
//           image: { type: "jpeg", quality: 0.98 },
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
//         })
//         .save();
//     }
//   };

//   if (isLoading) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Loading Order Details...</DialogTitle>
//           </DialogHeader>
//           <div className="py-6 text-center text-muted-foreground">
//             Fetching order information. Please wait...
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   if (error) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Error Loading Order</DialogTitle>
//           </DialogHeader>
//           <div className="py-6 text-center text-red-500">
//             Failed to load order details. Please try again later.
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Package className="h-5 w-5" />
//             Order #{order?.id}
//           </DialogTitle>
//           <DialogDescription>
//             Complete order details and information.
//           </DialogDescription>
//         </DialogHeader>

//         <div ref={printRef} className="grid gap-6">
//           {/* Order Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Order Information</span>
//                 <Badge className={getStatusColor(order?.status ?? "")}>
//                   {order?.status
//                     ? order.status.charAt(0).toUpperCase() +
//                       order.status.slice(1)
//                     : ""}
//                 </Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2 text-sm">
//               <div className="flex items-center gap-2">
//                 <CalendarDays className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="font-medium">Order Date</p>
//                   <p className="text-muted-foreground">
//                     {formatDate(order?.created_at ?? "")}
//                   </p>
//                 </div>
//               </div>
//               <p>Order ID: {order?.id}</p>
//               <p>Type: {order?.type}</p>
//               <p>Shipping Method: {order?.shipping_method}</p>
//               <p>Items: {order?.items}</p>
//               <p>
//                 Promocode:{" "}
//                 {order?.promocode?.name || order?.promocode_name || "N/A"}
//               </p>
//             </CardContent>
//           </Card>

//           {/* Customer Info */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Customer Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-1 text-sm">
//               <p>
//                 <strong>Name:</strong> {order?.customer?.full_name}{" "}
//                 {order?.customer?.last_name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {order?.customer?.email}
//               </p>
//               <p>
//                 <strong>Phone:</strong> {order?.customer?.phone}
//               </p>
//               <p>
//                 <strong>Address:</strong> {order?.customer?.full_address}
//               </p>
//               <p>
//                 <strong>City:</strong> {order?.customer?.city}
//               </p>
//               <p>
//                 <strong>State:</strong> {order?.customer?.state}
//               </p>
//               <p>
//                 <strong>Postal Code:</strong> {order?.customer?.postal_code}
//               </p>
//               <p>
//                 <strong>Country:</strong> {order?.customer?.country}
//               </p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 <Badge variant="outline">{order?.customer?.status}</Badge>
//               </p>
//             </CardContent>
//           </Card>

//           {/* Product Details */}
//           {order?.products?.map((product) => (
//             <Card key={product?.id}>
//               <CardHeader>
//                 <CardTitle>Product: {product?.name}</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <div className="flex items-start gap-4">
//                   <Image
//                     src={
//                       product?.media?.[0]?.file_path
//                         ? `${product?.media[0].file_path}`
//                         : "/placeholder.svg"
//                     }
//                     alt={product?.name}
//                     width={80}
//                     height={80}
//                     className="rounded-md object-cover"
//                   />
//                   <div className="flex-1 space-y-1 text-sm">
//                     <p className="text-muted-foreground">
//                       {product?.description}
//                     </p>
//                     <Badge variant="secondary">
//                       Category #{product?.category_id}
//                     </Badge>
//                     <p>
//                       Price: ${product?.price} | Quantity:{" "}
//                       {product?.pivot?.quantity}
//                     </p>
//                     <p className="font-semibold">
//                       Total: $
//                       {(
//                         parseFloat(product?.price) *
//                         (product?.pivot?.quantity ?? 1)
//                       ).toFixed(2)}
//                     </p>
//                     <p className="text-muted-foreground">
//                       Stock Status: {product?.status} | Stock Qty:{" "}
//                       {product?.stock_quantity}
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}

//           {/* Payment Summary */}
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 <CreditCard className="h-4 w-4 inline mr-2" />
//                 Payment Summary
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>${order?.shipping_price}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Summary</span>
//                 <span>{order?.order_summary ?? "N/A"}</span>
//               </div>
//               <Separator />
//               <div className="flex justify-between font-semibold text-lg">
//                 <span>Total</span>
//                 <span>${order?.total}</span>
//               </div>
//               <div className="flex justify-between pt-2">
//                 <span className="text-sm text-muted-foreground">
//                   Payment Method
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm">{order?.payment_method}</span>
//                   <Badge
//                     variant="outline"
//                     className="text-green-600 border-green-600"
//                   >
//                     {order?.payment_status
//                       ? order.payment_status.charAt(0).toUpperCase() +
//                         order.payment_status.slice(1)
//                       : ""}
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2 justify-end pt-4 print:hidden">
//           <Button variant="outline" onClick={handlePrint}>
//             Print Order
//           </Button>
//           <Button variant="outline" onClick={handleDownloadPdf}>
//             Download PDF
//           </Button>
//           {/* <Button>
//             <Truck className="h-4 w-4 mr-2" />
//             Track Package
//           </Button> */}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import html2pdf from "html2pdf.js";

import Image from "next/image";
import { CalendarDays, Package, CreditCard, User } from "lucide-react";
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
import { OrderDetailApiResponse } from "@/types/OrderShowDataType";

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
  const printRef = useRef<HTMLDivElement>(null);

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
      case "pending":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
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

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const printWindow = window.open("", "", "height=600,width=800");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Order Print</title>");
        printWindow.document.write("</head><body>");
        printWindow.document.write(printContents);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const handleDownloadPdf = () => {
    if (printRef.current) {
      html2pdf()
        .from(printRef.current)
        .set({
          margin: 0.5,
          filename: `order-${order?._id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save();
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Order Details...</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            Fetching order information. Please wait...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Loading Order</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-red-500">
            Failed to load order details. Please try again later.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order #{order?._id}
          </DialogTitle>
          <DialogDescription>
            Complete order details and information.
          </DialogDescription>
        </DialogHeader>

        <div ref={printRef} className="grid gap-6">
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
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Order Date</p>
                  <p className="text-muted-foreground">
                    {formatDate(order?.createdAt ?? "")}
                  </p>
                </div>
              </div>
              <p>Order ID: {order?._id}</p>
              <p>Type: {order?.type || "N/A"}</p>
              <p>Shipping Method: {order?.shipping_method || "N/A"}</p>
              <p>Items: {order?.items}</p>
              <p>
                Promocode:{" "}
                {order?.promocode_name || "N/A"}
              </p>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><strong>Name:</strong> {order?.customer?.name}</p>
              <p><strong>Email:</strong> {order?.customer?.email}</p>
              <p><strong>Phone:</strong> {order?.customer?.phone}</p>
              <p><strong>Address:</strong> {order?.customer?.full_address}</p>
              <p><strong>City:</strong> {order?.customer?.city}</p>
              <p><strong>State:</strong> {order?.customer?.state}</p>
              <p><strong>Postal Code:</strong> {order?.customer?.postal_code}</p>
              <p><strong>Country:</strong> {order?.customer?.country}</p>
              <p>
                <strong>Status:</strong>{" "}
                <Badge variant="outline">{order?.customer?.role}</Badge>
              </p>
            </CardContent>
          </Card>

          {/* Product Details */}
          {order?.products?.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Product: {item?.product?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-4">
                  <Image
                    src={
                      item?.product?.media?.[0]?.file_path ||
                      "/placeholder.svg"
                    }
                    alt={item?.product?.name}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      {item.product?.description}
                    </p>
                    <Badge variant="secondary">
                      Category #{item.product?.category_id}
                    </Badge>
                    <p>
                      Price: ${item.product?.price} | Quantity: {item.quantity}
                    </p>
                    <p className="font-semibold">
                      Total: ${(item.product?.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-muted-foreground">
                      Stock Status: {item.product?.status} | Stock Qty:{" "}
                      {item.product?.stock_quantity}
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
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order?.shipping_price}</span>
              </div>
              <div className="flex justify-between">
                <span>Summary</span>
                <span>{order?.order_summary ?? "N/A"}</span>
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
                    {order?.payment_status
                      ? order.payment_status.charAt(0).toUpperCase() +
                        order.payment_status.slice(1)
                      : ""}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            Print Order
          </Button>
          <Button variant="outline" onClick={handleDownloadPdf}>
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
