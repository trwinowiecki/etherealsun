import axios from 'axios';
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

export default function Home() {
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
        const { data } = await axios.post(`/api/square`);
        catalogDispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        catalogDispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchCatalog();
  }, []);

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
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
                  images={catalog.relatedObjects.filter(
                    (object) => object.type === 'IMAGE'
                  )}
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
