import {
  Checkbox, 
  Button, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Card, 
  CardActions, 
  CardContent, 
  CardHeader, 
  Divider, 
  Box, 
  TextField, 
  Alert, 
  Typography, 
  Switch, 
  FormControl, 
  SvgIcon, 
  Autocomplete, 
  Unstable_Grid2 as Grid,
  Accordion, 
  AccordionSummary, 
  AccordionDetails
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

// 1. Import translation hook
import { useTranslation } from 'react-i18next';

const NewMaterialDetails = (props) => {
  const theme = useTheme();
  const ownersArray = props.ownersList
  
  // 2. Initialize translation
  const { t } = useTranslation();

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
          subheader={t('newMaterial.form.subheader', 'Fill the material information')}
        />
        <CardContent sx={{ pt: 2 }}>
          <Accordion expanded={expandedSections['general']} 
            onChange={() => handleAccordionChange('general')}
          >
            <AccordionSummary aria-controls="general-content" 
              id="general-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">{t('newMaterial.form.generalInfo', 'General Information')}</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('newMaterial.form.title', 'Title')}
                    name="material_title"
                    onChange={handleChange}
                    type="text"
                    required
                    error={formErrors.title}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <Select
                      labelId="material-type-label"
                      name="type"
                      value={formData.type || ''}
                      onChange={handleChange}
                      MenuProps={{ PaperProps: { style: { maxHeight: '200px', overflowY: 'auto' } } }}
                      displayEmpty
                      renderValue={(value) => {
                        const selectedType = materialTypes.find(type => type.value === value);
                        return (
                          <Typography
                            variant="subtitle2"
                            style={{
                              fontFamily: 'inherit',
                              color: value ? 'inherit' : theme.palette.text.secondary
                            }}
                          >
                            {value && selectedType 
                              ? t(`staticData.materialTypes.${selectedType.value}`, selectedType.label) 
                              : t('newMaterial.form.materialType', 'Material Type')}
                          </Typography>
                        )
                      }}
                    >
                      {materialTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {t(`staticData.materialTypes.${type.value}`, type.label)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6} md={12} sm={12}>
                  <TextField
                    fullWidth
                    label={t('newMaterial.form.description', 'Description')}
                    name="description"
                    multiline
                    rows={4}
                    inputProps={{ maxLength: 255 }}
                    onChange={handleChange}
                    type="text"
                    required
                    placeholder={t('newMaterial.form.descriptionPlaceholder', 'Describe the material here to help others ...')}
                    error={formErrors.description}
                  />
                </Grid>

                <Grid container xs={12} sm={6}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('newMaterial.form.quantity', 'Quantity')}
                      name="quantity_available"
                      defaultValue={1}
                      value={formData.quantity_available || "" }
                      onChange={formData.type === "CONSUMABLES" ? handleChangeNumDec : handleChangeNum}
                      inputProps={{ inputMode: "decimal" }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Supply Information section */}
          {(formData.type === "LAB_SUPPLIES" || formData.type === 'CONSUMABLES') && (
            <Accordion 
              expanded={expandedSections[formData.type]} 
              onChange={() => handleAccordionChange(formData.type)} 
              defaultExpanded
            >
              <AccordionSummary>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="overline">
                    {/* Dynamically translate the category name alongside 'Information' */}
                    {t('newMaterial.form.dynamicInfo', '{{type}} Information', { 
                        type: t(`staticData.materialTypes.${formData.type}`, formData.type.replace('_', ' ')) 
                    })}
                  </Typography>
                  <SvgIcon fontSize="smaller">
                    <ChevronRightIcon />
                  </SvgIcon>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
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
                            const selected = lab_supplyTypes.find((type) => type.value === value);
                            return (
                              <Typography>
                                {value && selected
                                  ? t(`staticData.lab_supplyTypes.${selected.value}`, selected.label)
                                  : t('newMaterial.form.labSupplyType', "Lab Supply Type")}
                              </Typography>
                            );
                          }
                          if (formData.type === "CONSUMABLES") {
                            const selected = consumableTypes.find((type) => type.value === value);
                            return (
                              <Typography>
                                {value && selected
                                  ? t(`staticData.consumableTypes.${selected.value}`, selected.label)
                                  : t('newMaterial.form.consumableType', "Consumable Type")}
                              </Typography>
                            );
                          }
                          return <Typography>{t('newMaterial.form.selectType', 'Select a type')}</Typography>;
                        }}
                      >
                        {formData.type === "LAB_SUPPLIES" &&
                          lab_supplyTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {t(`staticData.lab_supplyTypes.${type.value}`, type.label)}
                            </MenuItem>
                          ))}

                        {formData.type === "CONSUMABLES" &&
                          consumableTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {t(`staticData.consumableTypes.${type.value}`, type.label)}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {formData.type === "LAB_SUPPLIES" && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={
                          <>
                            {t('newMaterial.form.allowedLoanDuration', 'Allowed Loan Duration')} <span style={{ fontSize: '0.8em', fontWeight: 'normal' }}>{t('newMaterial.form.typeNumberInDays', '(Type a number in days.*)')}</span>
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
                      <Grid item xs={12} sm={6}>
                        <LocalizationProvider>
                          <DatePicker
                            label={t('newMaterial.form.expirationDate', 'Expiration Date')}
                            onChange={handleDateChange}
                            format="dd/MM/yyyy"
                            sx={{ width: "100%" }}
                            slotProps={{ actionBar: { actions: ['clear'] } }}
                          />
                        </LocalizationProvider>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <Select
                            labelId="unit-label"
                            name="unit"
                            value={formData.unit || ''}
                            onChange={handleChange}
                            displayEmpty
                            renderValue={(value) => {
                                const selected = unitList.find(type => type.value === value);
                                return (
                                <Typography
                                    variant="subtitle2"
                                    style={{ fontFamily: 'inherit', color: value ? 'inherit' : theme.palette.text.secondary }}
                                >
                                    {value && selected ? t(`staticData.unitList.${selected.value}`, selected.label) : t('newMaterial.form.unit', 'Unit')}
                                </Typography>
                                )
                            }}
                          >
                            {unitList.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {t(`staticData.unitList.${type.value}`, type.label)}
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

          <Accordion expanded={expandedSections['supplier']} onChange={() => handleAccordionChange('supplier')}>
            <AccordionSummary aria-controls="supplier-content" id="supplier-header">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">{t('newMaterial.form.supplierInfo', 'Supplier Information')}</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid container direction="row" justify="center" xs={12} sm={6}>
                  <Grid container alignItems="center" style={{ width: '100%' }}>
                    {ownersArray && (
                      <Grid item xs={8} style={{ paddingRight: 8 }}>
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
                              label={t('newMaterial.form.ownerPlaceholder', 'Owner (activate account to see your name)')}
                              margin="normal"
                              error={formErrors.owner}
                              sx={{ marginTop: 0 }}
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                    )}

                    <Grid item xs={4}>
                      <Box display="flex" alignItems="center">
                        <Checkbox
                          checked={isShared}
                          onChange={handleSharedChange}
                          color="primary"
                        />
                        <Typography variant="caption" color="textSecondary">
                          {t('newMaterial.form.sharedMaterial', 'Shared material')}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Select
                    fullWidth
                    labelId="team-select"
                    name="team"
                    onChange={handleChange}
                    value={formData.team}
                    displayEmpty
                    renderValue={(selected) => (
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontFamily: 'inherit',
                          color: selected ? 'inherit' : theme.palette.text.secondary
                        }}
                      >
                        {selected || t('newMaterial.form.selectTeam', 'Select your team')}
                      </Typography>
                    )}
                  >
                    {teams.map((team, index) => (
                      <MenuItem key={index} value={team}>
                        {team}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expandedSections['loan']} onChange={() => handleAccordionChange('loan')}>
            <AccordionSummary aria-controls="loan-content" id="loan-header">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">{t('newMaterial.form.loanInfo', 'Loan Information')}</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('newMaterial.form.location', 'Location')}
                    name="origin"
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder={t('newMaterial.form.locationPlaceholder', 'Ex. Room 203')}
                    InputLabelProps={{ shrink: true }}
                    error={formErrors.location}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Checkbox
                    checked={isValidationChecked}
                    onChange={handleCheckChange}
                    color="primary"
                  />
                  <Typography variant="caption" color="textSecondary">
                    {t('newMaterial.form.askValidation', 'Ask for validation')}
                  </Typography>
                </Grid>
                <Grid container xs={12} sm={12}>
                  <Grid item xs={12} sm={12}>
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
                        <Typography variant="caption" color="textSecondary">
                          {t('newMaterial.form.enableLoanDuration', 'Enable Loan Duration')}
                        </Typography>
                      }
                    />
                  </Grid>
                  {isDurationEnabled && (<>
                    <Grid item xs={12} lg={6} md ={6} sm={12}>
                      <Typography variant="caption" color="textSecondary">
                        {t('newMaterial.form.typeNumberInDaysLabel', 'Type a number in days.')}<span>*</span>
                      </Typography>
                      <TextField
                        type="number"
                        label={t('newMaterial.form.allowedLoanDuration', 'Allowed Loan Duration')}
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

          <Accordion expanded={expandedSections['additional']} onChange={() => handleAccordionChange('additional')}>
            <AccordionSummary aria-controls="additional-content" id="additional-header">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="overline">{t('newMaterial.form.additionalInfo', 'Additional Information')}</Typography>
                <SvgIcon fontSize="smaller">
                  <ChevronRightIcon />
                </SvgIcon>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid container xs={12}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t('newMaterial.form.userManualLink', 'User Manual Link')}
                      name="manual_link"
                      onChange={handleChange}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                       fullWidth
                       label={t('newMaterial.form.datasheetLink', 'Manufacturer Datasheet Link')}
                       name="datasheet_link"
                       onChange={handleChange}
                       type="text"
                    />
                  </Grid>
                </Grid>
                <Grid container xs={12}>
                  <Grid item xs={12} sm={6}>
                    <Grid container direction="row" alignItems="center" spacing={2} xs={12}>
                      <Grid item sm={12} style={{ flexGrow: 1 }}>
                        <Autocomplete
                          disablePortal
                          value={selectedCode}
                          inputValue={inputCNValue}
                          onInputChange={handleInputCNChange}
                          options={filteredCNOptions}
                          getOptionLabel={(option) => option.Label}
                          isOptionEqualToValue={(option, value) => {
                            return option.Code === value.Code && option.Label === value.Label;
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="standard"
                              label={t('newMaterial.form.codeNacre', 'Code Nacre')}
                              margin="normal"
                              sx={{ marginTop: 0 }}
                              fullWidth
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
                              <div key={option.id} onClick={() => handleCodeNChange(option.key)}>
                                <Typography variant="caption">{option.key}</Typography>
                                <Divider />
                              </div>);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Grid container direction="row" spacing={2}>
                      <Grid item sm={8} style={{ flexGrow: 1 }}>
                        <TextField
                          type="number"
                          label={t('newMaterial.form.purchasePrice', 'Purchase Price (Approximatively)')}
                          name="purchase_price"
                          min={1}
                          onChange={handleChange}
                          fullWidth 
                        />
                      </Grid>
                      <Grid item sm={4}>
                        <Typography variant="caption" color="textSecondary" style={{ padding: '8px' }}>
                          {t('newMaterial.form.inEuros', 'In Euros.')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {message && message.status && (
            <Grid item xs={12} sm={6}>
              <Alert severity={message.status}> {message.value}</Alert>
            </Grid>)}
        </CardContent>
        <Divider />

        <CardActions sx={{ px: 3, py: 2 }}>
          <Button
            fullWidth
            variant={filesSelected ? "contained" : "outlined"}
            color={filesSelected ? "success" : "primary"}
            component="label"
            sx={{ borderWidth: filesSelected ? 0 : 2, '&:hover': { borderWidth: filesSelected ? 0 : 2 } }}
          >
            {filesSelected 
                ? t('newMaterial.form.picturesSelected', 'Pictures Selected') 
                : t('newMaterial.form.uploadPictures', 'Upload Pictures')}
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
            {t('newMaterial.form.maxPhotosNote', 'Note that you can only upload a maximum of two photos at a time!')}
        </Typography>
        <Divider />

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="contained"
          >
            {t('newMaterial.form.btnCreate', 'Create')}
          </Button>
          {isUploading && (
            <Loading message={t('newMaterial.form.uploading', 'Uploading')} />
          )}
        </CardActions>
      </Card>
    </form>
  );
};

export default withRouter(NewMaterialDetails);