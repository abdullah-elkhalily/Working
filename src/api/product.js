import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints, sender } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetProducts(page, per_page) {
  const URL = [endpoints.product.list, {params : {page, per_page}}] ;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: data?.data || [],
      meta: data?.meta,
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [endpoints.product.details, { params: { productId } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.product,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.product, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const deleteProducts = async (productIds) => {
  const URL = endpoints.product.delete ;
  const deletedIds = [];
  const failedIds = [];
  try {
    await Promise.all(
      productIds.map(async (productId) => {
        try {
          const deleteUrl = URL + '/' + productId;
          const result =  await sender(deleteUrl);
          const success = result.message === "Deleted Successfully";
          if(success) {
            return deletedIds.push(productId);
          }else {
            return failedIds.push({productId, message: result.message});
          }
          } catch (error) {
            return failedIds.push({productId, message: error.errors});
          }
      })
    );
    return { deletedIds,  failedIds};
  } catch (error) {
    console.error('Error deleting products:', error);
    return { success: false, error };
  }
};

export const updateProduct = async (productId, requestBody) => {
  const URL = [endpoints.product.update + '/' + productId, requestBody] ;

  try {
    const result =  await sender(URL);
    const success = result.message === "Updated Successfully";
    return {success, data: result.data};
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error };
  }
};
