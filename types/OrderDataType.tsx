export interface Promocode {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  uniq_id: string;
  full_name: string;
  last_name: string;
  email: string;
  phone: string;
  full_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  items:string
  type: string;

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
  promocode: Promocode;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedOrderData {
  current_page: number;
  data: Order[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface OrdersApiResponse {
  success: boolean;
  data: PaginatedOrderData;
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}
