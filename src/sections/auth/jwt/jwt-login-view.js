import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
import { useSearchParams, useRouter } from "src/routes/hooks";
import { PATH_AFTER_LOGIN } from "src/config-global";
import { useBoolean } from "src/hooks/use-boolean";
import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import CountryMobileLogin from "./Code-Country-Mobail-Form";
import { useAuthContext } from "src/auth/hooks";

const JwtLoginView = () => {
  const { login } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const password = useBoolean();
  const [isSelectActive, setIsSelectActive] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");

  const LoginSchema = Yup.object().shape({
    mobile: Yup.string()
      .required("Mobile is required"),
    password: Yup.string().required("Password is required"),
    countryCode: Yup.string().required("Country code is required"),
  });
  

  const defaultValues = {
    mobile: "",
    password: "",
    countryCode: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login?.(data.mobile, data.password);

      router.push(returnTo || PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const handleCountryCodeChange = (code) => {
    setSelectedCountryCode(code);
  };
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">Sign in to Minimal</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New user?</Typography>

        <Link component={RouterLink} href={paths.auth.jwt.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack>
    </Stack>
  );
  const renderForm = (
    <Stack spacing={2.5} style={{ position: "relative" }}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <CountryMobileLogin
        onCountryCodeChange={handleCountryCodeChange}
        setIsSelectActive={setIsSelectActive}
      />

      {errors.countryCode && !selectedCountryCode && (
        <Alert severity="error">{errors.countryCode.message}</Alert>
      )}

      <RHFTextField
        name="mobile"
        label="Mobile Number"
        error={errors.mobile !== undefined} 
        helperText={errors.mobile && errors.mobile.message} 
        InputLabelProps={{
          style: { display: isSelectActive ? "none" : "block" },
        }}
      />


      <RHFTextField
        name="password"
        label="Password"
        error={errors.password !== undefined} 
        helperText={errors.password && errors.password.message} 
        InputLabelProps={{
          style: { display: isSelectActive ? "none" : "block" },
        }}
        type={password.value ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify
                  icon={
                    password.value ? "solar:eye-bold" : "solar:eye-closed-bold"
                  }
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />


      <Link
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: "flex-end" }}
      >
        Forgot password?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Login
      </LoadingButton>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      <Alert severity="info" sx={{ mb: 3 }}>
        Use mobile : <strong>0526247318</strong> / password :<strong> 12345678</strong>
      </Alert>

      {renderForm}
    </FormProvider>
  
  );
};

export default JwtLoginView;
