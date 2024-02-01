import PropTypes, { array } from "prop-types";
import * as Yup from "yup";
import { useCallback, useMemo, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
  // PRODUCT_SIZE_OPTIONS,
  // PRODUCT_GENDER_OPTIONS,
  // PRODUCT_COLOR_NAME_OPTIONS,
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
  RHFUploadAvatar,
} from "src/components/hook-form";
import { fData } from "src/utils/format-number";
import axios from "axios";
import { useMockedUser } from "src/hooks/use-mocked-user";
import axiosInstance, { endpoints, sender, sender2 } from "src/utils/axios";
import { getValue } from "@mui/system";
import uuidv4 from "src/utils/uuidv4";
import { customAlphabet } from "nanoid";
import { useGetAllBusinesses, useGetBusinessByCategories, useGetBussiness } from "src/api/bussiness";
import { useGetCountry } from "src/api/product";
import { useAuthContext } from "src/auth/hooks";
import { updateProduct } from "../../api/product";
// ----------------------------------------------------------------------

export default function ProductNewEditForm({ currentProduct }) {
  const { user } = useMockedUser();
  const auth = useAuthContext();

  const router = useRouter();

  const mdUp = useResponsive("up", "md");

  const { enqueueSnackbar } = useSnackbar();
  const { businesses:bussines } = useGetAllBusinesses();


  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    // images: Yup.array().min(1, 'Images is required'),
    // tags: Yup.array().min(2, 'Must have at least 2 tags'),
    // category: Yup.string().required('Category is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
    // taxes: Yup.number(),
  });
  const [bussinesids, setbussinsid] = useState()
  const { bussiness } = useGetBussiness(bussinesids);
  const {country} = useGetCountry(bussiness?.country_id);

  const [formData2, setFormData] = useState({

    currencies:2||null,
    region_id:  currentProduct?.region_id || bussiness?.region_id || null ,
    country_id: currentProduct?.country_id ||  bussiness?.country_id  || null ,
    city_id: currentProduct?.city_id ||  bussiness?.city_id ||null ,
    lat: currentProduct?.lat || bussiness?.lat || null,
    lng: currentProduct?.long || bussiness?.long || null,
  });



  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || null,
      description: currentProduct?.description || null,
      image: currentProduct?.image || null,
      business_id: currentProduct?.bussiness || null,
      business_department_id: currentProduct?.department ||5,
      price: currentProduct?.price || 0,
      qty: currentProduct?.qty || 1,
      price_before_discount: currentProduct?.price_before_discount || 0,
      category: currentProduct?.category || null,
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues ,
  });
  const {
    reset,
    control,
    setValue,
    watch,
    handleSubmit,
  } = methods;



  useEffect(() => {
    setFormData({
      region_id:currentProduct?.country_id||bussiness?.region_id || null ,
      country_id:currentProduct?.country_id ||bussiness?.country_id  ||null ,
      city_id: currentProduct?.city_id ||bussiness?.city_id  ||null,
      lat:currentProduct?.lat || bussiness?.lat  || null,
      lng: currentProduct?.long || bussiness?.long  || null,
      currencies:currentProduct?.country_id || country?.currencies||2 ||null,
    });
   
   
 
  
    if (currentProduct?.bussiness != null) {
      setValue("business_id", currentProduct?.bussiness);
    }
    if (currentProduct) {
      
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset ,bussiness]);











const { businessesCategories:Categories } = useGetBusinessByCategories(bussinesids,5);
  


  const onSubmit = handleSubmit(async (data) => {
    // const image=new FormData()
    // image.append('image',selectedFile)
    const combinedData = { ...data, ...formData2   }
      if (currentProduct) {
        try {
          const result = await updateProduct(
            currentProduct.id,
            combinedData
          );
          console.log(result);
          if (result.sucess) {
            enqueueSnackbar(" Product updated successfully!");
            router.push(paths.dashboard.product.root);
            console.log("Product updated successfully:", data);
          } else {
            enqueueSnackbar("Error ", { variant: "error" })
            console.error("Failed to update Product:", data.error);
          }
        } catch (error) {
          enqueueSnackbar("Error ", { variant: "error" })
          console.error("An error occurred during business update:", error);
        }
      } else {
        try {
          const response = await axios.post(`https://dapis.ma-moh.com/${endpoints.product.create}`, combinedData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${auth?.user?.accessToken}`,
            }
          });
          console.log(response);
          enqueueSnackbar("Create success!");
          reset();
          router.push(paths.dashboard.product.root);
          console.info("DATA", data);
    
        } catch (error) {
          console.error(error);
          enqueueSnackbar("Error ", { variant: "error" })
          // console.error('Error uploading image:', error);
        }
    
       
      }
  });


  async function handleDropCover(acceptedFiles) {
    if(currentProduct){

      let file=acceptedFiles[0]

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
        const data = {
      image_file_name: newFile,
      imageable_type: "Product",
      imageable_id: currentProduct.id,
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
      enqueueSnackbar("Image uploaded successfully");
      console.log('Image uploaded successfully:', response.data.data.image);
      setValue("image", response.data.data.image);

    } catch (error) {
      enqueueSnackbar("Error uploading image", { variant: "error" })
      console.error('Error uploading image:', error);
    }

  
    }
    else{
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      setValue("image", newFile);
    }
  } 
  }



  


  // const [selectedCategories, setSelectedCategories] = useState([]);

  // const handleCategoriesChange = (event, values) => {
  //   setSelectedCategories(values);
  // };
  // const convertToString = () => {
  //   const stringRepresentation = selectedCategories.join(", ");
  //   console.log(stringRepresentation);
  //   setValue("category", stringRepresentation);
  // };

  const values=watch()

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
            <RHFTextField name="name" label="Product Name" />

            <RHFTextField
              name="description"
              label=" Description"
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
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
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
              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <Controller
                name="business_id"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RHFSelect
                    native
                    label="Business"
                    {...field}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      const selectedBusinessId = e.target.value;
                    
                      field.onChange(selectedBusinessId);
                      setbussinsid(selectedBusinessId)
                      
                    }}
                  >
                    <option value="" disabled>
                      Select Business
                    </option>
                    {bussines?.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </RHFSelect>
                )}
              />
            </Box>
            {/* <RHFAutocomplete
              name="categorySelected"
              label="Categories"
              placeholder="Categories"
              multiple
              freeSolo
              options={Categories.map((option) => option.name)}
              onChange={handleCategoriesChange}
              value={selectedCategories}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option.id} value={option.name}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    value={index}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}
            {/* <RHFAutocomplete
              name="category"
              label="Categories"
              placeholder="Categories"
              multiple
              freeSolo
              options={Categories?.map((option) => option?.name)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option?.id} value={option?.name}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected?.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={option}
                    value={index}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            /> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Product Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="price_before_discount"
              label="Product Price After Sale "
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: "text.disabled" }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />
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
        >
          {!currentProduct ? "Create Product" : "Save Changes"}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
