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
  Unstable_Grid2 as Grid,
Autocomplete
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from 'src/hooks/use-auth';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { consumableTypes, lab_supplyTypes } from 'src/data/static_data';
import moment from 'moment';
import { getCookie } from '../../utils/csrf';
import { useTheme } from '@mui/material/styles';


export const MaterialDetailEdit = (props) => {
  const user = useAuth().user;
  const theme = useTheme();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [materialID, setMaterialID] = useState(null);
  const [formData, setFormData] = useState({});
  const [checked, setChecked] = useState(false);
  const [isMovable, setisMovable] = useState(false);
  const [is_formation_required, setis_formation_required] = useState(false);
  const [ownersList, setOwnersList] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectSubType, setSelectedSubType] = useState(null);
  const [expiration_date, setexpiration_date] = useState(null);
  const [trust_circleList, setTrust_circle] = useState(null);
  const [serviceList, setServiceList] = useState(null)
  const [formErrors, setFormErrors] = useState({
        title: false,
        description: false,
        owner: false,
        trust_circle:false,
        location: false,
        type : false,
        sub_type:false,
  });

  const handleCheckBoxChange = useCallback(() => {
    setChecked((prevState) => !prevState);
  }, []);

  const handleisMovableBoxChange = useCallback(() => {
    setisMovable((prevState) => !prevState);
  }, []);

  const handleis_formation_requiredBoxChange = useCallback(() => {
    setis_formation_required((prevState) => !prevState);
  }, []);

  const handleChangeNumDec = useCallback((event) => {
  const { name, value } = event.target;

  let cleaned = value
    .replace(/[^0-9.]/g, "") // garde chiffres + point
    .replace(/(\..*)\./g, "$1"); // empêche plusieurs points

  setFormData((prev) => ({
    ...prev,
    [name]: cleaned
  }));
}, []);


