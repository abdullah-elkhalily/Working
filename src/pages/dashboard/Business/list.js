import { Helmet } from 'react-helmet-async';
// sections
import BusinessListView from 'src/sections/Business/view/Business-list-view';

// ----------------------------------------------------------------------

export default function BusinessListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <BusinessListView/>
    </>
  );
}
