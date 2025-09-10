'use client';

import Image from 'next/image';
import { Star, Package, PackageX, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface ProductRowProps {
  product: Product;
}

const getAvailabilityConfig = (availability: Product['availability']) => {
  switch (availability) {
    case 'in-stock':
      return {
        icon: Package,
        text: 'In Stock',
        className: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'out-of-stock':
      return {
        icon: PackageX,
        text: 'Out of Stock',
        className: 'bg-red-100 text-red-800 border-red-200'
      };
    case 'limited':
      return {
        icon: AlertTriangle,
        text: 'Limited Stock',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    default:
      return {
        icon: Package,
        text: 'Unknown',
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      };
  }
};

export function ProductRow({ product }: ProductRowProps) {
  const availabilityConfig = getAvailabilityConfig(product.availability);
  const AvailabilityIcon = availabilityConfig.icon;

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg truncate">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {product.description}
            </p>
          </div>
          <div className="ml-4 text-right flex-shrink-0">
            <div className="text-xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{product.category}</Badge>
            <Badge className={availabilityConfig.className}>
              <AvailabilityIcon className="w-3 h-3 mr-1" />
              {availabilityConfig.text}
            </Badge>
            
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}