// import { useCallback, useState, useEffect } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   InputAdornment,
//   Stack,
//   CardActions,
//   CardContent,
//   FormControl,
//   Select,
//   MenuItem,
//   CardHeader,
//   Divider,
//   TextField,
//   Typography,
//   Checkbox,
// Autocomplete
// } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { useAuth } from 'src/hooks/use-auth';
// import { toast } from 'react-toastify';
// import config from 'src/utils/config';
// import { consumableTypes, lab_supplyTypes } from 'src/data/static_data';
// import moment from 'moment';
// import { getCookie } from '../../utils/csrf';
// import { useTheme } from '@mui/material/styles';

// import { useTranslation } from 'react-i18next';


// // -------------------------------------------------------------------------------- //


// export const MaterialDetailEdit = (props) => {
//   const user = useAuth().user;
//   const theme = useTheme();

//   const { t } = useTranslation();

//   const [isFormDisabled, setIsFormDisabled] = useState(false);
//   const [materialID, setMaterialID] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [checked, setChecked] = useState(false);
//   const [ownersList, setOwnersList] = useState(null);
//   const [selectedOwner, setSelectedOwner] = useState(null);
//   const [selectSubType, setSelectedSubType] = useState(null);
//   const [expiration_date, setexpiration_date] = useState(null);
//   const [formErrors, setFormErrors] = useState({
//         title: false,
//         description: false,
//         owner: false,
//         location: false,
//         type : false,
//         sub_type:false,
//   });

//   const handleCheckBoxChange = useCallback(() => {
//     setChecked((prevState) => !prevState);
//   }, []);

//   const handleChangeNumDec = useCallback((event) => {
//     const { name, value } = event.target;

//     let cleaned = value
//       .replace(/[^0-9.]/g, "") 
//       .replace(/(\..*)\./g, "$1"); 

//     setFormData((prev) => ({
//       ...prev,
//       [name]: cleaned
//     }));
//   }, []);


//   const handleChangeNum = useCallback((event) => {
//     const { name, value } = event.target;

//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: value.replace(/\D/g, "")
//     }));
//   }, []);



//   const handleChange = useCallback(
//     (event) => {
//       setFormData((prevData) => ({
//         ...prevData,
//         [event.target.name]: event.target.value
//       }));
//     });
  
//   const handleExpirationDateChange = useCallback(
//     (date) => {
//     let newdate = moment(date).format("YYYY-MM-DD")
//       setexpiration_date(date)
//     if (newdate !== "Invalid date") {
//       setFormData((prevData) => ({
//         ...prevData,
//         expiration_date: newdate,
//       }));
//     }else {
//       setFormData({
//       ...formData,
//       expiration_date: null ,
//     });
//     }
//   });

//   const onSelectChange = useCallback(
//     (event, values) => {
//       setSelectedOwner(values);
//     }, []
//   );

//   const onSelectSubType = useCallback(
//     (event) => {
//       setSelectedSubType(event.target.value);
//     }, []
//   );

//   const handleSubmit = useCallback(
//     async (event) => {
//       event.preventDefault();
//       const newErrors = {
//         title: formData.material_title === null,
//         description: formData.description === null,
//         owner: selectedOwner === null,
//         location: formData.origin === null,
//         type : formData.type === null,
//         sub_type: formData.sub_type === null,
//       };
//       setFormErrors(newErrors);

//       if (!Object.values(newErrors).some(error => error)) {
//         const form = new FormData();
//         const fieldsToAppend = [
//           { key: 'material_id', value: materialID },
//           { key: 'material_title', value: formData.material_title },
//           { key: 'description', value: formData.description },
//           { key: 'manual_link', value: formData.manual_link },
//           { key: 'datasheet_link', value: formData.datasheet_link },
//           { key: 'user', value: selectedOwner.user_id },
//           { key: 'origin', value: formData.origin },
//           { key: 'validation', value: formData.validation },
//           { key: 'type', value: formData.type },
//           { key: 'sub_type', value: selectSubType },
//           { key: 'quantity_available', value: formData.quantity_available },
//         ];

