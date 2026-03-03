import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const LoansSearch = ({ searchTerm, onSearchChange }) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={searchTerm}
      onChange={onSearchChange}
      fullWidth
      placeholder="Material Name/ Borrower Name/ Owner Name"
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: 800 }}
    />
  </Card>
);
