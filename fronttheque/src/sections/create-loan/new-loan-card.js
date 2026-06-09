import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Box,
  TextField,
  Autocomplete,
  Alert,
  Unstable_Grid2 as Grid, Checkbox, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { withRouter } from 'next/router';
import { useNewLoanHandlers } from 'src/hooks/new-loan-handlers';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';
import { MaterialDetailCalendar } from '../material-detail/material-detail-calendar';
import React from 'react';

const NewLoanCard = (props) => {
  const theme = useTheme();
  const {
    materialsArray,
    startDate,
    endDate,
    message,
    handleStartDateChange,
    handleEndDateChange,
    handleChange,
    onSelectChange,
    handleSubmit,
    selectedMaterial,
    formErrors,
    formData,
    handleChangeNum,
    handleChangeNumDec,
    maxDate,
    events,
    formation_required,
    handleFormation_required,
  } = useNewLoanHandlers(props);

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card >
        <CardHeader
          subheader="Fill the information to submit your loan"
          title="Loan Information"
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
                {materialsArray ? 
                <Autocomplete
                  fullWidth
                  required
                  options={materialsArray}
                  getOptionLabel={option => option.material_title}
                  value={selectedMaterial? selectedMaterial : null}
                  onChange={onSelectChange}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Materials *"
                      placeholder="Select a material"
                      margin="normal"
                      fullWidth
                      error={formErrors.material}
                      helperText={formErrors.material && 'Please select a material'}
                    />
                  )}
                /> : null }
              </Grid>
              <Grid xs={12} sm={6}>
                <LocalizationProvider>
                  <DatePicker
                    label="Start Date *"
                    value={startDate}
                    onChange={handleStartDateChange}
                    minDate={new Date()}
                    fullWidth
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        error: formErrors.startDate,
                        helperText: formErrors.startDate ? "La date de debut est obligatoire" : "",
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              {selectedMaterial?.type !== 'CONSUMABLES' && (
                <Grid xs={12} sm={6}>
                  <LocalizationProvider>
                    <DatePicker
                      label="End Date *"
                      value={endDate}
                      onChange={handleEndDateChange}
                      minDate={startDate || new Date()}
                      maxDate={maxDate }
                      fullWidth
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          error: formErrors.endDate,
                          helperText: formErrors.endDate ? "La date de fin est obligatoire" : "",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              )}
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="transaction_quantity"
                  name="transaction_quantity"
                  placeholder="Ex. 1"
                  value={formData.transaction_quantity || ""}
                  onChange={selectedMaterial?.type === "CONSUMABLES" ? handleChangeNumDec : handleChangeNum}
                  type="text"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    inputMode:
                      selectedMaterial?.type === "CONSUMABLES"
                        ? "decimal"
                        : "numeric",
                  }}
                  sx={{
                    input: {
                      "&::placeholder": {
                        opacity: 1,
                        color: theme.palette.text.secondary
                      }
                    }
                  }}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  error={formErrors.location}
                  helperText={formErrors.location && 'Please select a location'}
                  onChange={handleChange}
                  type="text"
                  required
                  placeholder="Ex. Room 203"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    input: {
                      "&::placeholder": {
                        opacity: 1,
                        color: theme.palette.text.secondary
                      }
                    }
                  }}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Note to Owner"
                  name="message"
                  onChange={handleChange}
                  type="text"
                  multiline
                  rows={4}
                  placeholder="Write your message to the owner here..."
                />
              </Grid>
              {message && message.status?
              <Grid
                xs={12}
                md={6}
              >
                <Alert severity={message.status}> {message.value}</Alert>
              </Grid> : null }
            </Grid>
          </Box>
        </CardContent>
        {selectedMaterial && selectedMaterial.is_formation_required &&(
          <Grid>
            <Checkbox
              name="formation_required"
              checked={formation_required}
              onChange={handleFormation_required}
              error={formErrors.formation_required}
              color="primary"
              inputProps={{ 'aria-label': 'checkbox' }}
            />
            <Typography variant="caption" color="textSecondary"
              style={{
                color: !formErrors.formation_required ? "black" : "red",
                fontWeight: !formErrors.formation_required ? "normal" : "bold",
              }}>
              I certify that I have the necessary skills and training to handle this equipment safely.
            </Typography>
          </Grid>
        )}

        <Divider />
        
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            type = "submit"
            variant="contained">
            Borrow
          </Button>
        </CardActions>
      </Card>
      <Grid>
        {selectedMaterial && selectedMaterial.type === "LAB_SUPPLIES" &&(
          <MaterialDetailCalendar
          data={events}
        />)
        }
      </Grid>
    </form>

  );
};

export default withRouter(NewLoanCard);