import { Helmet } from 'react-helmet-async';
// sections
import BusinessCreateView from 'src/sections/Business/view/Business-create-view';

// ----------------------------------------------------------------------

export default function BusinessCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      <BusinessCreateView />
    </>
  );
}
