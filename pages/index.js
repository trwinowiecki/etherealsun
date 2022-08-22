import axios from 'axios';
import { getPlaiceholder } from 'plaiceholder';
import { useContext, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { getError } from '../utils/error';
import { Store } from '../utils/Store';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, catalog: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function Home({ images }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [{ loading, error, catalog }, catalogDispatch] = useReducer(reducer, {
    loading: true,
    catalog: {},
    error: '',
  });
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        catalogDispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios({
          method: 'POST',
          url: `/api/square`,
          data: { type: 'GET_ALL_CATALOG' },
        });
        catalogDispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        catalogDispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchCatalog();
  }, []);

  const addToCartHandler = async (product, image) => {
    const existItem = cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    // const { data } = await axios.get(`/api/products/${product._id}`);

    // if (data.countInStock < quantity) {
    //   return toast.error('Sorry. Product is out of stock');
    // }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, image: image, quantity },
    });

    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {catalog.objects.map((object) => {
            if (object.type === 'ITEM') {
              return (
                <ProductCard
                  key={object.id}
                  product={object}
                  addToCartHandler={addToCartHandler}
                  images={
                    object.itemData.imageIds
                      ? Object.values(images).filter((image) => {
                          return object.itemData.imageIds.includes(image.id);
                        })
                      : Object.values(images).filter((image) => {
                          return image.id === 'DEFAULT';
                        })
                  }
                />
              );
            }
            return;
          })}
        </div>
      )}
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { data } = await axios({
    method: 'POST',
    url: `${process.env.BASE_URL}/api/square`,
    data: { type: 'GET_ALL_CATALOG' },
  });

  const images = data.relatedObjects
    .filter((object) => object.type === 'IMAGE')
    .map((image) => {
      return { id: image.id, url: image.imageData.url };
    });

  let imgs = images.map(async (image) => {
    const { base64, img } = await getPlaiceholder(image.url);
    return { id: image.id, blurDataURL: base64, ...img };
  });

  const { base64, img } = await getPlaiceholder('/images/earring1.jpg');
  imgs.push({
    id: 'DEFAULT',
    blurDataURL: base64,
    ...img,
  });

  let allImages = await Promise.all(imgs);

  return {
    props: {
      images: {
        ...allImages,
      },
    },
  };
};
