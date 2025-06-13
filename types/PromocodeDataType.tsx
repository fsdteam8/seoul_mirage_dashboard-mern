export type type = "percentage" | "fixed";

export interface PromoCode {
  id: string;
  name: string;
  description?: string;
  type: type;
  discountValue: number;
  minPurchaseAmount?: number;
  expiryDate?: string; // ISO string date YYYY-MM-DD
  usage_limit?: number; // 0 or undefined for unlimited
  timesUsed: number;
  isActive: boolean; // Admin can toggle this
  createdAt: string;
  updatedAt: string;
  amount: number;
  status:string
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
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

export interface PromoCodeResponse {
  success: boolean;
  data: PaginatedData<PromoCode>;
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}
