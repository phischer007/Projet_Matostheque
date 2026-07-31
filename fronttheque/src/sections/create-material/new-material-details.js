import {
  Checkbox, Button, Select, MenuItem, FormControlLabel, Card, CardActions, CardContent, CardHeader, Divider, 
  Box, TextField, Alert, Typography, Switch, FormControl, SvgIcon, Autocomplete, Unstable_Grid2 as Grid,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { withRouter } from 'next/router';
import { useNewMaterialHandlers } from 'src/hooks/new-material-handlers';
import { Loading } from 'src/sections/loader/loader-card';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useTheme } from '@mui/material/styles';
import { teams, materialTypes, consumableTypes, unitList, lab_supplyTypes } from 'src/data/static_data'

import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { useState } from 'react';

const NewMaterialDetails = (props) => {
  const theme = useTheme();
  const ownersArray = props.ownersList
  
  const {
    isValidationChecked,
    isShared,
    formData,
    message,
    selectedOwner,
    handleCheckChange,
    handleSharedChange,
    handleChange,
    handleChangeNum,
    handleChangeNumDec,
    handleDateChange,
    handleSubmit,
    handleFileChange,
    filesSelected,
    onSelectChange,
    codeError,
    isUploading,
    formErrors,
    isDurationEnabled,
    handleToggleChange,
    expandedSections,
    handleAccordionChange,
    filteredCNOptions,
    selectedCode,
    inputCNValue,
    handleInputCNChange,
    handleCodeNChange

  } = useNewMaterialHandlers(ownersArray);


  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card elevation={8} 
        sx={{ borderRadius: 2 }}
      >
        <CardHeader
          subheader="Fill the material information"
        />
        <CardContent sx={{ pt: 2 }}>
          <Accordion expanded={expandedSections['general']} 
            onChange={() => handleAccordionChange('general')}
          >
            <AccordionSummary aria-controls="general-content" 
              id="general-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">General Information</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container 
                spacing={3}
              >
                <Grid 
                  item 
                  xs={12} 
                  sm={6}
                >
                  <TextField
                    fullWidth
                    label="Title"
                    name="material_title"
                    onChange={handleChange}
                    type="text"
                    required
                    error={formErrors.title}
                  />
                </Grid>
                <Grid 
                  item 
                  xs={12} 
                  sm={6}
                >
                  <FormControl fullWidth>
                    <Select
                      labelId="material-type-label"
                      name="type"
                      value={formData.type || ''}
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
                          {value ? materialTypes.find(type => type.value === value)?.label : 'Material Type'}
                        </Typography>
                      )}
                    >
                      {materialTypes.map((type) => (
                        <MenuItem 
                          key={type.value} 
                          value={type.value}
                        >
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid 
                  item 
                  xs={12} 
                  lg={6} 
                  md={12} 
                  sm={12}
                >
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 255 }}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder="Describe the material here to help others ..."
                    error={formErrors.description}
                  />
                </Grid>

                <Grid container 
                  xs={12} 
                  sm={6}
                >
                  {/* Quantity Input */}
                  <Grid item 
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Quantity"
                      name="quantity_available"
                      defaultValue={1}
                      value={formData.quantity_available || "" }
                      onChange={formData.type === "CONSUMABLES" ? handleChangeNumDec : handleChangeNum}
                      inputProps={{
                        inputMode: "decimal", // clavier numérique mobile
                      }}
                    />
                  </Grid>
                </Grid>

              </Grid>
            </AccordionDetails>
          </Accordion>
          {/* \end{code} */}

         {/* Supply Information section */}
          {(formData.type === "LAB_SUPPLIES" || formData.type === 'CONSUMABLES') && (
            <Accordion 
              expanded={expandedSections[formData.type]} 
              onChange={() => handleAccordionChange(formData.type)} 
              defaultExpanded
            >
              <AccordionSummary>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="overline">{formData.type.replace('_', ' ')} Information</Typography>
                  <SvgIcon fontSize="smaller">
                    <ChevronRightIcon />
                  </SvgIcon>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container 
                  spacing={3}
                >
                  <Grid item 
                    xs={12} 
                    sm={6}
                  >
                    <FormControl fullWidth>
                      <Select
                        labelId="sub-type-label"
                        name="sub_type"
                        error={formErrors.sub_type}
                        value={formData.sub_type}
                        onChange={handleChange}
                        displayEmpty
                        renderValue={(value) => {
                          if (formData.type === "LAB_SUPPLIES") {
                            return (
                              <Typography>
                                {value
                                  ? lab_supplyTypes.find((type) => type.value === value)?.label
                                  : "Lab Supply Type"}
                              </Typography>
                            );
                          }

                          if (formData.type === "CONSUMABLES") {
                            return (
                              <Typography>
                                {value
                                  ? consumableTypes.find((type) => type.value === value)?.label
                                  : "Consumable Type"}
                              </Typography>
                            );
                          }

                          return <Typography>Select a type</Typography>;
                        }}
                      >
                        {formData.type === "LAB_SUPPLIES" &&
                          lab_supplyTypes.map((type) => (
                            <MenuItem key={type.value} 
                              value={type.value}
                            >
                              {type.label}
                            </MenuItem>
                          ))}

                        {formData.type === "CONSUMABLES" &&
                          consumableTypes.map((type) => (
                            <MenuItem key={type.value} 
                              value={type.value}
                            >
                              {type.label}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {formData.type === "LAB_SUPPLIES" && (
                    <Grid item 
                      xs={12} 
                      sm={6}
                    >
                      <TextField
                        label={
                          <>
                            Allowed Loan Duration <span style={{ fontSize: '0.8em', fontWeight: 'normal' }}>(Type a number in days.*)</span>
                          </>
                        }
                        name="loan_duration"
                        defaultValue={30}
                        value={formData.loan_duration || ''}
                        onChange={handleChangeNum}
                        error={formErrors.loan_duration}
                        helperText={formErrors.loan_duration}
                        inputProps={{ inputMode: "decimal" }}
                        fullWidth
                      />
                    </Grid>
                  )}

                  {formData.type === "CONSUMABLES" && (
                    <>
                      {/* Expiration Date */}
                      <Grid item 
                        xs={12} 
                        sm={6}
                      >
                        <LocalizationProvider>
                          <DatePicker
                            label="Expiration Date"
                            onChange={handleDateChange}
                            format="dd/MM/yyyy"
                            sx={{ width: "100%" }}
                            slotProps={{
                              actionBar: {
                                actions: ['clear']
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>

                      {/* Unit Select */}
                      <Grid item 
                        xs={12} 
                        sm={6}
                      >
                        <FormControl fullWidth>
                          <Select
                            labelId="unit-label"
                            name="unit"
                            value={formData.unit || ''}
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
                                {value ? unitList.find(type => type.value === value)?.label : 'Unit'}
                              </Typography>
                            )}
                          >
                            {unitList.map((type) => (
                              <MenuItem
                                key={type.value}
                                value={type.value}
                              >
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
          {/* End of Supply information */}

          <Accordion expanded={expandedSections['supplier']} 
            onChange={() => handleAccordionChange('supplier')}
          >
            <AccordionSummary aria-controls="supplier-content" 
              id="supplier-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">Supplier Information</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container 
                spacing={3}
              >
                <Grid container 
                  direction="row" 
                  justify="center" 
                  xs={12} 
                  sm={6}
                >
                  <Grid 
                    container 
                    alignItems="center" 
                    style={{ width: '100%' }}
                  >
                    {ownersArray && (
                      <Grid 
                        item 
                        xs={8} 
                        style={{ paddingRight: 8 }}
                      >
                        <Autocomplete
                          required
                          options={ownersArray}
                          getOptionLabel={option => option.owner_name}
                          value={selectedOwner}
                          onChange={onSelectChange}
                          renderInput={params => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Owner (activate account to see your name)"
                              margin="normal"
                              error={formErrors.owner}
                              sx={{ marginTop: 0 }}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                    )}

                    <Grid 
                      item 
                      xs={4}
                    >
                      <Box 
                        display="flex" 
                        alignItems="center"
                      >
                        <Checkbox
                          checked={isShared}
                          onChange={handleSharedChange}
                          color="primary"
                          inputProps={{ 'aria-label': 'checkbox' }}
                        />
                        <Typography variant="caption" 
                          color="textSecondary"
                        >
                          Shared material
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid 
                  item 
                  xs={12} 
                  sm={6}
                >
                  <Select
                    fullWidth
                    labelId="team-select"
                    name="team"
                    onChange={handleChange}
                    value={formData.team}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: '200px',
                          overflowY: 'auto',
                        },
                      },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: formErrors.team ? 'red' : null,
                      },
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                      },
                    }}
                    displayEmpty
                    renderValue={(selected) => (
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontFamily: 'inherit',
                          color: selected ? 'inherit' : theme.palette.text.secondary
                        }}
                      >
                        {selected || 'Select your team'}
                      </Typography>
                    )}
                  >
                    {teams.map((team, index) => (
                      <MenuItem 
                        key={index} 
                        value={team}
                      >
                        {team}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Loan Information section */}
          <Accordion 
            expanded={expandedSections['loan']} 
            onChange={() => handleAccordionChange('loan')}
          >
            <AccordionSummary 
              aria-controls="loan-content" 
              id="loan-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">Loan Information</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid 
                container 
                spacing={3}
              >
                <Grid 
                  item 
                  xs={12} 
                  sm={6}
                >
                  <TextField
                    fullWidth
                    label="Location"
                    name="origin"
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder='Ex. Room 203'
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      input: {
                        "&::placeholder": {
                          opacity: 1,
                          color: theme.palette.text.secondary
                        }
                      }
                    }}
                    error={formErrors.location}
                  />
                </Grid>
                <Grid 
                  item 
                  xs={12} 
                  sm={6}
                >
                  <Checkbox
                    checked={isValidationChecked}
                    onChange={handleCheckChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'checkbox' }}
                  />
                  <Typography 
                    variant="caption" 
                    color="textSecondary"
                  >
                    Ask for validation
                  </Typography>
                </Grid>
                <Grid 
                  container 
                  xs={12} 
                  sm={12}
                >
                  <Grid 
                    item 
                    xs={12} 
                    sm={12}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isDurationEnabled}
                          onChange={handleToggleChange}
                          color="primary"
                        />
                      }
                      sx={{ px: 1, width: 250 }}
                      label={
                        <Typography 
                          variant="caption" 
                          color="textSecondary"
                        >
                          Enable Loan Duration
                        </Typography>
                      }
                    />
                  </Grid>
                  {isDurationEnabled && (<>
                    <Grid 
                      item 
                      xs={12} 
                      lg={6} 
                      md ={6} 
                      sm={12}
                    >
                      <Typography 
                        variant="caption" 
                        color="textSecondary"
                      >
                        Type a number in days.<span>*</span>
                      </Typography>
                      <TextField
                        type="number"
                        label="Allowed Loan Duration"
                        name="loan_duration"
                        value={formData.loan_duration}
                        onChange={handleChange}
                        error={formErrors.loan_duration}
                        helperText={formErrors.loan_duration}
                        inputProps={{ min: 1, max: 365 }}
                        fullWidth
                      />
                    </Grid>

                  </>)}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Additional Information section */}
          <Accordion 
            expanded={expandedSections['additional']} 
            onChange={() => handleAccordionChange('additional')}
          >
            <AccordionSummary 
              aria-controls="additional-content" 
              id="additional-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">Additional Information</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid 
                container 
                spacing={3}
              >
                <Grid 
                  container 
                  xs={12}
                >
                  <Grid
                    item 
                    xs={12} 
                    sm={6}
                  >
                    <TextField
                      fullWidth
                      label="User Manual Link"
                      name="manual_link"
                      onChange={handleChange}
                      type="text"
                    />
                  </Grid>
                  <Grid 
                    item 
                    xs={12} 
                    sm={6}
                  >
                    <TextField
                       fullWidth
                       label="Manufacturer Datasheet Link"
                       name="datasheet_link"
                       onChange={handleChange}
                       type="text"
                    />
                  </Grid>
                </Grid>
                <Grid 
                  container 
                  xs={12}
                >
                  <Grid 
                    item 
                    xs={12} 
                    sm={6}
                  >
                    <Grid 
                      container 
                      direction="row" 
                      alignItems="center" 
                      spacing={2} 
                      xs={12}
                    >
                      <Grid 
                        item 
                        sm={12} 
                        style={{ flexGrow: 1 }}
                      >
                        <Autocomplete
                          disablePortal
                          value={selectedCode}
                          inputValue={inputCNValue}
                          onInputChange={handleInputCNChange}
                          options={filteredCNOptions}
                          getOptionLabel={(option) => option.Label}
                          isOptionEqualToValue={(option, value) => {
                            // Customize the equality test here
                            return option.Code === value.Code && option.Label === value.Label;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label="Code Nacre"
                              margin="normal"
                              sx={{ marginTop: 0 }}
                              fullWidth

                              // adding MagnifyingGlass to the Code Nacre textbox
			                        InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <MagnifyingGlassIcon style={{ marginRight: 480 }} />
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }}

                            />
                          )}
                          renderOption={(option) => {
                            return (
                              <div key={option.id} 
                                onClick={() => handleCodeNChange(option.key)}
                              >
                                <Typography variant="caption">{option.key}</Typography>
                                <Divider />
                              </div>);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid 
                    item 
                    xs={12} 
                    sm={6}
                  >
                    <Grid 
                      container 
                      direction="row" 
                      spacing={2}
                    >
                      <Grid 
                        item 
                        sm={8} 
                        style={{ flexGrow: 1 }}
                      >
                        <TextField
                          type="number"
                          label="Purchase Price (Approximatively)"
                          name="purchase_price"
                          min={1}
                          onChange={handleChange}
                          fullWidth  // Set TextField to take up full width
                        />
                      </Grid>
                      <Grid 
                        item 
                        sm={4}
                      >
                        <Typography 
                          variant="caption" 
                          color="textSecondary" 
                          style={{ padding: '8px' }}
                        >
                          In Euros.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {message && message.status && (
            <Grid 
              item 
              xs={12} 
              sm={6}
            >
              <Alert severity={message.status}> {message.value}</Alert>
            </Grid>)}
        </CardContent>
        <Divider />

        {/* <CardActions>
          <Button
            fullWidth
            variant="text"
            component="label"
            style={{ color: filesSelected ? 'green' : 'primary' }}
          >
            {filesSelected ? 'Pictures Selected' : 'Upload Pictures'}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Button>
        </CardActions> */}

        <CardActions sx={{ px: 3, py: 2 }}>
          {/* 2. Made button outlined to stand out more, switching to contained + green when files are selected */}
          <Button
            fullWidth
            variant={filesSelected ? "contained" : "outlined"}
            color={filesSelected ? "success" : "primary"}
            component="label"
            sx={{ borderWidth: filesSelected ? 0 : 2, '&:hover': { borderWidth: filesSelected ? 0 : 2 } }}
          >
            {filesSelected ? 'Pictures Selected' : 'Upload Pictures'}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </Button>
        </CardActions>

        <Divider />

        {/* Maximum number of images to be uploaded  */}
        <Typography
            variant="caption"
            sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center', 
              color: 'red', 
              marginTop: 1 ,
              fontSize: '0.8rem',
              }}>
            Note that you can only upload a maximum of two photos at a time!
        </Typography>
        <Divider />

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {/* Create button */}
          <Button 
            type="submit" 
            variant="contained"
          >
            Create
          </Button>
          {/* Loading indicator */}
          {isUploading && (
            <Loading message={'Uploading'} />
          )}
        </CardActions>
      </Card>
    </form>
  );
};

export default withRouter(NewMaterialDetails);
