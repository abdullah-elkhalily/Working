import { Helmet } from 'react-helmet-async';
// routes
import { useParams } from 'src/routes/hooks';
// sections
import BusinessEditView from 'src/sections/Business/view/Business-edit-view';

// ----------------------------------------------------------------------

export default function BusinessEditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Edit</title>
      </Helmet>

      < BusinessEditView   id={`${id}`} />
    </>
  );
}