//         // Append additional fields based on specific conditions
//         if (formData.type === "LAB_SUPPLIES") {
//           fieldsToAppend.push(
//             { key: 'loan_duration', value: formData.loan_duration },
//           );
//         } else if (formData.type === "CONSUMABLES") {
//           fieldsToAppend.push(
//             { key: 'expiration_date', value: formData.expiration_date },
//           );
//         }

//         // Append all fields to the form
//         fieldsToAppend.forEach(({ key, value }) => {
//           if (value !== undefined && value !== null) {
//             form.append(key, value);
//           }
//         });
//         if (materialID) {
//           try {
//             const csrftoken = getCookie('csrftoken');
//             const response = await fetch(`${config.apiUrl}/materials/${materialID}/`, {
//               method: 'PUT',
//               credentials: 'include',
//               headers: {
//                 'X-CSRFToken': csrftoken, 
//               },
//               body: form,
//             });

//             if (!response.ok) {
//               const errorMessage = await response.text();
//               let decodeResponse = JSON.parse(errorMessage);
//               const errors = Object.entries(decodeResponse).map(([field, messages]) => `${field}: ${messages.join(', ')}`).join('\n');
//               toast.error(errors);

//             } else {
//               const responseData = await response.json();
//               toast.success("Material details updated successfully!", { autoClose: false });
//               window.location.reload()
//             }

//           } catch (error) {
//             toast.error(`Error trying to submit loan: ${error}`, { autoClose: false });
//           }
//         }
//       }
//     }, [formData, materialID,selectedOwner,selectSubType]);

//     useEffect(() => {
//       fetch(`${config.apiUrl}/active_owners/lite/`,{
//         credentials: 'include', // Add this
//       })
//         .then(response => response.json())
//         .then(datas => {
//           setOwnersList(datas);
//         })
//         .catch(error => console.error('Error fetching data:', error));
//     }, []);

//   useEffect(() => {
//     if (props.data) {
//       if (props.data?.owner_details.user_id !== user.user_id && !user.is_staff)
//         setIsFormDisabled(true);
//       const newData = {};
//       const excludedKeys = ['owner_details', 'material_id', 'created_at', 'updated_at', 'qrcode', 'available_for_loan', 'availability'];
//       for (const key in props.data) {
//         if (!excludedKeys.includes(key)) {
//           newData[key] = props.data[key] ?? null;
//         }
//       }
//       setFormData(newData);
//       setChecked(newData.validation);
//       setMaterialID(props.data.material_id);
//       setSelectedSubType(newData.sub_type)
//       if (newData.expiration_date) {
//         setexpiration_date(new Date(newData.expiration_date));
//       }

//       if (ownersList) {
//         const targetUserId = newData.user || props.data.owner_details?.user_id;
//         const matchedOwner = ownersList.find((owner) => Number(owner.user_id) === Number(targetUserId));
        
//         if (matchedOwner) {
//           setSelectedOwner(matchedOwner);
//         } else if (props.data?.owner_details) {
//           // Fallback: Manually construct an object matching what Autocomplete expects
//           setSelectedOwner({
//             user_id: targetUserId,
//             owner_name: `${props.data.owner_details.first_name || ''} ${props.data.owner_details.last_name || ''}`.trim() || 'Unknown Owner'
//           });
//         } else {
//           setSelectedOwner(null);
//         }
//       }

//     }
//   }, [props.data,ownersList,user]);

//   useEffect(() => {
//     setFormData((prevData) => ({
//       ...prevData,
//       validation: checked
//     }));
//   }, [checked])

//   return (props.data && user ?
//     <form
//       autoComplete="off"
//       noValidate
//       onSubmit={handleSubmit}
//     >
//       <Card>
//         <CardHeader
//           subheader={!isFormDisabled ? "The information can be edited" : ""}
//           title="Details"
//         />
//         <CardContent sx={{ pt: 0 }}>
//           <Box sx={{ m: -1.5 }}>
//             <Grid
//               container
//               spacing={3}
//             >
//               <Grid
//                 xs={12}
//                 md={6}
//               >
//                 <TextField
//                   fullWidth
//                   label="Title"
//                   disabled={isFormDisabled}
//                   name="material_title"
//                   onChange={handleChange}
//                   value={formData.material_title}
//                   InputLabelProps={{ shrink: true }}
//                   error={formErrors.title}
//                 />
//               </Grid>

