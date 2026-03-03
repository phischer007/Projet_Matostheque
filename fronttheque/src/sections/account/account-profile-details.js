import { useCallback, useState, useEffect } from 'react';
import {Box,Button,Card,CardActions,CardContent,CardHeader,Divider,TextField,Switch,Typography,Checkbox,Unstable_Grid2 as Grid} from '@mui/material';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { useAuth } from 'src/hooks/use-auth';

export const AccountProfileDetails = (user) => {
  const auth = useAuth();
  const sessionToken = auth.session_token
  const [values, setValues] = useState({
    ...user
  });

  const [isChecked, setIsChecked] = useState(values.role == "owner"? true : false);
  const [formData, setFormData] = useState({
    first_name: null,
    last_name: null,
    contact: null,
    role: null
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
        const response = await fetch(`${config.apiUrl}/users/${user.user_id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionToken
          },
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
            toast.error("User not found. Please try again.", { autoClose: false });
          } else if (decodeResponse.message === "Session token not found") {
            // Handle session token not found error
            toast.error("Session token not found. Please try again.", { autoClose: false });
          } else {
            // Handle other errors
            toast.error("An error occurred. Please try again later.", { autoClose: false });
          }

        } else {
          const updatedUserData = await response.json();

          await auth.updateUser(updatedUserData.user_id);

          toast.success("Your information was successfully updated!");
          window.location.reload();
        }

      } catch (error) {
         // Handle unexpected errors
        console.error("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred. Please try again later.", { autoClose: false });
      }

  },[formData, isChecked, user]);

  useEffect(() => {
    setFormData({
      first_name: values.first_name,
      last_name: values.last_name,
      contact: values.owner_contact,
      role: values.role
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
          subheader="The information can be edited"
          title="Profile"
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
                  label="First name"
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
                  label="Last name"
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
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  disabled
                  value={values.email}
                />
              </Grid>
              {isChecked?
                <Grid
                  xs={12}
                  md={6}
                >
                  <TextField
                    type="number"
                    fullWidth
                    label="Phone Number"
                    name="owner_contact"
                    onChange={handleChange}
                    value={values.owner_contact}
                    placeholder='Ex. 0612354525'
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid> : null}
              <Grid
                xs={12}
                md={6}
              >
                <Switch
                  checked={isChecked}
                  onChange={handleToggleChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'toggle checkbox' }}
                />
                <Typography variant="caption" color="textSecondary">
                  Activate Owner Account
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
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
