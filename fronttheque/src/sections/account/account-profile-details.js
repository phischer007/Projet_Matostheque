import { useCallback, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Switch,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { useAuth } from 'src/hooks/use-auth';
import { getCookie } from 'src/utils/csrf';

import { useTranslation } from 'react-i18next';

// -------------------------------------------------------------------------------------- //


export const AccountProfileDetails = (user) => {
  const auth = useAuth();
  const [values, setValues] = useState({
    ...user
  });

  const { t } = useTranslation();

  const [isChecked, setIsChecked] = useState(values.role == "owner"? true : false);
  const [formData, setFormData] = useState({
    first_name: null,
    last_name: null,
    role: null,
    service: null
  });

  const handleToggleChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      formData.role = isChecked ? "owner" : "user";
      try {
        const csrftoken = getCookie('csrftoken');
        const response = await fetch(`${config.apiUrl}/users/${user.user_id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
          },
          credentials: 'include', // Add this so the session cookie is sent!
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          let decodeResponse = JSON.parse(errorMessage);

          // Handle different types of errors
          if (decodeResponse.error === "Session expired") {
            // Handle session expired error
            toast.error("Your session has expired. Please log in again.", { autoClose: false });
            // Clear session token
            setTimeout(() => {
              auth.signOut();
            }, 3000);

          } else if (decodeResponse.message === "User not found") {
            // Handle user not found error
            toast.error(t('newAccount.notFoundUser', 'User not found. Please try again.'), { autoClose: false });
          } else if (decodeResponse.message === "Session token not found") {
            // Handle session token not found error
            toast.error(t('newAccount.notFoundSession', 'Session token not found. Please try again.'), { autoClose: false });
          } else if (decodeResponse.message === "You can't become a simple user") {
            // Handle session token not found error
            toast.errot(t('newAccount.errorUserOwnership', "You can't become a user because you still own materials"), { autoClose: false });
            setIsChecked(!isChecked)
          } else {
            // Handle other errors
            toast.error("An error occurred. Please try again later.", { autoClose: false });
          }

        } else {
          const updatedUserData = await response.json();

          await auth.updateUser(updatedUserData.user_id);

          toast.success(t('newAccount.successInfoUpdate', 'Your information was successfully updated!'), { autoClose: false });
          window.location.reload();
        }

      } catch (error) {
         // Handle unexpected errors
        toast.error(t('newAccount.errorInfoUpdate', 'An error occurred. Please try again later.'), { autoClose: false });
      }

  },[formData, isChecked, user]);

  useEffect(() => {
    setFormData({
      first_name: values.first_name,
      last_name: values.last_name,
      //contact: values.owner_contact,
      role: values.role,
      service: values.service
    });
  }, [values]);
  

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          title={t('newAccount.profile', 'Profile')}
          subheader={t('newAccount.profileSubtitle', 'The information can be edited')}
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label={t('newAccount.firstName', 'First Name')}
                  name="first_name"
                  onChange={handleChange}
                  value={values.first_name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label={t('newAccount.lastName', 'Last Name')}
                  name="last_name"
                  onChange={handleChange}
                  value={values.last_name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label={t('newAccount.emailaddress', 'Email Address')}
                  name="email"
                  disabled
                  value={values.email}
                />
              </Grid>
              <Grid
                xs={12}
                md={12}
              >
                <Switch
                  checked={isChecked}
                  onChange={handleToggleChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'toggle checkbox' }}
                />
                <Typography variant="caption" color="textSecondary">
                  {t('newAccount.roleOwnership', 'Activate your account to gain access to adding materials.')}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            type="submit"
            variant="contained"
          >
            {/* Save details */}
            {t('newAccount.btnSave', 'Save details')}
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
