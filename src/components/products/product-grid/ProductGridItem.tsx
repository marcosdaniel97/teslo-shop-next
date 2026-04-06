'use client';
import { ProductImage } from '@/components';
import { Product } from '@/interfaces';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
  product: Product;
}

export const ProductGridItem = ({ product }: Props) => {
  const [displayImage, setDisplayImage] = useState(product.images[0]);

  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/product/${product.slug}`}>
        <div
          onMouseEnter={() =>
            setDisplayImage(product.images[1] ?? product.images[0])
          }
          onMouseLeave={() => setDisplayImage(product.images[0])}
        >
          <ProductImage
            src={displayImage} //`/products/${displayImage}`
            alt={product.title}
            className="w-full object-cover rounded"
            width={500}
            height={500}
          />
        </div>
      </Link>

      <div className="p-4 flex flex-col">
        <Link className="hover:text-blue-600" href={`/product/${product.slug}`}>
          {product.title}
        </Link>
        <span className="font-bold">${product.price}</span>
      </div>
    </div>
  );
};
