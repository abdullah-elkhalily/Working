import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
// @mui
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// utils

import Iconify from "src/components/iconify";
import FormProvider from "src/components/hook-form";
import { Box } from "@mui/system";

// ----------------------------------------------------------------------

export default function BusinessDetailsSummary({
  items,
  Business,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}) {
  const {
    id,
lat,
long,
    name,
    country,
    city,
    no_of_orders,
    mobile_number,
    snapchat,
    facebook,
    status,
    address,
    instagram,
    description,
  } = Business;

  const existProduct =
    !!items?.length && items.map((item) => item.id).includes(id);

  // const isMaxQuantity =
  //   !!items?.length &&
  //   items.filter((item) => item.id === id).map((item) => item.quantity)[0] >= available;

  const defaultValues = {
    id,
    snapchat,
    instagram,
    facebook,
    name,
    lat,
    long,
    country,
    no_of_orders,
    mobile_number,
    city,
    status,
    address,
    description,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (Business) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Business]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({
          ...data,
          colors: [values.colors],
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
    } catch (error) {
      console.error(error);
    }
  });
 
  
  const mapLink = `https://www.google.com/maps?q=${lat},${long}`;
  
  // const handleAddCart = useCallback(() => {
  //   try {
  //     onAddCart?.({
  //       ...values,
  //       colors: [values.colors],
  //       subTotal: values.price * values.quantity,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   } }, [onAddCart, values]);
  const renderShare = (
    <Stack direction="row" spacing={3} justifyContent="center">
      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="mingcute:add-line" width={16} sx={{ mr: 1 }} />
        Compare
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="solar:heart-bold" width={16} sx={{ mr: 1 }} />
        Favorite
      </Link>

      <Link
        variant="subtitle2"
        sx={{
          color: "text.secondary",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <Iconify icon="solar:share-bold" width={16} sx={{ mr: 1 }} />
        Share
      </Link>
    </Stack>
  );
  const rendersocialMedia = (
    <>
      <Stack direction="row" spacing={3}>
        <Link
          variant="subtitle2"
          sx={{
            color: "text.secondary",
            display: "inline-flex",
          }}
          href={facebook}
          Target="blank"
        >
          <Iconify icon="devicon:facebook" width={25} sx={{ mr: 1 }} />
          facebook
        </Link>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Link
          variant="subtitle2"
          sx={{
            color: "text.secondary",
            display: "inline-flex",
          }}
          href={snapchat}
          Target="blank"
        >
          <Iconify icon="fa-brands:snapchat-ghost" width={25} sx={{ mr: 1 }} />
          snapchat
        </Link>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Link
          variant="subtitle2"
          sx={{
            color: "text.secondary",
            display: "inline-flex",
          }}
          href={instagram}
          Target="blank"
        >
          <Iconify icon="skill-icons:instagram" width={25} sx={{ mr: 1 }} />
          instagram
        </Link>
      </Stack>
      <Stack>



<Link
  variant="subtitle2"
  sx={{
    color: 'text.secondary',
    display: 'inline-flex',
    alignItems: 'center',
  }}
  href={mapLink}
  target="_blank" // Optional: Opens the link in a new tab
>
  <Iconify icon="bx:map" width={25} sx={{ mr: 1 }} />
{name} location
</Link>
      </Stack>
    </>
  );
  const renderContry = (
    <Stack direction="row">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Country:{country}     </Typography>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: "text.secondary" }}>
      {description}
    </Typography>
  );

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        color: "text.disabled",
        typography: "body2",
      }} ></Stack>);
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>       <Stack spacing={2} alignItems="flex-start">
 <Typography variant="h5">{name}</Typography>

   {renderRating}
{renderSubDescription}
        </Stack>
        <Divider sx={{ borderStyle: "dashed" }} />
        {rendersocialMedia}
        <Divider sx={{ borderStyle: "dashed" }} />

        {renderContry}

        <Divider sx={{ borderStyle: "dashed" }} />

        {renderShare}
      </Stack>
    </FormProvider>
  );
}

BusinessDetailsSummary.propTypes = {
  items: PropTypes.array,
  disabledActions: PropTypes.bool,
  onAddCart: PropTypes.func,
  onGotoStep: PropTypes.func,
  product: PropTypes.object,
};
