import { _mock } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const auth = useAuthContext();
  const user = {
    id: auth?.user?.id || '8864c717-587d-472a-929a-8e5f298024da-0',
    displayName: auth?.user?.full_name || 'test name' ,
    email: auth?.user?.email || 'demo@minimals.cc',
    // password: 'demo1234',
    photoURL: auth?.user?.image || _mock.image.avatar(24),
    phoneNumber: auth?.user?.country_code + auth?.user?.mobile || '+40 777666555',
    country: auth?.user?.country || 'United States',
    address: auth?.user?.address || '90210 Broadway Blvd',
    state: 'California',
    city: auth?.user?.city || 'San Francisco',
    zipCode: '',
    about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: 'admin',
    isPublic: true,
  };

  return { user };
}
