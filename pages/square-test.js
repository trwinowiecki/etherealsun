import axios from 'axios';
import { useContext, useEffect, useReducer, useState } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { getError } from '../utils/error';
import { SquareClient } from '../utils/SquareClient';

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

function SquareTest() {
  const [
    {
      loading,
      error,
      catalog,
      // successPay, loadingDeliver, successDeliver
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    catalog: {},
    error: '',
  });
  // const { state, dispatch } = useContext(SquareClient);
  // const { catalog, setCatalog } = useState({});
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/square`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchCatalog();
  }, []);

  return (
    <Layout title="Square Test">
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

// export async function getStaticProps() {
//   const res = await axios.get(`/api/square`);
//   const data = res.json();
//   return {
//     catalog: data,
//   };
// }

export default SquareTest;
