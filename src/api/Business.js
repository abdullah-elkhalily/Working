import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints, sender } from 'src/utils/axios';
// import image1 from "../assets/R.jpg";
import axios from 'axios';
// import { useAuthContext } from 'src/auth/hooks';
import { paths } from 'src/routes/paths';

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



// export function BusinessCounteries() {
//   const URL = "api/admin/countries";
//   const  data = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       counteries: data?.data || [],
     
  
//     }),
//     [data?.data ]
//   );

//   return memoizedValue;
// }


export function BusinessCounteries(businessDetails) {
  // Define the URL for the API
  const URL = "api/admin/countries";

  // Fetch data using useSWR hook
  const data = useSWR(URL, fetcher);

  // Memoize the result
  const memoizedValue = useMemo(
    () => ({
      counteries: data?.data || [],
    }),
    [data?.data]
  );

  // Return the memoized value
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
  const URL = endpoints.Business.update + '/' + businessId; 
  try {
    const result = await sender([URL, requestBody]);
    const success = result.message === "Updated Successfully";
    return { success, data: result.data };
  } catch (error) {
    console.error('Error updating business:', error);
    return { success: false, error };
  }
};


 
// export const createBusiness = async (formData) => {
//   console.log('Image URL:', image1);
//   const auth = useAuthContext();

//   const requestData = {
   
//     business_department_id:1,
// store_id:987623,
// is_store_id_visible:1,
// // categories:725,726,890,
// country_id:98,
// city_id:80,
// name:"store1",
// description:"Test Category Data2",
// // schedule_type:24/7,
// lat:30.599237968267488,
// lng:32.18080932274461,
// address:"st-25",
// mobile_number :1129977792,
// mobile_number2:1129977792,
// image: 'https://images.pexels.com/photos/1557652/pexels-photo-1557652.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', // Replace with the actual image URL

// country:'egypt',
// // fax:3456896,
// email:"business@business.com",
// website:"www.business.com",
// whatsapp:"business@whatsap",
// instagram:"business@instagram",
// facebook:"business@facebook",
// snapchat:"business@snapchat",
//   };
//   const URL ='https://dapis.ma-moh.com//api/business/create'; // Assuming this is correct

//   try {
//     console.log('Request Payload:', formData);

//     const response = await axios.post('https://dapis.ma-moh.com/api/images/create', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'Authorization': `Bearer ${auth?.user?.accessToken}`,
//       }
//     });
//     console.log('API Response:', result);

//     const success = result.message === 'Create Successfully';

//     return { success, data: result.data };
//   } catch (error) {
//     console.error('Error creating business:', error);
//     return { success: false, error };
//   }
// };
export const createBusiness = async (formData, auth) => {

  try {
    const result = await axios.post('https://dapis.ma-moh.com//api/business/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${auth?.user?.accessToken}`,
      }
      
    });

    console.log('API Response:', result.data);
  } catch (error) {
    console.error('Error creating business:', error.result.data);
    return { success: false, error: error.result.data };
  }
 
  
};