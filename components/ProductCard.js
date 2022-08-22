import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product, images, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.id}`}>
        <a>
          <Image
            {...images[0]}
            placeholder="blur"
            width={1}
            height={1}
            sizes="50vw"
            layout="responsive"
            objectFit="cover"
            alt={product.itemData.name}
            className="rounded shadow"
          />
        </a>
      </Link>

      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.id}`}>
          <a>
            <h2 className="text-lg text-center">{product.itemData.name}</h2>
          </a>
        </Link>
        <p className="mb-2">
          $
          {product.itemData.variations[0].itemVariationData.priceMoney.amount /
            100}
        </p>
        <button
          className="primary-button"
          type="button"
          onClick={() => addToCartHandler(product, images[0])}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
