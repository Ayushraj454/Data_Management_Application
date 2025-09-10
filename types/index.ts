// Core data types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  rating: number;
  imageUrl: string;
  createdDate: string;
  tags: string[];
}

// API response types
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

// Query parameters
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  availability?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
}

// Component props
export interface DataViewProps {
  products: Product[];
  loading?: boolean;
  error?: string;
}

export interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onFilter: (filters: Partial<QueryParams>) => void;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  categories: string[];
  currentFilters: QueryParams;
}

export type ViewMode = 'cards' | 'rows';