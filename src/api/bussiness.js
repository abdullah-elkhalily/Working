import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints, sender } from 'src/utils/axios';
import { useMockedUser } from 'src/hooks/use-mocked-user';

// ----------------------------------------------------------------------

export function useGetBussinesses(page, per_page) {
  const URL = [endpoints.business.list, {params : {page, per_page}}] ;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      bussiness: data?.data || [],
      meta: data?.meta,
      bussinessLoading: isLoading,
      bussinessError: error,
      bussinessValidating: isValidating,
      bussinessEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}


// ----------------------------------------------------------------------

export function useGetAllBusinesses() {
  const { user } = useMockedUser();
  const URL = user.id ? [endpoints.business.list, { params: { user_id: user.id } }] : null;

  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      businesses: data?.data || [],
      businessesLoading: !error && !data,
      businessesError: error,
      businessesValidating: isValidating,
      businessesEmpty: !error && !isValidating && (!data || !data?.data.length),
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function useGetBussiness(bussinessId) {
  const URL = bussinessId ? [endpoints.business.details + "/" + bussinessId ] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      bussiness: data?.data,
      bussinessLoading: isLoading,
      bussinessError: error,
      bussinessValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchBussinesses(query) {
  const URL = query ? [endpoints.business.search, { params: { query } }] : null;

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

export const deleteBussiness = async (bussinessIds) => {
  const URL = endpoints.business.delete ;
  const deletedIds = [];
  const failedIds = [];
  try {
    await Promise.all(
      bussinessIds.map(async (bussinessId) => {
        try {
          const deleteUrl = URL + '/' + bussinessId;
          const result =  await sender(deleteUrl);
          const success = result.message === "Deleted Successfully";
          if(success) {
            return deletedIds.push(bussinessId);
          }else {
            return failedIds.push({bussinessId, message: result.message});
          }
          } catch (error) {
            return failedIds.push({bussinessId, message: error.errors});
          }
      })
    );
    return { deletedIds,  failedIds};
  } catch (error) {
    console.error('Error deleting bussiness:', error);
    return { success: false, error };
  }
};

export const updateBussiness = async (bussinessId, requestBody) => {
  const URL = [endpoints.business.update + '/' + bussinessId, requestBody] ;

  try {
    const result =  await sender(URL);
    const success = result.message === "Updated Successfully";
    return {success, data: result.data};
  } catch (error) {
    console.error('Error updating bussiness:', error);
    return { success: false, error };
  }
};


export function useGetBusinessByCategories(businessId, business_department_id) {
  const URL = businessId
    ? [endpoints.business.categories, { params: { business_department_id } }]
    : null;

    
    const { data, error, isValidating } = useSWR(URL, fetcher);


  const memoizedValue = useMemo(
    () => ({
      businessesCategories: data?.data || [],
      businessesCategoriesLoading: !error && !data,
      businessesCategoriesError: error,
      businessesCategoriesValidating: isValidating,
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}