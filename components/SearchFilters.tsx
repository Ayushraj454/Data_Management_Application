'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchFiltersProps } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Sports', 'Clothing', 'Home', 'Accessories'];
const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All Items' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
  { value: 'limited', label: 'Limited Stock' }
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'createdDate', label: 'Date Added' }
];

interface SearchFiltersPropsExtended extends SearchFiltersProps {
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function SearchFilters({
  onSearch,
  onFilter,
  onSort,
  currentFilters,
  onClearFilters,
  hasActiveFilters
}: SearchFiltersPropsExtended) {
  const [searchQuery, setSearchQuery] = useState(currentFilters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice?.toString() || '');
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  useEffect(() => {
    const minPriceNum = debouncedMinPrice ? parseFloat(debouncedMinPrice) : undefined;
    const maxPriceNum = debouncedMaxPrice ? parseFloat(debouncedMaxPrice) : undefined;
    
    if (minPriceNum !== currentFilters.minPrice || maxPriceNum !== currentFilters.maxPrice) {
      onFilter({ 
        minPrice: minPriceNum, 
        maxPrice: maxPriceNum 
      });
    }
  }, [debouncedMinPrice, debouncedMaxPrice, onFilter, currentFilters.minPrice, currentFilters.maxPrice]);

  const handleSortChange = (value: string) => {
    onSort(value, currentFilters.sortOrder || 'asc');
  };

  const handleSortOrderToggle = () => {
    const newOrder = currentFilters.sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(currentFilters.sortBy || 'name', newOrder);
  };

  const handleCategoryChange = (value: string) => {
    onFilter({ category: value === 'All' ? '' : value });
  };

  const handleAvailabilityChange = (value: string) => {
    onFilter({ availability: value === 'all' ? '' : value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (currentFilters.category) count++;
    if (currentFilters.availability) count++;
    if (currentFilters.minPrice || currentFilters.maxPrice) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search and Main Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select 
                  value={currentFilters.category || 'All'} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability</label>
                <Select 
                  value={currentFilters.availability || 'all'} 
                  onValueChange={handleAvailabilityChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Max Price</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by:</span>
        <Select value={currentFilters.sortBy || 'name'} onValueChange={handleSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleSortOrderToggle}
          className="flex items-center gap-1"
        >
          {currentFilters.sortOrder === 'desc' ? (
            <SortDesc className="h-4 w-4" />
          ) : (
            <SortAsc className="h-4 w-4" />
          )}
          {currentFilters.sortOrder === 'desc' ? 'Desc' : 'Asc'}
        </Button>
      </div>
    </div>
  );
}