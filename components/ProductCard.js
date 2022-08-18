import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getError } from '../utils/error';

export default function ProductCard({ product, images, addToCartHandler }) {
  let imageURLs = {};
  try {
    if (product.itemData.imageIds) {
      imageURLs = images.filter((image) =>
        product.itemData.imageIds.includes(image.id)
      );
    } else {
      imageURLs = [{ imageData: { url: '/images/earring1.jpg' } }];
    }
  } catch (error) {
    console.log(getError(error));
  }
  return (
    <div className="card">
      <Link href={`/product/${product.id}`}>
        <a>
          <Image
            src={imageURLs.length > 0 ? imageURLs[0].imageData.url : null}
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
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
