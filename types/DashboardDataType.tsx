export interface MonthlySale {
  month: string;
  sales: number;
}

export interface CategoryWiseSale {
  category: string;
  total_sales: number;
}

export interface SalesReportApiResponse {
  status: string;
  monthly_sales: MonthlySale[];
  category_wise_sales: CategoryWiseSale[];
  totalOrders?:number
  customerCount?:number
  revenue?:number
  averageOrderValue?:number
}
