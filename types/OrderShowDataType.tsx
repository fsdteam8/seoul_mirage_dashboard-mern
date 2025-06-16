export interface ProductPivot {
  order_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  category_id: number;
  status: string;
  cost_price: string;
  stock_quantity: number;
  sales: number;
  created_at: string;
  updated_at: string;
  pivot: ProductPivot;
}

export interface Promocode {
  id: number;
  name: string;
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
  order_summary: string;
  payment_method: string;
  payment_status: string;
  promocode_id: number;
  total: string;
  created_at: string;
  updated_at: string;
  products: Product[];
  promocode: Promocode;
}

export interface OrderDetailApiResponse {
  success: boolean;
  message: string;
  data: OrderDetailData;
}
