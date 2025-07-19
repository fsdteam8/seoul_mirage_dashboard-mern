// export interface ProductPivot {
//   order_id: number;
//   product_id: number;
//   quantity: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface ProductMedia {
//   id: number;
//   product_id: number;
//   file_path: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   image: string | null; // nullable based on your data
//   price: string;
//   category_id: number;
//   status: string;
//   cost_price: string;
//   stock_quantity: number;
//   sales: number;
//   created_at: string;
//   updated_at: string;
//   pivot: ProductPivot;
//   media: ProductMedia[]; // ✅ added media array
// }

// export interface Promocode {
//   id: number;
//   name: string;
// }

// export interface Customer {
//   id: number;
//   full_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   full_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface OrderDetailData {
//   id: number;
//   uniq_id: string;
//   customer_id: number;
//   type: string;
//   items: number;
//   status: string;
//   shipping_method: string;
//   shipping_price: string;
//   order_summary: string | null;
//   payment_method: string;
//   payment_status: string;
//   promocode_id: number | null;
//   promocode_name: string | null; // ✅ added fallback field
//   total: string;
//   created_at: string;
//   updated_at: string;
//   products: Product[];
//   promocode: Promocode | null; // ✅ can be null
//   customer: Customer; // ✅ added customer
// }

// export interface OrderDetailApiResponse {
//   success: boolean;
//   message: string;
//   data: OrderDetailData;
// }


// export interface ProductPivot {
//   order_id: number;
//   product_id: number;
//   quantity: number;
//   created_at: string;
//   updated_at: string;
// }

// export interface ProductMedia {
//   id: number;
//   product_id: number;
//   file_path: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface Product {
//   id: number;
//   name: string;
//   description: string;
//   image: string | null;
//   price: string;
//   category_id: number;
//   status: "active" | "low_stock" | "out_of_stock" | string; // better enum handling
//   cost_price: string;
//   stock_quantity: number;
//   sales: number;
//   created_at: string;
//   updated_at: string;
//   pivot?: ProductPivot; // ✅ made optional in case it's not always returned
//   media: ProductMedia[];
// }

// export interface Promocode {
//   id: number;
//   name: string;
// }

// export interface Customer {
//   id: number;
//   role:string
//   full_name: string;
//   name:string
//   last_name: string;
//   email: string;
//   phone: string;
//   full_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   status: "active" | "inactive" | string;
//   created_at: string;
//   updated_at: string;
// }

// export interface OrderDetailData {
//   id: number;
//   uniq_id: string;
//   customer_id: number;
//   type: "online" | "offline" | string;
//   items: number;
//   status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | string;
//   shipping_method: string;
//   shipping_price: string;
//   order_summary: string | null;
//   payment_method: "cash" | "card" | "online" | string;
//   payment_status: "paid" | "unpaid" | "refunded" | string;
//   promocode_id: number | null;
//   promocode_name: string | null;
//   total: string;
//   createdAt: string;
//   updated_at: string;
//   _id:number
//   products: Product[];
//   promocode: Promocode | null;
//   customer: Customer;
// }

// export interface OrderDetailApiResponse {
//   success: boolean;
//   message: string;
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
  status: string; // e.g. "available"
  arrival_status: string; // e.g. "regular"
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
