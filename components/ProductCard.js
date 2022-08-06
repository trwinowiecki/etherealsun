import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <a>
          <Image
            src={product.image}
            width={1}
            height={1}
            sizes="50vw"
            layout="responsive"
            objectFit="cover"
            alt={product.name}
            className="rounded shadow"
          />
        </a>
      </Link>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">${product.price}</p>
        <button className="primary-button" type="button">
          Add to cart
        </button>
      </div>
    </div>
  );
}
