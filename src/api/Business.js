import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints, sender } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetBusiness(page, per_page) {
  const URL = [endpoints.Business.list, { params: { page, per_page } }];
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      Business: data?.data || [],
      meta: data?.meta,
      BusinessLoading: isLoading,
      BusinessError: error,
      BusinessValidating: isValidating,
      BusinessEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBusines(BusinessId) {
  const URL = BusinessId ? [endpoints.Business.details, { params: { BusinessId } }] : null;


  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);


  const memoizedValue = useMemo(
    () => ({
      Business: data?.Business,
      BusinessLoading: isLoading,
      BusinessError: error,
      BusinessValidating: isValidating,
    }),
    [data?.Business, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchBusiness(query) {
  const URL = query ? [endpoints.Business.search, { params: { query } }] : null;


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

export const deleteBusiness = async (businessIds) => {
  const URL = endpoints.Business.delete; 
  const deletedIds = [];
  const failedIds = [];
  try {
    await Promise.all(
      businessIds.map(async (businessId) => {
        try {
          const deleteUrl = URL + '/' + businessId;
          const result = await sender(deleteUrl);
          const success = result.message === "Deleted Successfully";
          if (success) {
            deletedIds.push(businessId); 
          } else {
            failedIds.push({ businessId, message: result.message }); 
          }
        } catch (error) {
          failedIds.push({ businessId, message: error.errors }); 
        }
      })
    );
    return { deletedIds, failedIds };
  } catch (error) {
    console.error('Error deleting business:', error);
    return { success: false, error };
  }
};

 

export const updateBusiness = async (businessId, requestBody) => {
  const URL = [endpoints.Business.update + '/' + businessId, requestBody]; // Corrected the URL
  try {
    const result = await sender(URL);
    const success = result.message === "Updated Successfully";
    return { success, data: result.data };
  } catch (error) {
    console.error('Error updating business:', error);
    return { success: false, error };
  }
};
