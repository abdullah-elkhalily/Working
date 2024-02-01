import PropTypes from 'prop-types';
import { useEffect, useCallback, useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
// _mock
import { PRODUCT_PUBLISH_OPTIONS } from 'src/_mock';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// api

// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
//
import { BusinessItemSkeleton } from '../Business-skeleton';
// import BusinessDetailsReview from '../Business-details-review';
import BusinessDetailsSummary from '../Business-details-summary';
import BusinessDetailsToolbar from '../Business-details-toolbar';
import BusinessDetailsCarousel from '../Business-details-carousel';
import BusinessDetailsDescription from '../Business-details-description';
import axios from 'axios';
// import { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const SUMMARY = [
  {
    title: '100% Original',
    description: 'Chocolate bar candy canes ice cream toffee cookie halvah.',
    icon: 'solar:verified-check-bold',
  },
  {
    title: '10 Day Replacement',
    description: 'Marshmallow biscuit donut dragée fruitcake wafer.',
    icon: 'solar:clock-circle-bold',
  },
  {
    title: 'Year Warranty',
    description: 'Cotton candy gingerbread cake I love sugar sweet.',
    icon: 'solar:shield-check-bold',
  },
];

// ----------------------------------------------------------------------

export default function BusinessDetailsView( props) {
 
  const  id  = props.id;
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('description');

  const [publish, setPublish] = useState('');
  const [businessDetails, setBusinessDetails] = useState(null);

  const [loading, setLoading] = useState(true);
const [Error, setError]=useState("")



  
useEffect(() => {
  const apiUrl = `https://sapis.ma-moh.com/api/business/${id}`;

  axios.get(apiUrl)
    .then((response) => {
      setBusinessDetails(response.data.data);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
      setError(error);
      setLoading(false);
    });

}, [id]);

useEffect(() => {
  // Check if businessDetails has a value before setting publish
  if (businessDetails) {
    setPublish(businessDetails.publish);
  }
  console.log(businessDetails);
}, [businessDetails]);





  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const renderSkeleton = <BusinessItemSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${Error?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.Business.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderBusiness = businessDetails && (
    <>
      <BusinessDetailsToolbar
        backLink={paths.dashboard.Business.root}
        editLink={paths.dashboard.Business.edit(`${businessDetails?.id}`)}
        // liveLink={paths.Business.details(`${businessDetails?.id}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={PRODUCT_PUBLISH_OPTIONS}
      />

      <Grid container spacing={{ xs: 3, md: 5, lg: 8 }}>
        <Grid xs={12} md={6} lg={7}>
          <BusinessDetailsCarousel Business={businessDetails} />
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <BusinessDetailsSummary disabledActions Business={businessDetails} />
        </Grid>
      </Grid>

      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ my: 10 }}
      >
        {SUMMARY.map((item) => (
          <Box key={item.title} sx={{ textAlign: 'center', px: 5 }}>
            <Iconify icon={item.icon} width={32} sx={{ color: 'primary.main' }} />

            <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>
              {item.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Card>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            px: 3,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {[
            {
              value: 'description',
              label: 'Description',
            },
            {
              value: 'reviews',
              label: `Reviews (${businessDetails.length})`,
            },
          ].map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {currentTab === 'description' && (
          <BusinessDetailsDescription description={businessDetails?.description} />
        )}

        {/* {currentTab === 'reviews' && (
          <BusinessDetailsReview
            ratings={businessDetails.ratings}
            reviews={businessDetails.reviews}
            totalRatings={businessDetails.totalRatings}
            totalReviews={businessDetails.totalReviews}
          />
        )} */}
      </Card>
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {loading && renderSkeleton}

      {Error && renderError}

      {businessDetails && renderBusiness}
    </Container>
  );
}

BusinessDetailsView.propTypes = {
  id: PropTypes.string,
};
