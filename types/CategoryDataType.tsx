// export type Category = {
//   id: number; // updated from string to number
//   name: string;
//   description: string;
//   type: string;
//   image: string; // required now
//   createdAt: string;
//   updatedAt: string;
//   // removed productCount as it's not in new data
// };

// export type PaginationLink = {
//   url: string | null;
//   label: string;
//   active: boolean;
// };

// export type PaginatedCategoryResponse = {
//   success: boolean;
//   data: {
//     current_page: number;
//     data: Category[];
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
//   current_page: number;
//   total_pages: number;
//   per_page: number;
//   total: number;
// };
export type Category = {
  id: string;  // The id is now a string (e.g., "6879db98dcd148228f4d83ff")
  name: string;
  description: string;
  type: string;
  image: string;  // The image field is required
  createdAt: string;
  updatedAt: string;
};

export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type Pagination = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  links: PaginationLink[];
};

export type PaginatedCategoryResponse = {
  message: string;  // A "message" field has been added to the response
  data: {
    success: boolean;
    data: Category[];  // List of categories
    params: {
      page: string;  // Page number as a string
      search: string;  // Search parameter (currently empty)
    };
    pagination: Pagination;  // Pagination details
  };
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
};
