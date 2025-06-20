import { Product } from '@/types/product';
import { Heart } from 'lucide-react';
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useWishlist } from '@/store/useWishlist';

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: Product;
  innerRef?: React.Ref<HTMLDivElement>;
}

const ProductCard: FC<ProductCardProps> = ({ product, innerRef, ...props }) => {
  const { addItem, removeItem, items } = useWishlist();
  const isInWishlist = items.includes(product.slug);
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeItem(product.slug);
    } else {
      addItem(product.slug);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} passHref>
      <div 
        className='border rounded-lg p-3 bg-white shadow-sm cursor-pointer hover:shadow-md transition' 
        key={product.id} 
        ref={innerRef} 
        {...props}
      >
        <div className='relative w-full aspect-square mb-2'>
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className='w-full h-full object-cover rounded' 
          />
          <Button 
            size="icon"
            variant={isInWishlist ? "destructive" : "secondary"}
            className='absolute top-2 right-2 rounded-full shadow-sm'
            onClick={handleWishlistToggle}
          >
            <Heart className={isInWishlist ? "fill-current" : ""} />
          </Button>
        </div>

        <h3 className='font-medium text-gray-900 mb-1 text-sm'>
          {product.name}
        </h3>
        
        <p className='text-base font-semibold mb-2'>
          ₹{product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;