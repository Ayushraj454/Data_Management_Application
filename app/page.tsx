'use client';

import { useState, useCallback } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { ProductRow } from '@/components/ProductRow';
import { SearchFilters } from '@/components/SearchFilters';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Pagination } from '@/components/Pagination';
import { ViewToggle } from '@/components/ViewToggle';
import { useProducts } from '@/hooks/useProducts';
import { ViewMode } from '@/types';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  
  const {
    products,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    refetch,
    updateParams,
    resetParams
  } = useProducts();

  const handleSearch = useCallback((search: string) => {
    updateParams({ search });
  }, [updateParams]);

  const handleFilter = useCallback((filters: any) => {
    updateParams(filters);
  }, [updateParams]);

  const handleSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateParams({ sortBy, sortOrder });
  }, [updateParams]);

  const handlePageChange = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    updateParams({ pageSize, page: 1 });
  }, [updateParams]);

  const handleClearFilters = useCallback(() => {
    resetParams();
  }, [resetParams]);

  // Check if there are active filters
  const hasActiveFilters = Boolean(
    products.length > 0 || 
    loading || 
    error
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-2">Product Catalog</h1>
        <p className="text-muted-foreground text-center">
          Discover our curated collection of premium products
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <SearchFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          categories={[]} // Categories are handled within the component
          currentFilters={{
            search: '',
            category: '',
            availability: '',
            sortBy: 'name',
            sortOrder: 'asc',
            minPrice: undefined,
            maxPrice: undefined,
            ...updateParams
          }}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {loading ? 'Loading...' : `${total} Products`}
          </h2>
          {!loading && total > 0 && (
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
          )}
        </div>
        
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton viewMode={viewMode} count={12} />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={handleClearFilters}
            className="text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={12} // This should come from the actual params
          total={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}