export interface Contact {
  _id: string;
  name: string;
  email: string;
  how_can_we_help: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
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

export interface ContactResponse {
  success: boolean;
  data: Contact[];
  params: Record<string, unknown>; 
  pagination: Pagination;
}