//               <Grid
//                 xs={12}
//                 md={6}
//               >
//                 {isFormDisabled && (
//                   <TextField
//                     fullWidth
//                     label="Contact person"
//                     disabled={isFormDisabled}
//                     value={props.data.owner_details && (`${props.data.owner_details.first_name} ${props.data.owner_details.last_name}`)}
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 )}
//                   {!isFormDisabled &&(
//                     <Grid item xs={8} style={{ paddingRight: 8 }}>
//                       <Autocomplete
//                         label="Owner"
//                         name="user_id"
//                         required
//                         value={selectedOwner}
//                         options={ownersList}
//                         getOptionLabel={option => option.owner_name}
//                         onChange={onSelectChange}
//                         renderInput={params => (
//                           <TextField
//                             {...params}
//                             variant="standard"
//                             label="Contact person (activate account to see your name)"
//                             margin="normal"
//                             error={formErrors.owner}
//                             sx={{ marginTop: 0 }}
//                             fullWidth
//                             InputLabelProps={{ shrink: true }}
//                               />
//                             )}
//                           />
//                         </Grid>
//                   )}
//               </Grid>

//               <Grid
//                 xs={12}
//                 md={6}
//               >
//                 <TextField
//                   fullWidth
//                   label="Type"
//                   name="type"
//                   helperText={!isFormDisabled ? "This field can't be edited." : ""}
//                   disabled
//                   // value={formData.type}
//                   value={
//                     formData.type === "LAB_SUPPLIES" ? "Lab Supplies" :
//                     formData.type === "CONSUMABLES" ? "Consumables" : 
//                     formData.type
//                   }
//                   InputLabelProps={{ shrink: true }}
//                   error={formErrors.type}
//                 />
//               </Grid>
//               {!isFormDisabled &&
//               <Grid xs={12} md={6}>
//               <FormControl fullWidth
//                 disabled={isFormDisabled}>
//                   <Select
//                     labelId="sub-type-label"
//                     name="sub_type"
//                     value={selectSubType || ""}
//                     error={formErrors.sub_type}
//                     onChange={onSelectSubType}
//                     renderValue={(value) => (
//                       <Typography>
//                         {(formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes).find(type => type.value === value)?.label}
//                       </Typography>
//                     )}
//                   >
//                     {(formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes).map((type) => (
//                       <MenuItem key={type.value}
//                         value={type.value}>
//                         {type.label}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//                 }
//               {isFormDisabled &&
//                 <Grid xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     label="Sub Type"
//                     disabled={isFormDisabled}
//                     value={(formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes).find(type => type.value === formData.sub_type)?.label}
//                     InputLabelProps={{ shrink: true }}
//                   />
//                 </Grid>
//               }

//               {formData.type === "CONSUMABLES" &&
//                 <Grid xs={12}
//                   md={6}>
//                   <LocalizationProvider>
//                     <DatePicker
//                       label="Expiration Date"
//                       disabled={isFormDisabled}
//                       value={expiration_date ?? null}
//                       onChange={handleExpirationDateChange}
//                       format="dd/MM/yyyy"
//                       sx={{ width: "100%" }}
//                     />
//                   </LocalizationProvider>
//                 </Grid>
//               }
//               {/* End of consumableTypes dropdown section */}
//               {/* Begin of lab_supplies_type */}
//               {formData.type === "LAB_SUPPLIES" &&
//                 <Grid 
//                   xs={12}
//                   md={6}
//                 >
//                   <TextField
//                     fullWidth
//                     label="Duration"
//                     name="loan_duration"
//                     disabled={isFormDisabled}
//                     onChange={handleChangeNum}
//                     value={formData.loan_duration}
//                     InputLabelProps={{ shrink: true }}
//                     InputProps={{
//                       endAdornment: <InputAdornment position="end">days</InputAdornment>,
//                     }}
//                   />
//                 </Grid>
//               }
//               {/* End of lab_supplies_type */}

