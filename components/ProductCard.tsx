'use client';

import Image from 'next/image';
import { Star, Package, PackageX, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';

interface ProductCardProps {
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

export function ProductCard({ product }: ProductCardProps) {
  const availabilityConfig = getAvailabilityConfig(product.availability);
  const AvailabilityIcon = availabilityConfig.icon;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={250}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className={availabilityConfig.className}>
              <AvailabilityIcon className="w-3 h-3 mr-1" />
              {availabilityConfig.text}
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {product.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">(reviews)</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}