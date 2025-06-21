export interface ProductPivot {
  order_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductMedia {
  id: number;
  product_id: number;
  file_path: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string | null; // nullable based on your data
  price: string;
  category_id: number;
  status: string;
  cost_price: string;
  stock_quantity: number;
  sales: number;
  created_at: string;
  updated_at: string;
  pivot: ProductPivot;
  media: ProductMedia[]; // ✅ added media array
}

export interface Promocode {
  id: number;
  name: string;
}

export interface Customer {
  id: number;
  full_name: string;
  last_name: string;
  email: string;
  phone: string;
  full_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderDetailData {
  id: number;
  uniq_id: string;
  customer_id: number;
  type: string;
  items: number;
  status: string;
  shipping_method: string;
  shipping_price: string;
  order_summary: string | null;
  payment_method: string;
  payment_status: string;
  promocode_id: number | null;
  promocode_name: string | null; // ✅ added fallback field
  total: string;
  created_at: string;
  updated_at: string;
  products: Product[];
  promocode: Promocode | null; // ✅ can be null
  customer: Customer; // ✅ added customer
}

export interface OrderDetailApiResponse {
  success: boolean;
  message: string;
  data: OrderDetailData;
}
