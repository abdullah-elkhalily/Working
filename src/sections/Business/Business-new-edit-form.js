/* eslint-disable no-use-before-define */

import PropTypes from "prop-types";
import * as Yup from "yup";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";

import Grid from "@mui/material/Unstable_Grid2";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";

import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "src/routes/paths";
// hooks
import { useResponsive } from "src/hooks/use-responsive";
// _mock
// import { NumbersID, countriesData } from "src/_mock";
import { createBusiness, updateBusiness } from "src/api/Business";
// components
// import { useSnackbar } from "src/components/snackbar";
import { useRouter } from "src/routes/hooks";
import FormProvider, {
  RHFSelect,
  RHFUpload,
  RHFTextField,
  RHFUploadAvatar,
} from "src/components/hook-form";
import axios from "axios";
import { CounteryCitesBusines } from "./Business-Countery-cites";
import BusinessMap from "./Business-Map-Location";
import { useAuthContext } from "src/auth/hooks";
import { fData } from "src/utils/format-number";
// ----------------------------------------------------------------------

export default function BusinessNewEditForm({ currentBusiness }) {
  const router = useRouter();
  const auth = useAuthContext();

  const mdUp = useResponsive("up", "md");

  // const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    // images: Yup.array().min(1, "Images is required"),
    // image: Yup.string().required("Image is required"),
    address: Yup.string().required("Address is required"),
    description: Yup.string().required("Description is required"),
    mobile_number:Yup.number().required("Mobile is required"),
  
    email:Yup.string().required("Email is required"),
    //   city: Yup.string().required("City is required"),
    // country: Yup.string().required("Country is required"),
      // taxes: Yup.number(),
    // is_store_id_visible: Yup.boolean().required("Store visibility is required"),
    // lat:Yup.string().required("the location is  requierd ")
  });

  const defaultValues = useMemo(
    () => ({
      name: currentBusiness?.name || "",
      description: currentBusiness?.description || "",
      subDescription: currentBusiness?.subDescription || "",
      // image: currentBusiness?.image ||"",

      code: currentBusiness?.code || "",

      mobile_number: currentBusiness?.mobile_number || 0,
      facebook: currentBusiness?.facebook || "",
      website: currentBusiness?.website || "",
      instagram: currentBusiness?.instagram || "",
      email: currentBusiness?.email || "",
      whatsapp: currentBusiness?.whatsapp || "",
      snapchat: currentBusiness?.snapchat || "",
      address: currentBusiness?.address || "",
      country: currentBusiness?.country || "",
      city: currentBusiness?.city || "",
      country_id: currentBusiness?.country_id || "",
      city_id: currentBusiness?.city_id || "",
      lat:currentBusiness?.lat||4748,
      log:currentBusiness?.long||1425,

      // lat: currentBusiness?.lat || selectedLocation.lat,
      // business_department_id: currentBusiness?.business_department_id || 0,
      // is_store_id_visible: createBusiness?.is_store_id_visible || true,

      store_id: currentBusiness?.store_id || 0,
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
    console.log(currentBusiness?.city);
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
  const [displayMap, setdisplayMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    if (selectedLocation) {
      setValue("lat", location.lat);
      setValue("lng", location.lng);
    }
  };

  const butonLocation = () => {
    setdisplayMap(!displayMap);
  };
  const slectLocation = () => {
    setdisplayMap(!displayMap);
  };
  const handleCountryChange = (selectedCountry) => {
    console.log("Selected Country:", selectedCountry);
    setValue("country_id", selectedCountry);
    // Handle the selected country change in your form component
  };

  const handleCityChange = (selectedCity) => {
    console.log("Selected City:", selectedCity);
    setValue("city_id", selectedCity);
    // Handle the selected city change in your form component
  };

  const onSubmit = handleSubmit(async (formData) => {
    formData.business_department_id = 1; 
  formData.is_store_id_visible=1;

  
    if (currentBusiness) {
      try {
        const { success, data } = await updateBusiness(
          currentBusiness.id,
          formData
        );
        if (success) {
          router.push(paths.dashboard.Business.root);
          console.log("Business updated successfully:", data);
        } else {
          console.error("Failed to update business:", data.error);
        }
      } catch (error) {
        console.error("An error occurred during business update:", error);
      }
    } else {


      formData.lat = selectedLocation ? selectedLocation.lat : null;
      formData.lng = selectedLocation ? selectedLocation.lng : null;
    
      try {
        const {success ,data}= await createBusiness(formData, auth);
  
        if (success) {
          router.push(paths.dashboard.Business.root);

          console.log("Business created successfully!",data);
          // Handle redirection or any other action upon successful creation
        } else {
          console.error("Failed to create business.");
        }
      } catch (error) {
        console.error("An error occurred during business creation:", error);
      }
    }
  });
  

  // const [isStoreIdVisible, setIsStoreIdVisible] = useState(false);
  async function handleDropCover(acceptedFiles) {
    if (currentBusiness) {
      let file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      const data = {
        image_file_name: newFile,
        imageable_type: "Business",
        imageable_id: currentBusiness?.id,
      };
      console.log(data);
      setValue("image", newFile.preview);
      try {
        const response = await axios.post('https://dapis.ma-moh.com/api/images/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${auth?.user?.accessToken}`,
          }
        });
  
        console.log('Image uploaded successfully:', response?.data?.data?.image);
        setValue("image", response?.data?.data?.image);
  
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      const file = acceptedFiles[0]; // Get the first file from acceptedFiles
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue("image", newFile);
      }
    }
  }
  
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
              name="description"
              label="Sub Description"
              multiline
              rows={4}
            />
             <Stack spacing={1.5}>
              <Typography variant="subtitle">Cover Image</Typography>
              <RHFUploadAvatar
                name="image"
                maxSize={3145728}
                onDrop={handleDropCover}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: "auto",
                      display: "block",
                      textAlign: "center",
                      color: "text.disabled",
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              {/* <RHFUpload
                multiple
                thumbnail
                name="image"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info("ON UPLOAD")}
              /> */}
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
             

              <RHFTextField
                name="address"
                label="Address"
                placeholder="Address"
                type="text"
                InputLabelProps={{ shrink: true }}
              />

              <CounteryCitesBusines
                onCountryChange={handleCountryChange}
                onCityChange={handleCityChange}
              />
            </Box>
            <Stack>
              <Grid>
                {!displayMap === false && (
                  <BusinessMap onLocationChange={handleLocationChange} />
                )}
              </Grid>

              <Grid>
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={butonLocation}
                  style={{ display: displayMap ? "none" : "visible" }}
                >
                  Choose Your Location
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  size="large"
                  onClick={slectLocation}
                  style={{ display: selectedLocation ? "block" : "none" }}
                >
                  {!displayMap ? "Edit Your Location " : "Done"}
                </LoadingButton>
              </Grid>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderlinkes = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            contact
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
              <RHFTextField
                name="mobile_number"
                label="Mobile Number"
                placeholder="Mobile"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="website"
                label="Website"
                placeholder="Website"
                type="text"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="facebook"
                label="facebook"
                placeholder="facebook"
                type="text"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="instagram"
                label="instgram"
                placeholder="instagram"
                type="text"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="whatsapp"
                label="Whatsapp"
                placeholder="Mobile Whatsapp"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="email"
                label="Email"
                placeholder="Email"
                type="email"
                InputLabelProps={{ shrink: true }}
              />
              <RHFTextField
                name="snapchat"
                label="snapchat"
                placeholder="snapchat"
                type="text"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );
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
        {renderlinkes}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

BusinessNewEditForm.propTypes = {
  currentBusiness: PropTypes.object,
};
