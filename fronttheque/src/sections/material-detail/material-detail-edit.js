import { useCallback, useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  InputAdornment, 
  Stack, 
  CardActions, 
  CardContent, 
  FormControl, 
  Select, 
  MenuItem, 
  CardHeader, 
  Divider, 
  TextField, 
  Typography, 
  Checkbox, 
  FormGroup, 
  Unstable_Grid2 as Grid, 
  getTouchRippleUtilityClass, 
  checkboxClasses 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from 'src/hooks/use-auth';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { useTheme } from '@mui/material/styles';
import { consumableTypes, lab_supplyTypes } from 'src/data/static_data';
import moment from 'moment';


export const MaterialDetailEdit = (props) => {
  const theme = useTheme();
  const user = useAuth().user;
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [materialID, setMaterialID] = useState(null);
  const [formData, setFormData] = useState({});
  const [checked, setChecked] = useState(false);

  const handleCheckBoxChange = useCallback(() => {
    setChecked((prevState) => !prevState);
  }, []);

  const handleChange = useCallback(
    (event) => {
      setFormData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value
      }));
    });
  
  const handleExpirationDateChange = useCallback(
    (date) => {
      setFormData((prevData) => ({
        ...prevData,
        expiration_date: date
      }));
  });

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const formattedDate = moment(formData.expiration_date, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      formData.expiration_date = formattedDate;

      if (materialID) {
        try {
          const response = await fetch(`${config.apiUrl}/materials/${materialID}/`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          if (!response.ok) {
            const errorMessage = await response.text();
            let decodeResponse = JSON.parse(errorMessage);
            toast.error(decodeResponse.message, { autoClose: false });

          } else {
            const responseData = await response.json();
            toast.success("Material details updated successfully!", { autoClose: false });
            window.location.reload();
          }

        } catch (error) {
          toast.error(`Error trying to submit loan: ${error}`, { autoClose: false });
        }
      }
    }, [formData, materialID]);

  useEffect(() => {
    if (props.data) {
      if (props.data?.owner_details.user_id !== user.user_id && !user.is_staff)
        setIsFormDisabled(true);

      console.log("here")
      const newData = {};
      const excludedKeys = ['owner_details', 'material_id', 'created_at', 'updated_at', 'qrcode', 'available_for_loan', 'availability'];
      for (const key in props.data) {
        if (!excludedKeys.includes(key)) {
          if(key=='expiration_date'){
            newData[key] = new Date(props.data[key]) || null;
            continue;
          }
          newData[key] = props.data[key] || null;
        }
      }
      setFormData(newData);
      setChecked(newData.validation);
      setMaterialID(props.data.material_id);
    }
  }, [props.data]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      validation: checked
    }));
  }, [checked])

  return (props.data && user ?
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader={!isFormDisabled ? "The information can be edited" : ""}
          title="Details"
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
                  label="Title"
                  disabled={isFormDisabled}
                  name="material_title"
                  onChange={handleChange}
                  value={formData.material_title}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Owner"
                  name="owner"
                  helperText={!isFormDisabled ? "This field can't be edited." : ""}
                  disabled
                  value={props.data.owner_details && (`${props.data.owner_details.first_name} ${props.data.owner_details.last_name}`)}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Type"
                  name="type"
                  helperText={!isFormDisabled ? "This field can't be edited." : ""}
                  disabled
                  value={formData.type}
                />
              </Grid>
              <Grid item xs={12} md={6}>
              {formData.type === "CONSUMABLES" && <FormControl fullWidth disabled={isFormDisabled}>
                  <Select
                    labelId="consumable-type-label"
                    name="consumable_type"
                    value={formData.consumable_type || ''}
                    onChange={handleChange}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: '200px',
                          overflowY: 'auto',
                        },
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                      },
                    }}
                    displayEmpty
                    renderValue={(value) => (
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontFamily: 'inherit',
                          color: value ? 'inherit' : theme.palette.text.secondary

                        }}
                      >
                        {value ? consumableTypes.find(type => type.value === value)?.label : 'Consumable Type'}
                      </Typography>
                    )}
                  >
                    {consumableTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>}
              </Grid>
              {formData.type === "CONSUMABLES" &&
                <Grid
                  container
                  xs={12}
                >
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Available Quantity"
                      name="quantity_available"
                      onChange={handleChange}
                      type="number"
                      value={formData.quantity_available}
                      inputProps={{ min: 0 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">M</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider>
                      <DatePicker
                        label="Expiration Date"
                        value={formData.expiration_date}
                        onChange={handleExpirationDateChange}
                        format="dd/MM/yyyy"
                        sx={{ width: "100%" }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              }
              {/* End of consumableTypes dropdown section */}

              {/* Begin of lab_supplies_type */}
              <Grid container xs={12}>
                {formData.type === "LAB_SUPPLIES" && (
                  <>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth disabled={isFormDisabled}>
                        <Select
                          labelId="lab_supply-category-label"
                          name="lab_supply_type"
                          value={formData.lab_supply_type || ''}
                          onChange={handleChange}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: '200px',
                                overflowY: 'auto',
                              },
                            },
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'transparent',
                              },
                            },
                          }}
                          displayEmpty
                          renderValue={(value) => (
                            <Typography
                              variant="subtitle2"
                              style={{
                                fontFamily: 'inherit',
                                color: value ? 'inherit' : theme.palette.text.secondary
                              }}
                            >
                              {value ? lab_supplyTypes.find(type => type.value === value)?.label : 'Lab Supply Type'}
                            </Typography>
                          )}
                        >
                          {lab_supplyTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Quantity"
                        name="lab_supply_quantity"
                        onChange={handleChange}
                        type="number"
                        value={formData.lab_supply_quantity}
                        inputProps={{ min: 0 }}
                        InputProps={{
                          endAdornment: <InputAdornment position="end"></InputAdornment>,
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              {/* End of lab_supplies_type */}

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  disabled={isFormDisabled}
                  onChange={handleChange}
                  value={formData.description}
                  sx={{
                    width: '100%',
                    overflow: 'hidden',
                    maxHeight: '200px'
                  }}
                  multiline
                  rows={4}
                  inputProps={{
                    style: {
                      overflowX: 'auto'
                    },
                  }}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Duration"
                    name="loan_duration"
                    disabled={isFormDisabled}
                    onChange={handleChange}
                    value={formData.loan_duration}
                  />
                  <TextField
                  fullWidth
                  label="Location / Room Number"
                  name="origin"
                  disabled={isFormDisabled}
                  onChange={handleChange}
                  value={formData.origin}
                />
                </Stack>
                
              </Grid>
              {!isFormDisabled &&
                <Grid
                  container
                  xs={12}
                >
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="User Manual Link"
                      name="manual_link"
                      onChange={handleChange}
                      type="text"
                      value={formData.manual_link}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Manufacturer Datasheet Link"
                      name="datasheet_link"
                      onChange={handleChange}
                      type="text"
                      value={formData.datasheet_link}
                    />
                  </Grid>
                </Grid>
              }
              <Grid
                xs={12}
                md={6}
              >
                <Checkbox
                  name="validation"
                  disabled={isFormDisabled}
                  checked={checked}
                  onChange={handleCheckBoxChange}
                  color="primary"
                  inputProps={{ 'aria-label': 'checkbox' }}
                />
                <Typography variant="caption" color="textSecondary">
                  If checked, a validation from the owner will be needed.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        {!isFormDisabled &&
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
            >
              Save details
            </Button>
          </CardActions>
        }
      </Card>
    </form>
    : <p>...Loading</p>
  );
};

