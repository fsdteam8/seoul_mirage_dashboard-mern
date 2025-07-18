// export interface Customer {
//   id: number;
//   _id:string,
//   name:string
//   full_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   full_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   created_at: string;
//   updated_at: string;
//   orders_count: string;
//   orders_sum_total: string;
// }

// export interface PaginationLink {
//   url: string | null;
//   label: string;
//   active: boolean;
// }

// export interface CustomerApiResponse {
//   success: boolean;
//   current_page: number;
//   total_pages: number;
//   per_page: number;
//   total: number;
//   data: {
//     current_page: number;
//     data: Customer[];
//     first_page_url: string;
//     from: number;
//     last_page: number;
//     last_page_url: string;
//     links: PaginationLink[];
//     next_page_url: string | null;
//     path: string;
//     per_page: number;
//     prev_page_url: string | null;
//     to: number;
//     total: number;
//   };
// }

// Individual Customer
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
  orders_count: number;
  orders_sum_total: number;
  status: string;
}

// Pagination Link (for previous/next navigation)
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Pagination Info
export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  to: number | null;
  links: PaginationLink[];
}

// Query Params
export interface QueryParams {
  page: string;
}

// Customer Statistics
export interface CustomerStats {
  totalCustomers: number;
  new_customers: number;
  inactiveCustomers: number;
  averageOrderValue: number;
}

// The core data part of the response
export interface CustomerApiData {
  success: boolean;
  data: Customer[];
  params: QueryParams;
  pagination: Pagination;
  stats: CustomerStats;
}

// Final API Response Wrapper
export interface CustomerApiResponse {
  message: string;
  data: CustomerApiData;
}
