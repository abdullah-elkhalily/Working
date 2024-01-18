import { Helmet } from 'react-helmet-async';
// sections
import { OrderListView } from 'src/sections/delivery/view';

// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Delivery Order List</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
