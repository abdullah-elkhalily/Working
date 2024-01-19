/* eslint-disable no-undef */
import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "src/routes/paths";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// _mock
import {
  _tags,
  countriesData,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from "src/_mock";
// components
import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from "src/components/hook-form";

// ----------------------------------------------------------------------

export default function BusinessNewEditForm({ currentBusiness }) {
  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    images: Yup.array().min(1, "Images is required"),
    tags: Yup.array().min(2, "Must have at least 2 tags"),
    category: Yup.string().required("Category is required"),
    price: Yup.number().moreThan(0, "Price should not be $0.00"),
    description: Yup.string().required("Description is required"),
    // not required
    taxes: Yup.number(),
    newLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    saleLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentBusiness?.name || "",
      description: currentBusiness?.description || "",
      subDescription: currentBusiness?.subDescription || "",
      images: currentBusiness?.images || [],
      //
      code: currentBusiness?.code || "",
      sku: currentBusiness?.sku || "",
      price: currentBusiness?.price || 0,
      quantity: currentBusiness?.quantity || 0,
      priceSale: currentBusiness?.priceSale || 0,
      tags: currentBusiness?.tags || [],
      taxes: currentBusiness?.taxes || 0,
      gender: currentBusiness?.gender || "",
      category: currentBusiness?.category || "",
      colors: currentBusiness?.colors || [],
      sizes: currentBusiness?.sizes || [],
      newLabel: currentBusiness?.newLabel || { enabled: false, content: "" },
      saleLabel: currentBusiness?.saleLabel || { enabled: false, content: "" },
    }),
    [currentBusiness]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentBusiness) {
      reset(defaultValues);
    }
  }, [currentBusiness, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue("taxes", 0);
    } else {
      setValue("taxes", currentBusiness?.taxes || 0);
    }
  }, [currentBusiness?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentBusiness ? "Update success!" : "Create success!");
      router.push(paths.dashboard.Business.root);
      console.info("DATA", data);
    } catch (error) {
      console.error(error);
    }
  });

  const [selectedCountry, setSelectedCountry] = useState(countriesData[0].id);
  const [selectedCity, setSelectedCity] = useState(countriesData[0].cities[0]);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setSelectedCity(
      countriesData.find((country) => country.id === countryId).cities[0]
    );
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const handleMobileChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue("images", [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered =
        values.images && values.images?.filter((file) => file !== inputFile);
      setValue("images", filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue("images", []);
  }, [setValue]);

  // const handleChangeIncludeTaxes = useCallback((event) => {
  //   setIncludeTaxes(event.target.checked);
  // }, []);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Store Name" />

            <RHFTextField
              name="subDescription"
              label="Sub Description"
              multiline
              rows={4}
            />

            {/* <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack> */}

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info("ON UPLOAD")}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: "repeat(1, 1fr)",
                md: "repeat(2, 1fr)",
              }}
            >
              <RHFTextField name="code" label="Store Code" />
             
              <RHFSelect
              native
                name="country"
                label="Country"
                value={selectedCountry}
                InputLabelProps={{ shrink: true }}
                onChange={handleCountryChange}
              >
                {countriesData.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect
                name="city"
                label="City"
                value={selectedCity}
                InputLabelProps={{ shrink: true }}
                onChange={handleCityChange}
              >
                {countriesData
                  .find((country) => country.id === selectedCountry)
                  ?.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </RHFSelect>
              <RHFTextField
                name="Mobile"
                label="Mobile Number"
                placeholder="Mobile"
                type="number"
                InputLabelProps={{ shrink: true }}
                value={mobileNumber} 
                onChange={handleMobileChange} 
              />
              <RHFTextField
                name="Mobile2"
                label="Mobile Number 2"
                placeholder="Mobile"
                type="number"
                InputLabelProps={{ shrink: true }}
                value={mobileNumber} 
                onChange={handleMobileChange} 
              />
            
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  //   <>
  //     {mdUp && (
  //       <Grid md={4}>
  //         <Typography variant="h6" sx={{ mb: 0.5 }}>
  //           Pricing
  //         </Typography>
  //         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
  //           Price related inputs
  //         </Typography>
  //       </Grid>
  //     )}

  //     <Grid xs={12} md={8}>
  //       <Card>
  //         {!mdUp && <CardHeader title="Pricing" />}

  //         <Stack spacing={3} sx={{ p: 3 }}>
  //           <RHFTextField
  //             name="price"
  //             label="Regular Price"
  //             placeholder="0.00"
  //             type="number"
  //             InputLabelProps={{ shrink: true }}
  //             InputProps={{
  //               startAdornment: (
  //                 <InputAdornment position="start">
  //                   <Box component="span" sx={{ color: 'text.disabled' }}>
  //                     $
  //                   </Box>
  //                 </InputAdornment>
  //               ),
  //             }}
  //           />

  //           <RHFTextField
  //             name="priceSale"
  //             label="Sale Price"
  //             placeholder="0.00"
  //             type="number"
  //             InputLabelProps={{ shrink: true }}
  //             InputProps={{
  //               startAdornment: (
  //                 <InputAdornment position="start">
  //                   <Box component="span" sx={{ color: 'text.disabled' }}>
  //                     $
  //                   </Box>
  //                 </InputAdornment>
  //               ),
  //             }}
  //           />

  //           <FormControlLabel
  //             control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
  //             label="Price includes taxes"
  //           />

  //           {!includeTaxes && (
  //             <RHFTextField
  //               name="taxes"
  //               label="Tax (%)"
  //               placeholder="0.00"
  //               type="number"
  //               InputLabelProps={{ shrink: true }}
  //               InputProps={{
  //                 startAdornment: (
  //                   <InputAdornment position="start">
  //                     <Box component="span" sx={{ color: 'text.disabled' }}>
  //                       %
  //                     </Box>
  //                   </InputAdornment>
  //                 ),
  //               }}
  //             />
  //           )}
  //         </Stack>
  //       </Card>
  //     </Grid>
  //   </>
  // );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: "flex", alignItems: "center" }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {!currentBusiness ? "Create Store" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {/*   {renderPricing}*/}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

BusinessNewEditForm.propTypes = {
  currentBusiness: PropTypes.object,
};