const handleChangeNum = useCallback((event) => {
  const { name, value } = event.target;

  setFormData((prevState) => ({
    ...prevState,
    [name]: value.replace(/\D/g, "") // garde seulement les chiffres
  }));
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
    let newdate = moment(date).format("YYYY-MM-DD")
      setexpiration_date(date)
    if (newdate !== "Invalid date") {
      setFormData((prevData) => ({
        ...prevData,
        expiration_date: newdate,
      }));
    }else {
      setFormData({
      ...formData,
      expiration_date: null ,
    });
    }
  });

  const onSelectChange = useCallback(
    (event, values) => {
      setSelectedOwner(values);
    }, []
  );

  const onSelectSubType = useCallback(
    (event) => {
      setSelectedSubType(event.target.value);
    }, []
  );

    useEffect(() => {
    fetch(`${config.apiUrl}/trust_circle/`,{
      credentials: 'include'// Add this so the session cookie is sent!
    })
      .then(response => response.json())
      .then(data => {
        // Sort the data alphabetically by material_title
        if (data) {
            setTrust_circle(data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
    fetch(`${config.apiUrl}/services/`,{
      credentials: 'include'// Add this so the session cookie is sent!
    })
      .then(response => response.json())
      .then(data => {
        // Sort the data alphabetically by material_title
        if (data) {
            setServiceList(data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const newErrors = {
        title: formData.material_title === null,
        description: formData.description === null,
        owner: selectedOwner === null,
        trust_circle: formData.trust_circle == null,
        location: formData.origin === null,
        type : formData.type === null,
        sub_type: formData.sub_type === null,
      };
      setFormErrors(newErrors);

      if (!Object.values(newErrors).some(error => error)) {
        //creating a new FormData to allow sending pictures
        const form = new FormData();
        const fieldsToAppend = [
          { key: 'material_id', value: materialID },
          { key: 'material_title', value: formData.material_title },
          { key: 'description', value: formData.description },
          { key: 'manual_link', value: formData.manual_link },
          { key: 'datasheet_link', value: formData.datasheet_link },
          { key: 'user', value: selectedOwner.user_id },
          { key: 'trust_circle', value: formData.trust_circle},
          { key: 'origin', value: formData.origin },
          { key: 'validation', value: formData.validation },
          { key: 'type', value: formData.type },
          { key: 'sub_type', value: selectSubType },
          { key: 'quantity_available', value: formData.quantity_available },
          { key: 'is_Movable', value: isMovable },
          { key: 'is_formation_required', value: is_formation_required },
          { key: 'service', value: formData.service },
        ];

        // Append additional fields based on specific conditions
        if (formData.type === "LAB_SUPPLIES") {
          fieldsToAppend.push(
            { key: 'loan_duration', value: formData.loan_duration },
          );
        } else if (formData.type === "CONSUMABLES") {
          fieldsToAppend.push(
            { key: 'expiration_date', value: formData.expiration_date },
          );
        }

        // Append all fields to the form
        fieldsToAppend.forEach(({ key, value }) => {
          if (value !== undefined && value !== null) {
            form.append(key, value);
          }
          else if(key === "service"){
            form.append(key, value);
          }
        });
        if (materialID) {
          try {
            const csrftoken = getCookie('csrftoken');
            const response = await fetch(`${config.apiUrl}/materials/${materialID}/`, {
              method: 'PUT',
              credentials: 'include',
              headers: {
                'X-CSRFToken': csrftoken, // Add this
              },
              body: form,
            });

            if (!response.ok) {
              const errorMessage = await response.text();
              let decodeResponse = JSON.parse(errorMessage);
              const errors = Object.entries(decodeResponse).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('\n');
              toast.error(errors);

            } else {
              const responseData = await response.json();
              toast.success("Material details updated successfully!", { autoClose: false });
              window.location.reload()
            }

          } catch (error) {
            toast.error(`Error trying to submit loan: ${error}`, { autoClose: false });
          }
        }
      }
    }, [formData, materialID,selectedOwner,selectSubType,isMovable,is_formation_required]);

    useEffect(() => {
    fetch(`${config.apiUrl}/active_owners/lite/`,{
      credentials: 'include', // Add this
    })
      .then(response => response.json())
      .then(datas => {
        setOwnersList(datas);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (props.data) {
      if (props.data?.owner_details.user_id !== user.user_id && !user.is_staff)
        setIsFormDisabled(true);
      const newData = {};
      const excludedKeys = ['owner_details', 'material_id', 'created_at', 'updated_at', 'qrcode', 'available_for_loan', 'availability'];
      for (const key in props.data) {
        if (!excludedKeys.includes(key)) {
          newData[key] = props.data[key] ?? null;
        }
      }
      setFormData(newData);
      setChecked(newData.validation);
      setisMovable(newData.is_Movable);
      setis_formation_required(newData.is_formation_required);
      setMaterialID(props.data.material_id);
      setSelectedOwner(ownersList.find((owner)=> Number(owner.user_id) === Number(newData.user)))
      setSelectedSubType(newData.sub_type)
      if (newData.expiration_date) {
        setexpiration_date(new Date(newData.expiration_date));
      }
    }
  }, [props.data,ownersList,user]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      validation: checked
    }));
  }, [checked])

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      is_Movable: isMovable
    }));
  }, [isMovable])

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      is_formation_required: is_formation_required
    }));
  }, [is_formation_required])

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
                  InputLabelProps={{ shrink: true }}
                  error={formErrors.title}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                {isFormDisabled && (
                  <TextField
                    fullWidth
                    label="Contact person"
                    disabled={isFormDisabled}
                    value={props.data.owner_details && (`${props.data.owner_details.first_name} ${props.data.owner_details.last_name}`)}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                  {!isFormDisabled &&(
                    <Grid item xs={8} style={{ paddingRight: 8 }}>
                      <Autocomplete
                        label="Owner"
                        name="user_id"
                        required
                        value={selectedOwner}
                        options={ownersList}
                        getOptionLabel={option => option.owner_name}
                        onChange={onSelectChange}
                        renderInput={params => (
                          <TextField
                            {...params}
                            variant="standard"
                            label="Contact person (activate account to see your name)"
                            margin="normal"
                            error={formErrors.owner}
                            sx={{ marginTop: 0 }}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                  )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {isFormDisabled && formData.type &&(
                  <TextField
                    fullWidth
                    label="Team"
                    disabled={isFormDisabled}
                    value={formData.service ? serviceList.find(service => service.service_id === formData.service).service_name : 'Please Select a Team' }
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                {(!isFormDisabled && serviceList && formData.type) &&
                  <Select
                    fullWidth
                    labelId="service-select"
                    name="service"
                    onChange={handleChange}
                    value={formData.service}
                    displayEmpty
                    renderValue={(value) => (
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontFamily: 'inherit',
                          color: value ? 'inherit' : theme.palette.text.secondary
                        }}
                      >
                        {value ? serviceList.find(service => service.service_id
                          === value).service_name : 'Service'}
                      </Typography>
                    )}
                  >
                    <MenuItem key={null} value={null}>
                      Please Select a Team
                    </MenuItem>
                    {serviceList.map((service) => (
                      <MenuItem key={service.service_id} value={service.service_id}>
                        {service.service_name}
                      </MenuItem>
                    ))}
                  </Select>}
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
                  // value={formData.type}
                  value={
                    formData.type === "LAB_SUPPLIES" ? "Lab Supplies" :
                    formData.type === "CONSUMABLES" ? "Consumables" : 
                    formData.type
                  }
                  InputLabelProps={{ shrink: true }}
                  error={formErrors.type}
                />
              </Grid>
              {!isFormDisabled &&
              <Grid xs={12} md={6}>
              <FormControl fullWidth
                disabled={isFormDisabled}>
                  <Select
                    labelId="sub-type-label"
                    name="sub_type"
                    value={selectSubType || ""}
                    error={formErrors.sub_type}
                    onChange={onSelectSubType}
                    renderValue={(value) => (
                      <Typography>
                        {(formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes).find(type => type.value === value)?.label}
                      </Typography>
                    )}
                  >
                    {(formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes).map((type) => (
                      <MenuItem key={type.value}
                        value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
                }
              {isFormDisabled &&
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sub Type"
                    disabled={isFormDisabled}
                    value={(formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes).find(type => type.value === formData.sub_type)?.label}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              }

              {formData.type === "CONSUMABLES" &&
                <Grid xs={12}
                  md={6}>
                  <LocalizationProvider>
                    <DatePicker
                      label="Expiration Date"
                      disabled={isFormDisabled}
                      value={expiration_date ?? null}
                      onChange={handleExpirationDateChange}
                      format="dd/MM/yyyy"
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>
                </Grid>
              }
              {/* End of consumableTypes dropdown section */}
              {/* Begin of lab_supplies_type */}
              {formData.type === "LAB_SUPPLIES" &&
                <Grid 
                  xs={12}
                  md={6}
                >
                  <TextField
                    fullWidth
                    label="Duration"
                    name="loan_duration"
                    disabled={isFormDisabled}
                    onChange={handleChangeNum}
                    value={formData.loan_duration}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">days</InputAdornment>,
                    }}
                  />
                </Grid>
              }
              {/* End of lab_supplies_type */}

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Available Quantity"
                  name="quantity_available"
                  disabled={isFormDisabled}
                  onChange={formData.type === "CONSUMABLES" ? handleChangeNumDec : handleChangeNum}
                  value={formData.quantity_available}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
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
                  InputLabelProps={{ shrink: true }}
                  error={formErrors.description}
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
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                {isFormDisabled && (
                  <TextField
                    fullWidth
                    label="trust_circle"
                    disabled={isFormDisabled}
                    value={formData.trust_circle ? trust_circleList.find(trust_circle => trust_circle.trust_circle_id === formData.trust_circle).trust_circle_name : 'Trust Circle *'}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                  {!isFormDisabled && (
                    <Select
                      labelId="trust_circle-label"
                      name="trust_circle"
                      required
                      value={formData.trust_circle || ''}
                      error={formErrors.trust_circle}
                      onChange={handleChange}
                      displayEmpty
                      renderValue={(value) => (
                        <Typography
                          variant="subtitle2"
                          style={{
                            fontFamily: 'inherit',
                            color: value ? 'inherit' : theme.palette.text.secondary

                          }}
                        >
                          {value ? trust_circleList.find(type => type.trust_circle_id === value).trust_circle_name : 'Trust Circle *'}
                        </Typography>
                      )}
                    >
                      {trust_circleList.map((trust_circle) => (
                        <MenuItem key={trust_circle.trust_circle_id} value={trust_circle.trust_circle_id}>
                          {trust_circle.trust_circle_name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
                </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Stack spacing={2}>
                  <TextField
                  fullWidth
                  label="Location / address"
                  name="origin"
                  error={formErrors.location}
                  disabled={isFormDisabled}
                  onChange={handleChange}
                  value={formData.origin}
                  InputLabelProps={{ shrink: true }}
                />
                </Stack>
                
              </Grid>
              {!isFormDisabled &&
                <Grid
                  container
                  xs={12}
                >
                <Grid xs={12}
                  md={6}>
                  <Checkbox
                    name="is_Movable"
                    disabled={isFormDisabled}
                    checked={isMovable}
                    onChange={handleisMovableBoxChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'checkbox' }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    If checked, The material will be diplayed as not movable from the lab.
                  </Typography>
                </Grid>
                <Grid xs={12}
                  md={6}>
                  <Checkbox
                    name="is_formation_required"
                    disabled={isFormDisabled}
                    checked={is_formation_required}
                    onChange={handleis_formation_requiredBoxChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'checkbox' }}
                  />
                  <Typography variant="caption" color="textSecondary">
                    If checked, The material will require a formation.
                  </Typography>
                </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="User Manual Link"
                      name="manual_link"
                      onChange={handleChange}
                      type="text"
                      value={formData.manual_link}
                      InputLabelProps={{ shrink: true }}
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
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>


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
                  If checked, a validation from the contact person will be needed.
                </Typography>
              </Grid>
                </Grid>
                }
              {isFormDisabled && isMovable &&
                <Grid xs={12}
                  md={6}>
                <Typography variant="caption" color="textSecondary">
                 The material is not movable from the lab.
                </Typography>
                </Grid>
              }
              {isFormDisabled && is_formation_required &&
                <Grid xs={12}
                  md={6}>
                <Typography variant="caption" color="textSecondary">
                  The material require a formation to be use.
                </Typography>
                </Grid>
              }
              {isFormDisabled && checked &&
                <Grid xs={12}
                  md={6}>
                <Typography variant="caption" color="textSecondary">
                  A validation from the contact person is needed.
                </Typography>
                </Grid>
              }
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

