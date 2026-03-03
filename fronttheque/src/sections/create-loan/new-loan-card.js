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
  Unstable_Grid2 as Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { withRouter } from 'next/router';
import { useNewLoanHandlers } from 'src/hooks/new-loan-handlers';
import { useTheme } from '@mui/material/styles';

const NewLoanCard = (props) => {
  const theme = useTheme();
  const {
    materialsArray,
    startDate,
    endDate,
    message,
    handleStartDateChange,
    handleEndDateChange,
    isDateStartDisabled,
    isDateEndDisabled,
    handleChange,
    onSelectChange,
    handleSubmit,
    selectedMaterial,
    formErrors
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
                      label="Materials"
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
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    shouldDisableDate={isDateStartDisabled} // Apply custom disabling logic
                    fullWidth
                    format="dd/MM/yyyy"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid xs={12} sm={6}>
                <LocalizationProvider>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    disablePast // Disable dates in the past
                    minDate={startDate ? startDate : new Date()} // Minimum date is the day after the start date
                    shouldDisableDate={isDateEndDisabled} // Apply custom disabling logic
                    fullWidth
                    format="dd/MM/yyyy"
                  />
                </LocalizationProvider>
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

        <Divider />
        
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button
            type = "submit"
            variant="contained">
            Borrow
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default withRouter(NewLoanCard);