

// export interface ProductMedia {
//   _id: string;
//   file_path: string;
//   alt: string;
//   order: number;
// }

// export interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   image: string | null;
//   media: ProductMedia[];
//   price: number;
//   category_id: string;
//   status: string; // e.g. "available"
//   arrival_status: string; // e.g. "regular"
//   cost_price: number;
//   stock_quantity: number;
//   sales: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface OrderedProduct {
//   product: Product;
//   quantity: number;
// }

// export interface Customer {
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   full_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   role: string;
//   image: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface OrderDetailData {
//   _id: string;
//   user_id: string;
//   type: string | null;
//   items: number;
//   status: string;
//   shipping_method: string | null;
//   shipping_price: number;
//   order_summary: string | null;
//   payment_method: string;
//   payment_status: string;
//   promocode_id: string | null;
//   promocode_name: string | null;
//   total: number;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   customer: Customer;
//   products: OrderedProduct[];
// }

// export interface OrderDetailApiResponse {
//   success: boolean;
//   data: OrderDetailData;
// }

export interface ProductMedia {
  _id: string;
  file_path: string;
  alt: string;
  order: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string | null;
  media: ProductMedia[];
  price: number;
  category_id: string;
  status: string;
  arrival_status: string;
  cost_price: number;
  stock_quantity: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderedProduct {
  product: Product;
  quantity: number;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  full_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  role: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// New type for parsed shipping_details JSON string
export interface ShippingDetails {
  firstName: string;
  email: string;
  phone: string;
  state: string;
  postal: string;
  country: string;
}

export interface OrderDetailData {
  _id: string;
  user_id: string;
  type: string | null;
  items: number;
  status: string;
  shipping_method: string | null;
  shipping_price: number;
  order_summary: string | null;
  payment_method: string;
  payment_status: string;
  promocode_id: string | null;
  promocode_name: string | null;
  shipping_details: string; // ❗️NOTE: This is still a JSON string, parse it into `ShippingDetails` where needed
  total: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  customer: Customer;
  products: OrderedProduct[];
}

export interface OrderDetailApiResponse {
  success: boolean;
  data: OrderDetailData;
}
