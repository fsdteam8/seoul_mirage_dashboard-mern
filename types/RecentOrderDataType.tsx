export interface OrdersResponse {
  success: boolean;
  data: PaginatedOrders;
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}

export interface PaginatedOrders {
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

export interface Order {
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
  promocode_id: number;
  total: string;
  created_at: string;
  updated_at: string;
  promocode: PromoCode;
  customer: Customer;
}

export interface PromoCode {
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

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}
