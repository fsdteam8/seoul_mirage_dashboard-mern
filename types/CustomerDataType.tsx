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
  created_at: string;
  updated_at: string;
  orders_count:string
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface CustomerApiResponse {
  success: boolean;
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
  data: {
    current_page: number;
    data: Customer[];
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
  };
}
