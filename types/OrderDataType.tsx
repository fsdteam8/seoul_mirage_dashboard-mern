// export interface Promocode {
//   id: number;
//   name: string;
// }

// export interface Customer {
//   id: number;
//   full_name?: string;
//   last_name?: string;
//   email: string;
//   phone: string;
//   full_address: string;
//   city: string;
//   state: string;
//   postal_code: string;
//   country: string;
//   created_at: string;
//   updated_at: string;
//   name:string
// }

// export interface Order {
//   id: number;
//   uniq_id: string;
//   customer_id: number;
//   type: string;
//   items: number;
//   status: string;
//   shipping_method: string;
//   shipping_price: string;
//   order_summary: string;
//   payment_method: string;
//   payment_status: string;
//   promocode_id: number;
//   total: string;
//   created_at: string;
//   updated_at: string;
//   promocode: Promocode;
//   customer: Customer;
// }

// export interface PaginationLink {
//   url: string | null;
//   label: string;
//   active: boolean;
// }

// export interface PaginatedOrderData {
//   current_page: number;
//   data: Order[];
//   first_page_url: string;
//   from: number;
//   last_page: number;
//   last_page_url: string;
//   links: PaginationLink[];
//   next_page_url: string | null;
//   path: string;
//   per_page: number;
//   prev_page_url: string | null;
//   to: number;
//   total: number;
// }

// export interface OrdersApiResponse {
//   success: boolean;
//   data: PaginatedOrderData;
//   current_page: number;
//   total_pages: number;
//   per_page: number;
//   total: number;
// }

// export interface Promocode {
//   id: string;
//   name: string | null;
// }

// export interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   role?: string;
//   createdAt: string;
//   updatedAt: string;
//   // Optional MongoDB __v version key omitted or add if needed: __v?: number;
// }

// export interface Order {
//   id: string;
//   _id?: string; // optional original MongoDB _id if needed
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
//   customer: Customer | null;
// }

// export interface PaginationLink {
//   url: string | null;
//   label: string;
//   active: boolean;
// }

// export interface Pagination {
//   current_page: number;
//   per_page: number;
//   total: number;
//   last_page: number;
//   from: number;
//   to: number;
//   links: PaginationLink[];
// }

// export interface OrdersApiResponseData {
//   success: boolean;
//   data: Order[];
//   params: {
//     page: string;
//   };
//   pagination: Pagination;
// }

// export interface OrdersApiResponse {
//   message: string;
//   data: OrdersApiResponseData;
// }


export interface ShippingDetails {
  firstName: string;
  email: string;
  phone: string;
  state: string;
  postal: string;
  country: string;
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
  createdAt: string;
  updatedAt: string;
  image: string;
  __v?: number;
}

export interface Order {
  _id: string;
  id: string;
  type: string;
  items: number;
  status: string;
  shipping_method: string;
  shipping_price: number;
  order_summary: string;
  payment_method: string;
  payment_status: string;
  promocode_id: string | null;
  promocode_name: string | null;
  shipping_details: string; // NOTE: still raw JSON string, can be parsed into ShippingDetails
  total: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  customer: Customer;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  links: PaginationLink[];
}

export interface OrdersApiResponseData {
  success: boolean;
  data: Order[];
  params: {
    page: string;
  };
  pagination: Pagination;
}

export interface OrdersApiResponse {
  message?: string; // optional, not in the response above
  data: OrdersApiResponseData;
}
