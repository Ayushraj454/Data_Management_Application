'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, QueryParams } from '@/types';
import productsData from '@/data/products.json';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  currentPage: number;
  refetch: () => void;
  updateParams: (newParams: Partial<QueryParams>) => void;
  resetParams: () => void;
}

const DEFAULT_PARAMS: QueryParams = {
  page: 1,
  pageSize: 12,
  search: '',
  category: '',
  availability: '',
  sortBy: 'name',
  sortOrder: 'asc'
};

// Type assertion to ensure our JSON data matches the Product interface
const products = productsData as Product[];

export function useProducts(): UseProductsReturn {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [params, setParams] = useState<QueryParams>(DEFAULT_PARAMS);

  const processProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate network delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 200));

      // Validate parameters
      const page = params.page || 1;
      const pageSize = params.pageSize || 12;
      
      if (page < 1 || pageSize < 1 || pageSize > 100) {
        throw new Error('Invalid pagination parameters. Page must be >= 1, pageSize must be between 1 and 100');
      }

      let filteredProducts = [...products];

      // Apply search filter
      if (params.search?.trim()) {
        const searchLower = params.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Apply category filter
      if (params.category?.trim()) {
        filteredProducts = filteredProducts.filter(product =>
          product.category.toLowerCase() === params.category!.toLowerCase()
        );
      }

      // Apply availability filter
      if (params.availability?.trim()) {
        filteredProducts = filteredProducts.filter(product =>
          product.availability === params.availability
        );
      }

      // Apply price range filter
      if (params.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price >= params.minPrice!);
      }
      if (params.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(product => product.price <= params.maxPrice!);
      }

      // Apply sorting
      filteredProducts.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (params.sortBy) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating;
            bValue = b.rating;
            break;
          case 'createdDate':
            aValue = new Date(a.createdDate);
            bValue = new Date(b.createdDate);
            break;
          case 'name':
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
        }

        if (aValue < bValue) return params.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return params.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });

      // Apply pagination
      const totalCount = filteredProducts.length;
      const totalPagesCount = Math.ceil(totalCount / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      setDisplayProducts(paginatedProducts);
      setTotal(totalCount);
      setTotalPages(totalPagesCount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setDisplayProducts([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const updateParams = useCallback((newParams: Partial<QueryParams>) => {
    setParams(prev => ({ 
      ...prev, 
      ...newParams,
      // Reset to page 1 when filters change (except when explicitly changing page)
      page: newParams.page !== undefined ? newParams.page : 1
    }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(DEFAULT_PARAMS);
  }, []);

  const refetch = useCallback(() => {
    processProducts();
  }, [processProducts]);

  useEffect(() => {
    processProducts();
  }, [processProducts]);

  return {
    products: displayProducts,
    loading,
    error,
    total,
    totalPages,
    currentPage: params.page || 1,
    refetch,
    updateParams,
    resetParams
  };
}