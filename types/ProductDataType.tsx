// export interface ProductMedia {
//   id: number;
//   product_id: number;
//   file_path: string;
// }

// export interface ProductCategory {
//   id: number;
//   name: string;
// }

// export interface Product {
//   id: number;
//   arrival_status?:string
//   name: string;
//   description: string;
//   image: string | null;
//   price: string;
//   category_id: number;
//   status: string;
//   cost_price: string;
//   stock_quantity: number;
//   createdAt: string;
//   updatedAt: string;
//   media: ProductMedia[];
//   category: ProductCategory;
// }

// export interface PaginationLink {
//   url: string | null;
//   label: string;
//   active: boolean;
// }

// export interface ProductPaginationData {
//   current_page: number;
//   data: Product[];
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

// export interface ProductApiResponse {
//   success: boolean;
//   data: ProductPaginationData;
//   current_page: number;
//   total_pages: number;
//   per_page: number;
//   total: number;
// }

export interface ProductMedia {
  _id: string;  // Updated to match the response, which uses a string for the ID
  file_path: string;
  alt: string;
  order: number;
}

export interface ProductCategory {
  _id: string;  // Updated to match the response, which uses a string for the ID
  name: string;
}

export interface Product {
  id: string;  // Updated to string for the ID field
  arrival_status?: string;
  name: string;
  description: string;
  image: string | null;
  price: number;  // Changed to number for consistency with the price field type in the response
  category_id: string;  // Updated to string for category_id
  status: string;
  cost_price: number;  // Changed to number for consistency with the cost_price field type in the response
  stock_quantity: number;
  sales: number;  // Added "sales" field based on the response
  createdAt: string;
  updatedAt: string;
  media: ProductMedia[];
  category: ProductCategory;
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

export interface ProductApiResponse {
  message: string;  // Added "message" field based on the new response
  data: {
    success: boolean;
    data: Product[];  // An array of product objects
    params: {
      page: string;
      arrival_status: string;
    };
    pagination: Pagination;
  };
}
