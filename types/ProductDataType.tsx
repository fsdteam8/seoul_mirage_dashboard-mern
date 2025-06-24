export interface ProductMedia {
  id: number;
  product_id: number;
  file_path: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  arrival_status?:string
  name: string;
  description: string;
  image: string | null;
  price: string;
  category_id: number;
  status: string;
  cost_price: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  media: ProductMedia[];
  category: ProductCategory;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ProductPaginationData {
  current_page: number;
  data: Product[];
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

export interface ProductApiResponse {
  success: boolean;
  data: ProductPaginationData;
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}
