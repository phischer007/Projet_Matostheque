import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  Box, 
  Button, 
  Link, 
  Stack, 
  TextField, 
  Typography, 
  Alert 
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
  const router = useRouter();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      first_name: Yup.string().max(255).required('First name is required'),
      last_name: Yup.string().max(255).required('Last name is required'),
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      password: Yup.string().min(7).max(255).required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        await auth.signUp(
          values.email, 
          values.first_name, 
          values.last_name, 
          values.password
        );
        router.push('/');
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          Register | Matostheque
        </title>
      </Head>
      <Box 
        sx={{ 
          flex: '1 1 auto', 
          alignItems: 'center', 
          display: 'flex', 
          justifyContent: 'center' 
          }}
        >
        <Box 
          sx={{ 
            maxWidth: 550, 
            px: 3, 
            py: '100px', 
            width: '100%' 
            }}
          >
          <Stack 
            spacing={1} 
            sx={{ 
              mb: 3 
            }}
          >
            <Typography 
              variant="h4"
            >
              Register
            </Typography>

            <Typography 
              color="text.secondary" 
              variant="body2"
            >
              Already have an account? &nbsp;
              <Link 
                component={NextLink} 
                href="/auth/login" 
                underline="hover" 
                variant="subtitle2"
              >
                Log in
              </Link>
            </Typography>
          </Stack>
          
          <form 
            noValidate 
            onSubmit={formik.handleSubmit}
          >
            <Stack spacing={3}>
              <TextField
                error={!!(formik.touched.first_name && formik.errors.first_name)}
                fullWidth
                helperText={formik.touched.first_name && formik.errors.first_name}
                label="First Name"
                name="first_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.first_name}
              />

              <TextField
                error={!!(formik.touched.last_name && formik.errors.last_name)}
                fullWidth
                helperText={formik.touched.last_name && formik.errors.last_name}
                label="Last Name"
                name="last_name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.last_name}
              />

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

              <TextField
                error={!!(formik.touched.password && formik.errors.password)}
                fullWidth
                helperText={formik.touched.password && formik.errors.password}
                label="Password"
                name="password"
                type="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </Stack>
            
            {formik.errors.submit && (
              <Alert 
                severity="error" 
                sx={{ mt: 3 }}
              >
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
              {formik.isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => 
  <AuthLayout>
    {page}
  </AuthLayout>
;

export default Page;
