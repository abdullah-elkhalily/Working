import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// api
import { useGetBusiness } from 'src/api/Business';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BusinessNewEditForm from '../Business-new-edit-form';

// ----------------------------------------------------------------------

export default function BusinessEditView({ id }) {
  const settings = useSettingsContext();

  const { Business: currentBusiness } = useGetBusiness(id);

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
          { name: currentBusiness?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BusinessNewEditForm currentBusiness={currentBusiness} />
    </Container>
  );
}

BusinessEditView.propTypes = {
  id: PropTypes.string,
};
