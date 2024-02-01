import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BusinessNewEditForm from '../Business-new-edit-form';
import { endpoints } from 'src/utils/axios';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ----------------------------------------------------------------------

// ... (other imports)

export default function BusinessEditView(props) {
  const settings = useSettingsContext();
  const { id } = props;

  const [businessEdit, setBusinessEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl =`https://sapis.ma-moh.com${endpoints.Business.details}${id}`;

    axios.get(apiUrl)
      .then((response) => {
        setBusinessEdit(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Store',
            href: paths.dashboard.Business.root,
          },
          { name: businessEdit?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {loading ? (
        // Render a loading spinner or message
        <p>Loading...</p>
      ) : (
        <BusinessNewEditForm currentBusiness={businessEdit} />
      )}
    </Container>
  );
}

BusinessEditView.propTypes = {
  id: PropTypes.string,
};