//               <Grid xs={12} md={6}>
//                 <TextField
//                   fullWidth
//                   label="Available Quantity"
//                   name="quantity_available"
//                   disabled={isFormDisabled}
//                   onChange={formData.type === "CONSUMABLES" ? handleChangeNumDec : handleChangeNum}
//                   value={formData.quantity_available}
//                   InputLabelProps={{ shrink: true }}
//                 />
//               </Grid>

//               <Grid
//                 xs={12}
//                 md={6}
//               >
//                 <TextField
//                   fullWidth
//                   label="Description"
//                   name="description"
//                   disabled={isFormDisabled}
//                   onChange={handleChange}
//                   value={formData.description}
//                   InputLabelProps={{ shrink: true }}
//                   error={formErrors.description}
//                   sx={{
//                     width: '100%',
//                     overflow: 'hidden',
//                     maxHeight: '200px'
//                   }}
//                   multiline
//                   rows={4}
//                   inputProps={{
//                     style: {
//                       overflowX: 'auto'
//                     },
//                   }}
//                 />
//               </Grid>
//               <Grid
//                 xs={12}
//                 md={6}
//               >
//                 <Stack spacing={2}>
//                   <TextField
//                   fullWidth
//                   label="Location / address"
//                   name="origin"
//                   error={formErrors.location}
//                   disabled={isFormDisabled}
//                   onChange={handleChange}
//                   value={formData.origin}
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 </Stack>
                
//               </Grid>
//               {!isFormDisabled &&
//                 <Grid
//                   container
//                   xs={12}
//                 >
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="User Manual Link"
//                       name="manual_link"
//                       onChange={handleChange}
//                       type="text"
//                       value={formData.manual_link}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <TextField
//                       fullWidth
//                       label="Manufacturer Datasheet Link"
//                       name="datasheet_link"
//                       onChange={handleChange}
//                       type="text"
//                       value={formData.datasheet_link}
//                       InputLabelProps={{ shrink: true }}
//                     />
//                   </Grid>
//                   <Grid
//                     xs={12}
//                     md={6}
//                   >
//                     <Checkbox
//                       name="validation"
//                       disabled={isFormDisabled}
//                       checked={checked}
//                       onChange={handleCheckBoxChange}
//                       color="primary"
//                       inputProps={{ 'aria-label': 'checkbox' }}
//                     />
//                     <Typography variant="caption" color="textSecondary">
//                       If checked, a validation from the contact person will be needed.
//                     </Typography>
//                   </Grid>
//                 </Grid>
//               }
//               {isFormDisabled && checked &&
//                 <Grid xs={12}
//                   md={6}>
//                 <Typography variant="caption" color="textSecondary">
//                   A validation from the contact person is needed.
//                 </Typography>
//                 </Grid>
//               }
//             </Grid>
//           </Box>
//         </CardContent>
//         <Divider />
//         {!isFormDisabled &&
//           <CardActions sx={{ justifyContent: 'flex-end' }}>
//             <Button
//               type="submit"
//               variant="contained"
//             >
//               Save details
//             </Button>
//           </CardActions>
//         }
//       </Card>
//     </form>
//     : <p>...Loading</p>
//   );
// };




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
  Autocomplete
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useAuth } from 'src/hooks/use-auth';
import { toast } from 'react-toastify';
import config from 'src/utils/config';
import { consumableTypes, lab_supplyTypes } from 'src/data/static_data';
import moment from 'moment';
import { getCookie } from '../../utils/csrf';
import { useTheme } from '@mui/material/styles';

import { useTranslation } from 'react-i18next';

// -------------------------------------------------------------------------------- //

