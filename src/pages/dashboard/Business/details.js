import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import BusinessDetailsView from 'src/sections/Business/view/Business-details-view';

// ----------------------------------------------------------------------

export default function BusinessDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Details</title>
      </Helmet>

      < BusinessDetailsView id={`${id}`} />
    </>
  );
}
