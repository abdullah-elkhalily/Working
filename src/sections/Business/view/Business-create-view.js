// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import BusinessNewEditForm from '../Business-new-edit-form';

// ----------------------------------------------------------------------

export default function BusinessCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Store"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Business',
            href: paths.dashboard.Business.root,
          },
          { name: 'New Store' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <BusinessNewEditForm />
    </Container>
  );
}