export const MaterialDetailEdit = (props) => {
  const user = useAuth().user;
  const theme = useTheme();
  
  const { t } = useTranslation();

  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [materialID, setMaterialID] = useState(null);
  const [formData, setFormData] = useState({});
  const [checked, setChecked] = useState(false);
  const [ownersList, setOwnersList] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [selectSubType, setSelectedSubType] = useState(null);
  const [expiration_date, setexpiration_date] = useState(null);
  const [formErrors, setFormErrors] = useState({
        title: false,
        description: false,
        owner: false,
        location: false,
        type : false,
        sub_type:false,
  });

  const handleCheckBoxChange = useCallback(() => {
    setChecked((prevState) => !prevState);
  }, []);

  const handleChangeNumDec = useCallback((event) => {
    const { name, value } = event.target;

    let cleaned = value
      .replace(/[^0-9.]/g, "") 
      .replace(/(\..*)\./g, "$1"); 

    setFormData((prev) => ({
      ...prev,
      [name]: cleaned
    }));
  }, []);


  const handleChangeNum = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value.replace(/\D/g, "")
    }));
  }, []);



  const handleChange = useCallback(
    (event) => {
      setFormData((prevData) => ({
        ...prevData,
        [event.target.name]: event.target.value
      }));
    }, []);
  
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
  }, [formData]);

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

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const newErrors = {
        title: formData.material_title === null,
        description: formData.description === null,
        owner: selectedOwner === null,
        location: formData.origin === null,
        type : formData.type === null,
        sub_type: formData.sub_type === null,
      };
      setFormErrors(newErrors);

      if (!Object.values(newErrors).some(error => error)) {
        const form = new FormData();
        const fieldsToAppend = [
          { key: 'material_id', value: materialID },
          { key: 'material_title', value: formData.material_title },
          { key: 'description', value: formData.description },
          { key: 'manual_link', value: formData.manual_link },
          { key: 'datasheet_link', value: formData.datasheet_link },
          { key: 'user', value: selectedOwner.user_id },
          { key: 'origin', value: formData.origin },
          { key: 'validation', value: formData.validation },
          { key: 'type', value: formData.type },
          { key: 'sub_type', value: selectSubType },
          { key: 'quantity_available', value: formData.quantity_available },
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
              toast.success(t('materialDetailEdit.messages.successUpdate', "Material details updated successfully!"), { autoClose: false });
              window.location.reload()
            }

          } catch (error) {
            toast.error(t('materialDetailEdit.messages.errorSubmit', "Error trying to submit: {{error}}", { error }), { autoClose: false });
          }
        }
      }
    }, [formData, materialID, selectedOwner, selectSubType, t]);

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
      setMaterialID(props.data.material_id);
      setSelectedSubType(newData.sub_type)
      if (newData.expiration_date) {
        setexpiration_date(new Date(newData.expiration_date));
      }

      if (ownersList) {
        const targetUserId = newData.user || props.data.owner_details?.user_id;
        const matchedOwner = ownersList.find((owner) => Number(owner.user_id) === Number(targetUserId));
        
        if (matchedOwner) {
          setSelectedOwner(matchedOwner);
        } else if (props.data?.owner_details) {
          // Fallback: Manually construct an object matching what Autocomplete expects
          setSelectedOwner({
            user_id: targetUserId,
            owner_name: `${props.data.owner_details.first_name || ''} ${props.data.owner_details.last_name || ''}`.trim() || 'Unknown Owner'
          });
        } else {
          setSelectedOwner(null);
        }
      }

    }
  }, [props.data,ownersList,user]);

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
          subheader={!isFormDisabled ? t('materialDetailEdit.cardSubheader', "The information can be edited") : ""}
          title={t('materialDetailEdit.cardTitle', "Details")}
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
                  label={t('materialDetailEdit.fields.title', "Title")}
                  disabled={isFormDisabled}
                  name="material_title"
                  onChange={handleChange}
                  value={formData.material_title || ''}
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
                    label={t('materialDetailEdit.fields.contactPerson', "Contact person")}
                    disabled={isFormDisabled}
                    value={props.data.owner_details && (`${props.data.owner_details.first_name} ${props.data.owner_details.last_name}`)}
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                  {!isFormDisabled &&(
                    <Grid item xs={12} style={{ paddingRight: 0 }}>
                      <Autocomplete
                        name="user_id"
                        required
                        value={selectedOwner}
                        options={ownersList || []}
                        getOptionLabel={option => option.owner_name}
                        onChange={onSelectChange}
                        renderInput={params => (
                          <TextField
                            {...params}
                            variant="standard"
                            label={t('materialDetailEdit.fields.ownerLabel', "Contact person (activate account to see your name)")}
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

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label={t('materialDetailEdit.fields.type', "Type")}
                  name="type"
                  helperText={!isFormDisabled ? t('materialDetailEdit.helpers.typeDisabled', "This field can't be edited.") : ""}
                  disabled
                  value={
                    formData.type === "LAB_SUPPLIES" ? t('staticData.materialTypes.LAB_SUPPLIES', "Lab Supplies") :
                    formData.type === "CONSUMABLES" ? t('staticData.materialTypes.CONSUMABLES', "Consumables") : 
                    formData.type || ''
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
                    renderValue={(value) => {
                      const typeList = formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes;
                      const i18nKey = formData.type === "CONSUMABLES" ? 'consumableTypes' : 'lab_supplyTypes';
                      const found = typeList.find(type => type.value === value);
                      return (
                        <Typography>
                          {found ? t(`staticData.${i18nKey}.${found.value}`, found.label) : ""}
                        </Typography>
                      )
                    }}
                  >
                    {(formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes).map((type) => {
                      const i18nKey = formData.type === "CONSUMABLES" ? 'consumableTypes' : 'lab_supplyTypes';
                      return (
                        <MenuItem key={type.value}
                          value={type.value}>
                          {t(`staticData.${i18nKey}.${type.value}`, type.label)}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Grid>
                }
              {isFormDisabled &&
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t('materialDetailEdit.fields.subType', "Sub Type")}
                    disabled={isFormDisabled}
                    value={(() => {
                      const typeList = formData.type === "CONSUMABLES" ? consumableTypes : lab_supplyTypes;
                      const i18nKey = formData.type === "CONSUMABLES" ? 'consumableTypes' : 'lab_supplyTypes';
                      const found = typeList.find(type => type.value === formData.sub_type);
                      return found ? t(`staticData.${i18nKey}.${found.value}`, found.label) : "";
                    })()}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              }

              {formData.type === "CONSUMABLES" &&
                <Grid xs={12}
                  md={6}>
                  <LocalizationProvider>
                    <DatePicker
                      label={t('materialDetailEdit.fields.expirationDate', "Expiration Date")}
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
                    label={t('materialDetailEdit.fields.duration', "Duration")}
                    name="loan_duration"
                    disabled={isFormDisabled}
                    onChange={handleChangeNum}
                    value={formData.loan_duration || ''}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{t('materialDetailEdit.helpers.days', "days")}</InputAdornment>,
                    }}
                  />
                </Grid>
              }
              {/* End of lab_supplies_type */}

              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('materialDetailEdit.fields.availableQuantity', "Available Quantity")}
                  name="quantity_available"
                  disabled={isFormDisabled}
                  onChange={formData.type === "CONSUMABLES" ? handleChangeNumDec : handleChangeNum}
                  value={formData.quantity_available || ''}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label={t('materialDetailEdit.fields.description', "Description")}
                  name="description"
                  disabled={isFormDisabled}
                  onChange={handleChange}
                  value={formData.description || ''}
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
              <Grid
                xs={12}
                md={6}
              >
                <Stack spacing={2}>
                  <TextField
                  fullWidth
                  label={t('materialDetailEdit.fields.location', "Location / address")}
                  name="origin"
                  error={formErrors.location}
                  disabled={isFormDisabled}
                  onChange={handleChange}
                  value={formData.origin || ''}
                  InputLabelProps={{ shrink: true }}
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
                      label={t('materialDetailEdit.fields.manualLink', "User Manual Link")}
                      name="manual_link"
                      onChange={handleChange}
                      type="text"
                      value={formData.manual_link || ''}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('materialDetailEdit.fields.datasheetLink', "Manufacturer Datasheet Link")}
                      name="datasheet_link"
                      onChange={handleChange}
                      type="text"
                      value={formData.datasheet_link || ''}
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
                      {t('materialDetailEdit.helpers.validationNeededCheck', "If checked, a validation from the contact person will be needed.")}
                    </Typography>
                  </Grid>
                </Grid>
              }
              {isFormDisabled && checked &&
                <Grid xs={12}
                  md={6}>
                <Typography variant="caption" color="textSecondary">
                  {t('materialDetailEdit.helpers.validationNeededText', "A validation from the contact person is needed.")}
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
              {t('materialDetailEdit.buttons.saveDetails', "Save details")}
            </Button>
          </CardActions>
        }
      </Card>
    </form>
    : <p>{t('materialDetailEdit.loading', "...Loading")}</p>
  );
};