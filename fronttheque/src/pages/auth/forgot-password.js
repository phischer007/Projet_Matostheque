import { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography, Alert } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
  const auth = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        // Ensure your auth provider has a sendPasswordResetEmail (or similarly named) method
        await auth.sendPasswordResetEmail(values.email);
        setEmailSent(true);
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message || 'Something went wrong' });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>Forgot Password | Matostheque</title>
      </Head>
      <Box sx={{ flex: '1 1 auto', alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ maxWidth: 550, px: 3, py: '100px', width: '100%' }}>
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Reset Password</Typography>
            <Typography color="text.secondary" variant="body2">
              Remember your password? &nbsp;
              <Link component={NextLink} href="/auth/login" underline="hover" variant="subtitle2">
                Log in
              </Link>
            </Typography>
          </Stack>

          {emailSent ? (
            <Alert severity="success" sx={{ mt: 3 }}>
              If an account exists with that email, we have sent a reset link. Please check your inbox.
            </Alert>
          ) : (
            <form noValidate onSubmit={formik.handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  type="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </Stack>

              {formik.errors.submit && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {formik.errors.submit}
                </Alert>
              )}

              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;
export default Page;