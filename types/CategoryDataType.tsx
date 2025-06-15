export type Category = {
  id: number; // updated from string to number
  name: string;
  description: string;
  type: string;
  image: string; // required now
  created_at: string;
  updated_at: string;
  // removed productCount as it's not in new data
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type PaginatedCategoryResponse = {
  success: boolean;
  data: {
    current_page: number;
    data: Category[];
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
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
};
