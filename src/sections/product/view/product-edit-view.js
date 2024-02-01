import PropTypes from "prop-types";
// @mui
import Container from "@mui/material/Container";
// routes
import { paths } from "src/routes/paths";
// api
// components
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import ProductNewEditForm from "../product-new-edit-form";
import {  useEffect,  useState } from "react";
import {  endpoints } from 'src/utils/axios';
import axios from "axios";
import { useGetProduct } from "src/api/product";

// ----------------------------------------------------------------------

export default function ProductEditView(props) {
  const productId =props.id

  const { product:products  } = useGetProduct(productId)
  
  const settings = useSettingsContext();
 

  return (
    <Container maxWidth={settings.themeStretch ? false : "lg"}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Product",
            href: paths.dashboard.product.root,
          },
          { name: products?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={products} />
    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
