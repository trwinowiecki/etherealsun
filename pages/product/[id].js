import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Image from 'next/image';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ProductPage(props) {
  const { catalogObjects } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  if (catalogObjects.errors) {
    return (
      <Layout title={catalogObjects.errors[0].code}>
        {catalogObjects.errors[0].detail}
      </Layout>
    );
  }

  const product = catalogObjects.object;
  const images = catalogObjects.relatedObjects.filter(
    (object) => object.type === 'IMAGE'
  );
  const category = catalogObjects.relatedObjects.filter(
    (object) => object.type === 'CATEGORY'
  );

  let stock;
  try {
    stock = catalogObjects.inventory;
  } catch (error) {
    stock = 0;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find(
      (x) => x.id === product.itemData.variations[0].id
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // const { data } = await axios({
    //   method: 'POST',
    //   url: `${process.env.BASE_URL}/api/square`,
    //   data: {
    //     type: 'GET_ONE_INVENTORY',
    //     id: product.itemData.variations[0].id,
    //   },
    // });

    // if (data.countInStock < quantity) {
    //   return toast.error('Sorry. Product not in stock');
    // }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    router.push('/cart');
  };

  return (
    <Layout title={product.itemData.name}>
      <div className="py-2">
        <Link href="/">
          <a className="font-bold">Home</a>
        </Link>{' '}
        / {product.itemData.name}
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={images[0].imageData.url}
            alt={product.itemData.name}
            width={1000}
            height={1000}
            layout="responsive"
            objectFit="cover"
            priority={true}
          />
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.itemData.name}</h1>
            </li>
            {category ? <li>Category: {category[0].categoryData.name}</li> : ''}
            <li>Description: {product.itemData.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>
                $
                {product.itemData.variations[0].itemVariationData.priceMoney
                  .amount / 100}
              </div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{stock > 0 ? 'In stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const { data } = await axios({
    method: 'POST',
    url: `${process.env.BASE_URL}/api/square`,
    data: { type: 'GET_ONE_CATALOG', id: id },
  });

  return {
    props: {
      catalogObjects: data,
    },
  };
}
